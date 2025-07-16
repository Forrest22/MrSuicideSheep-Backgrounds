package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

const (
	channelID   = "UC5nc_ZtjKW1htCVZVRxlQAQ" // MrSuicideSheep
	outputFile  = "videos.json"
	playlistAPI = "https://www.googleapis.com/youtube/v3/playlistItems"
)

type Video struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

const channelsAPI = "https://www.googleapis.com/youtube/v3/channels"

func getUploadsPlaylistID(apiKey string) (string, error) {
	url := fmt.Sprintf(
		"%s?key=%s&part=contentDetails&id=%s",
		channelsAPI, apiKey, channelID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		Items []struct {
			ContentDetails struct {
				RelatedPlaylists struct {
					Uploads string `json:"uploads"`
				} `json:"relatedPlaylists"`
			} `json:"contentDetails"`
		} `json:"items"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	if len(result.Items) == 0 {
		return "", fmt.Errorf("no channel found")
	}

	return result.Items[0].ContentDetails.RelatedPlaylists.Uploads, nil
}

func fetchVideosFromPlaylist(apiKey, playlistID string, limit int) ([]Video, error) {
	var allVideos []Video
	nextPageToken := ""
	pageCount := 0

	for {
		url := fmt.Sprintf(
			"%s?key=%s&playlistId=%s&part=snippet&maxResults=",
			playlistAPI, apiKey, playlistID,
		)
		if nextPageToken != "" {
			url += "&pageToken=" + nextPageToken
		}

		resp, err := http.Get(url)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		var data struct {
			NextPageToken string `json:"nextPageToken"`
			Items         []struct {
				Snippet struct {
					Title       string `json:"title"`
					Description string `json:"description"`
					ResourceID  struct {
						VideoID string `json:"videoId"`
					} `json:"resourceId"`
				} `json:"snippet"`
			} `json:"items"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			return nil, err
		}

		for _, item := range data.Items {
			allVideos = append(allVideos, Video{
				ID:          item.Snippet.ResourceID.VideoID,
				Title:       item.Snippet.Title,
				Description: item.Snippet.Description,
			})
		}

		pageCount++
		fmt.Printf("Fetched page %d (%d total videos)\n", pageCount, len(allVideos))

		if data.NextPageToken == "" || len(allVideos) >= limit {
			break
		}
		nextPageToken = data.NextPageToken
	}

	if len(allVideos) > limit {
		allVideos = allVideos[:limit]
	}

	return allVideos, nil
}

func saveVideos(videos []Video) error {
	data, err := json.MarshalIndent(videos, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(outputFile, data, 0644)
}

func main() {
	loadEnv()
	apiKey := os.Getenv("YOUTUBE_API_KEY")
	if apiKey == "" {
		log.Fatal("Missing YOUTUBE_API_KEY in .env")
	}

	playlistID, err := getUploadsPlaylistID(apiKey)
	if err != nil {
		log.Fatalf("Failed to get uploads playlist: %v", err)
	}

	videos, err := fetchVideosFromPlaylist(apiKey, playlistID, 150)
	if err != nil {
		log.Fatalf("Failed to fetch videos: %v", err)
	}

	if err := saveVideos(videos); err != nil {
		log.Fatalf("Failed to save videos: %v", err)
	}

	fmt.Printf("✅ Saved %d videos to %s\n", len(videos), outputFile)
}
