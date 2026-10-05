const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4200) }

document.querySelectorAll('[data-pending]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.pending)));

const interest = document.getElementById('interest');
document.querySelectorAll('[data-form-type]').forEach(button => button.addEventListener('click', () => { interest.value = button.dataset.formType; document.getElementById('request').scrollIntoView({ behavior: 'smooth' }) }));

const dialog = document.getElementById('video-dialog');
const hotelVideo = document.getElementById('hotel-video');

document.querySelectorAll('[data-modal="video"]').forEach(button => {
    button.addEventListener('click', () => {
        hotelVideo.src = button.dataset.video;
        hotelVideo.load();

        dialog.showModal();
        hotelVideo.play().catch(() => {
            // Можно запустить видео кнопкой плеера.
        });
    });
});

dialog.querySelector('.close').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();

    if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
    ) {
        dialog.close();
    }
});

dialog.addEventListener('close', () => {
    hotelVideo.pause();
    hotelVideo.removeAttribute('src');
    hotelVideo.load();
});

(async function initRoomGallery() {
    const grid = document.getElementById('room-gallery-grid');
    const status = document.getElementById('gallery-status');
    const photoDialog = document.getElementById('photo-dialog');
    const photo = document.getElementById('gallery-photo');
    const title = document.getElementById('photo-title');
    const counter = document.getElementById('photo-counter');

    const names = {
        standard: 'Стандарт',
        'junior-suite': 'Junior Suite',
        penthouse: 'Пентхаус',
        'spa-residence': 'SPA Residence',
        'fs-plus': 'FS+',
        'gfs-plus': 'GFS+',
        'family-suite': 'Family Suite',
        gfx: 'GFX'
    };

    let activeGroup;
    let photoIndex = 0;

    function showPhoto() {
        const item = activeGroup.photos[photoIndex];
        const category = names[activeGroup.id] || activeGroup.title;

        photo.src = item.src;
        photo.alt = `${category} — фото ${photoIndex + 1}`;
        title.textContent = category;
        counter.textContent =
            `${photoIndex + 1} / ${activeGroup.photos.length}`;
    }

    function movePhoto(direction) {
        photoIndex =
            (photoIndex + direction + activeGroup.photos.length)
            % activeGroup.photos.length;

        showPhoto();
    }

    document.getElementById('photo-close').addEventListener('click', () => {
        photoDialog.close();
    });

    document.getElementById('photo-prev').addEventListener('click', () => {
        movePhoto(-1);
    });

    document.getElementById('photo-next').addEventListener('click', () => {
        movePhoto(1);
    });

    photoDialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            movePhoto(-1);
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            movePhoto(1);
        }
    });

    photoDialog.addEventListener('click', event => {
        const bounds = photoDialog.getBoundingClientRect();

        if (
            event.target === photoDialog &&
            (
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom
            )
        ) {
            photoDialog.close();
        }
    });

    photo.addEventListener('error', () => {
        counter.textContent = 'Не удалось загрузить фото. Попробуйте следующее.';
    });

    try {
        const response = await fetch('assets/gallery/manifest.json');

        if (!response.ok) {
            throw new Error('Не удалось загрузить список фотографий');
        }

        const groups = await response.json();

        groups.forEach(group => {
            if (!group.photos.length) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'room-card';

            const cover = document.createElement('img');
            cover.src = group.cover;
            cover.alt = names[group.id] || group.title;
            cover.loading = 'lazy';
            cover.decoding = 'async';
            cover.width = 640;
            cover.height = 480;

            const body = document.createElement('span');
            body.className = 'room-card__body';

            const heading = document.createElement('span');
            heading.className = 'room-card__title';
            heading.textContent = names[group.id] || group.title;

            const link = document.createElement('span');
            link.className = 'room-card__link';
            link.textContent =
                `Смотреть фото (${group.photos.length}) ↗`;

            body.append(heading, link);
            button.append(cover, body);

            button.addEventListener('click', () => {
                activeGroup = group;
                photoIndex = 0;
                showPhoto();
                photoDialog.showModal();
            });

            grid.append(button);
        });
    } catch (error) {
        status.textContent =
            'Фотогалерея временно недоступна. Обновите страницу.';
        console.error(error);
    }
})();

const videoTrack = document.getElementById('video-track');

function scrollVideos(direction) {
    const card = videoTrack.querySelector('.video-card');
    const gap = parseFloat(getComputedStyle(videoTrack).gap) || 0;

    videoTrack.scrollBy({
        left: direction * (card.getBoundingClientRect().width + gap),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth'
    });
}

document.getElementById('video-prev').addEventListener('click', () => {
    scrollVideos(-1);
});

document.getElementById('video-next').addEventListener('click', () => {
    scrollVideos(1);
});