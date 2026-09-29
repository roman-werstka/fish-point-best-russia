const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4200) }

document.querySelectorAll('[data-pending]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.pending)));

const interest = document.getElementById('interest');
document.querySelectorAll('[data-form-type]').forEach(button => button.addEventListener('click', () => { interest.value = button.dataset.formType; document.getElementById('request').scrollIntoView({ behavior: 'smooth' }) }));

const dialog = document.getElementById('video-dialog');
document.querySelector('[data-modal="video"]').addEventListener('click', () => dialog.showModal());
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() });

document.getElementById('lead-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `Fish Point — ${data.get('interest')}`;
  const body = [`Имя: ${data.get('name')}`, `Компания: ${data.get('company') || '—'}`, `Контакт: ${data.get('contact')}`, `Интерес: ${data.get('interest')}`, `Комментарий: ${data.get('message') || '—'}`, `Источник: BEST_RUSSIA_2026`].join('\n');
  window.location.href = `mailto:info@fishpointhotel.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast('Открываем готовое письмо. В рабочей версии заявка будет сразу поступать в CRM.');
});
