const gallery = document.getElementById('gallery');
const modal = document.getElementById('carouselModal');
const carouselSlides = document.getElementById('carouselSlides');
const videoMeta = document.getElementById('videoMeta');

let allVideos = [];
let loadedCount = 0;
const LOAD_CHUNK = 12;

// YouTube thumbnail from video ID
function generateThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

// Render a chunk of videos from current loadedCount
function renderNextChunk() {
  const nextChunk = allVideos.slice(loadedCount, loadedCount + LOAD_CHUNK);

  nextChunk.forEach(video => {
    const imgUrl = generateThumbnail(video.id);
    const div = document.createElement('div');
    div.classList.add('relative', 'aspect-[16/9]', 'overflow-hidden', 'bg-gray-900');

    div.innerHTML = `
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <img src="${imgUrl}" alt="${video.title}"
           class="w-full h-full object-cover opacity-0 transition-opacity duration-500 cursor-pointer"
           onload="this.style.opacity=1; this.previousElementSibling.remove()"
           onerror="this.style.opacity=1; this.previousElementSibling.remove()"
           onclick='openCarousel(${JSON.stringify(video)})' />
    `;

    gallery.appendChild(div);
  });

  loadedCount += LOAD_CHUNK;
}



// Lazy load on scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
    // Load more if available
    if (loadedCount < allVideos.length) {
      renderNextChunk();
    }
  }
});

// Open modal with swiper
function openCarousel(video) {
  const fullImage = generateThumbnail(video.id);

  carouselSlides.innerHTML = `
    <div class="swiper-slide">
      <img src="${fullImage}" class="w-full h-auto max-h-[80vh] object-contain" />
    </div>
  `;

  videoMeta.innerHTML = `
    <h2 class="text-xl font-bold mt-2">${video.title}</h2>
    <p class="text-sm opacity-80 mt-2">${video.description}</p>
    <a href="https://youtube.com/watch?v=${video.id}" target="_blank" 
       class="text-cyan-400 underline mt-2 block">Watch on YouTube</a>
  `;

  modal.classList.remove('hidden');

  new Swiper('.swiper-container', {
    loop: true
  });
}

function closeCarousel() {
  modal.classList.add('hidden');
  carouselSlides.innerHTML = '';
  videoMeta.innerHTML = '';
}

// Close modal on click outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeCarousel();
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeCarousel();
  }
});

// Load videos.json and start initial render
fetch('videos.json')
  .then(res => res.json())
  .then(videoList => {
    allVideos = videoList;
    renderNextChunk(); // initial load
  })
  .catch(err => {
    console.error('Failed to load video list:', err);
  });
