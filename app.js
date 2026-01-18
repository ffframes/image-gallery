const container = document.getElementById('thumbnails');
const bigImage = document.getElementById('image-container');

let currentIndex = 0;
const thumbnailElements = [];

const announcer = document.createElement('div');
announcer.setAttribute('aria-live', 'polite');
announcer.setAttribute('aria-atomic', 'true');
announcer.classList.add('sr-only');
document.body.appendChild(announcer);

const images = [
    { url: "https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002", alt: "mountain landscape with lake" },
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", alt: "sunset over Yosemite Valley" },
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", alt: "blue lake in the mountains" },
    { url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6", alt: "snowy forest at dusk" },
    { url: "https://plus.unsplash.com/premium_photo-1666863909125-3a01f038e71f", alt: "desert dunes under starlight" },
    { url: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5", alt: "green valley morning mist" },
    { url: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7", alt: "coastal cliffs and ocean" },
    { url: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8", alt: "autumn forest path" },
    { url: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5", alt: "rugged mountain peak" },
    { url: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40", alt: "hot air balloons over valley" }
];

function changeBackground(index) {
    currentIndex = index;
    const imageObj = images[index];
    const clickedElement = thumbnailElements[index];

    const baseUrl = imageObj.url.split('?')[0];
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    const targetWidth = screenWidth < 768 ? Math.round(screenWidth * dpr) : 1600;
    
    const optimizedUrl = `${baseUrl}?auto=format&fit=crop&q=75&w=${targetWidth}`;
    
    const imgLoader = new Image();
    imgLoader.src = optimizedUrl;
    imgLoader.onload = () => {
        bigImage.style.backgroundImage = `url(${optimizedUrl})`;
    };

    bigImage.setAttribute('role', 'img');
    bigImage.setAttribute('aria-label', `Currently viewing: ${imageObj.alt}`);
    announcer.textContent = `Main image changed to: ${imageObj.alt}`;

    thumbnailElements.forEach((img, i) => {
        const isActive = i === index;
        img.classList.toggle('active', isActive);
        img.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    
    clickedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % images.length;
        changeBackground(nextIndex);
    } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        changeBackground(prevIndex);
    }
});

images.forEach((image, index) => {
    const imgElement = document.createElement('img');
    
    const baseUrl = image.url.split('?')[0]; 
    const params = "?auto=format&fit=crop&q=60";

    imgElement.alt = image.alt;
    imgElement.role = "button";
    imgElement.tabIndex = 0;
    imgElement.loading = "lazy";
    imgElement.decoding = "async";
    
    imgElement.srcset = `
        ${baseUrl}${params}&w=200 200w,
        ${baseUrl}${params}&w=400 400w,
        ${baseUrl}${params}&w=800 800w
    `;

    imgElement.sizes = "(max-width: 768px) 120px, 200px";
    imgElement.src = `${baseUrl}${params}&w=400`;

    imgElement.addEventListener('click', () => changeBackground(index));
    imgElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            changeBackground(index);
        }
    });

    thumbnailElements.push(imgElement);
    container.appendChild(imgElement);
});

if (images.length > 0) {
    changeBackground(0);
}