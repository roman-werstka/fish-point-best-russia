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
        const videoId = button.dataset.video;

        hotelVideo.src =
    `https://rutube.ru/play/embed/${videoId}/`;

        dialog.showModal();
    });
});

dialog.querySelector('.close').addEventListener('click', () => {
    dialog.close();
});

dialog.addEventListener('click', event => {
    if (event.target === dialog) {
        dialog.close();
    }
});

dialog.addEventListener('close', () => {
    hotelVideo.removeAttribute('src');
});