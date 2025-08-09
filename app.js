const gallery = document.getElementById("gallery");
const modal = document.getElementById("carouselModal");
const carouselSlides = document.getElementById("carouselSlides");
const videoMeta = document.getElementById("videoMeta");

let allVideos = [];
let loadedCount = 0;
const LOAD_CHUNK = 12;

let swiperInstance;

// YouTube thumbnail from video ID
function generateThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

function getVideoByVideoId(videoId) {
  return allVideos.find((video) => {
    return video.id === videoId;
  });
}

// Render a chunk of videos from current loadedCount
function renderNextChunk() {
  const nextChunk = allVideos.slice(loadedCount, loadedCount + LOAD_CHUNK);

  nextChunk.forEach((video) => {
    const imgUrl = generateThumbnail(video.id);
    const div = document.createElement("div");
    div.classList.add(
      "relative",
      "aspect-[16/9]",
      "overflow-hidden",
      "bg-gray-900"
    );

    // The following is the structure of each thumbnail, with loading spinner and glitch effects on hover
    div.innerHTML = `
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin">
        </div>
      </div>      
      <div class="glitch-img">
        <div class="glitch-layer glitch-red">
          <img src="${imgUrl}" alt="Red glitch layer for ${video.title}">
        </div>
        <div class="glitch-layer glitch-blue">
          <img src="${imgUrl}" alt="Blue glitch layer for ${video.title}">
        </div>
        <img src="${imgUrl}" alt="${video.title}" class="glitch-base w-full h-full object-cover opacity-0 transition-opacity duration-500 cursor-pointer"
            onload="this.style.opacity=1; this.closest('.glitch-img').parentElement.querySelector('.img-loader')?.remove()"
            onerror="this.style.opacity=1; this.closest('.glitch-img').parentElement.querySelector('.img-loader')?.remove()"
            onclick='openCarousel("${video.id}")'>
      </div>
    `;

    gallery.appendChild(div);
  });

  loadedCount += LOAD_CHUNK;
}

// Lazy load on scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    // Load more if available
    if (loadedCount < allVideos.length) {
      renderNextChunk();
    }
  }
});

// Populate all slides once
function populateCarousel() {
  carouselSlides.innerHTML = allVideos
    .map(
      (video) => `
    <div class="swiper-slide flex items-center justify-center">
      <img src="${generateThumbnail(video.id)}"
           alt="${video.title}"
           class="max-h-[80vh] object-contain" />
    </div>
  `
    )
    .join("");

  swiperInstance = new Swiper(".swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // Update video meta when slide changes
  swiperInstance.on("slideChange", () => {
    const realIndex = swiperInstance.realIndex;
    const video = allVideos[realIndex];
    videoMeta.innerHTML = `
      <h2 class="text-xl font-bold mt-2">${video.title}</h2>
      <p class="text-sm opacity-80 mt-2">${video.description}</p>
      <a href="https://youtube.com/watch?v=${video.id}" target="_blank" 
         class="text-cyan-400 underline mt-2 block">Watch on YouTube</a>
    `;
  });
}

// Open modal and jump to clicked slide
function openCarousel(videoId) {
  const startIndex = allVideos.findIndex((v) => v.id === videoId);
  swiperInstance.slideToLoop(startIndex); // works with loop:true

  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");

  // Trigger meta update for initial slide
  swiperInstance.emit("slideChange");
  document.addEventListener("keydown", handleArrowKeys);
}

function closeCarousel() {
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  document.removeEventListener("keydown", handleArrowKeys);
}

function handleArrowKeys(e) {
  if (!swiperInstance || modal.classList.contains("hidden")) return;
  if (e.key === "ArrowRight") swiperInstance.slideNext();
  if (e.key === "ArrowLeft") swiperInstance.slidePrev();
}

// Close modal on click outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeCarousel();
});

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeCarousel();
  }
});

// Initialize once videos are loaded
fetch("videos.json")
  .then((res) => res.json())
  .then((videoList) => {
    allVideos = videoList;
    renderNextChunk();
    populateCarousel();
  });
