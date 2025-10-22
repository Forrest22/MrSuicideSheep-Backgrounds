# MrSuicideSheep Backgrounds

MrSuicideSheep is a core part of my music taste and I also find his artwork choices really beautiful, so I made this to appreciate them.

🌐 **Try it here:** <https://forrest22.github.io/MrSuicideSheep-Backgrounds/>

## Technical Choices

I wanted this to be hosted on GitHub Pages, so I designed this to be lean, with a quick and dirty storage layer for the youtube metadata. The scraper, in `/scarper` is a simple GoLang routine to get the metadata I need using the Youtube API. It takes that metadata and writes it to `videos.json` which then is used by the simple JavaScript script to generate the thumbnails.

I had a lot of fun doing small (S)CSS learnings and was proudly able to make a CSS glitch effect based off of Chris Coyier's wonderful [Glitch Effect on Text / Images / SVG](https://css-tricks.com/glitch-effect-text-images-svg/) since I didn't know how to use mixins in the beginning of this project.

Swiper proved to be a very easy to use library and I am very happy with how it works as a gallery modal.

## Future Roadmap

I would like to in the future follow up on the following feature ideas:

- Self updater of images
  - This would mean having to support the images myself so that they can be pre-sorted, otherwise it would only have the current page's images?
- Sort via color groupings as per <https://tomekdev.com/posts/sorting-colors-in-js>
