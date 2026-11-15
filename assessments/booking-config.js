// Central booking destination for all CORE9 assessment result screens.
// Replace the empty string below with Svetlana's live booking URL when ready.
window.CORE9_BOOKING_URL = '';

window.setupBookingCta = function setupBookingCta(buttonId, statusId) {
  const btn = document.getElementById(buttonId);
  const status = document.getElementById(statusId);
  if (!btn) return;

  const url = (window.CORE9_BOOKING_URL || '').trim();
  if (url) {
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  } else {
    btn.href = '../book-session.html';
    btn.removeAttribute('target');
    btn.removeAttribute('rel');
  }
  if (status) {
    status.textContent = '';
    status.classList.add('hidden');
  }
};
