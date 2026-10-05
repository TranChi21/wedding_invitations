const calendar = document.querySelector('#calendar-grid');
const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
weekdays.forEach((day, index) => {
  const cell = document.createElement('div');
  cell.className = `cal-day week${index > 4 ? ' weekend' : ''}`;
  cell.textContent = day;
  calendar.append(cell);
});
// November 2026 starts on Sunday; highlight the wedding date, November 28.
const firstWeekday = (new Date(2026, 10, 1).getDay() + 6) % 7;
const daysInMonth = new Date(2026, 11, 0).getDate();
for (let i = 0; i < 42; i += 1) {
  const cell = document.createElement('div');
  const day = i - firstWeekday + 1;
  cell.className = `cal-day${i % 7 === 5 || i % 7 === 6 ? ' weekend' : ''}${day === 28 ? ' active' : ''}`;
  if (day >= 1 && day <= daysInMonth) {
    const number = document.createElement('span');
    number.textContent = String(day);
    cell.append(number);
  }
  calendar.append(cell);
}

// Thay src/thumb/caption/alt tại đây để đổi ảnh; không cần sửa CSS.
const galleryPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1718183442384-921bf92d2edf?auto=format&fit=crop&w=1000&h=1500&q=85&crop=faces',
    thumb: 'https://images.unsplash.com/photo-1718183442384-921bf92d2edf?auto=format&fit=crop&w=360&h=540&q=75&crop=faces',
    alt: 'Chú rể và cô dâu đứng cạnh nhau trong lễ cưới',
    caption: 'Khoảnh khắc bên nhau',
  },
  {
    src: 'https://images.unsplash.com/photo-1765614767040-8605ccdaa51b?auto=format&fit=crop&w=1000&h=1500&q=85&crop=faces',
    thumb: 'https://images.unsplash.com/photo-1765614767040-8605ccdaa51b?auto=format&fit=crop&w=360&h=540&q=75&crop=faces',
    alt: 'Cô dâu trong váy cưới cầm bó hoa',
    caption: 'Cô dâu trong ngày cưới',
  },
  {
    src: 'https://images.unsplash.com/photo-1737682833767-e2e250920981?auto=format&fit=crop&w=1000&h=1500&q=85&crop=faces',
    thumb: 'https://images.unsplash.com/photo-1737682833767-e2e250920981?auto=format&fit=crop&w=360&h=540&q=75&crop=faces',
    alt: 'Cô dâu và chú rể nắm tay giữa khung cảnh hoa',
    caption: 'Ngày vui dưới giàn hoa',
  },
  {
    src: 'https://images.unsplash.com/photo-1634467101088-3cd319547391?auto=format&fit=crop&w=1000&h=1500&q=85&crop=faces',
    thumb: 'https://images.unsplash.com/photo-1634467101088-3cd319547391?auto=format&fit=crop&w=360&h=540&q=75&crop=faces',
    alt: 'Cô dâu cầm bó hoa trong khung cảnh vườn',
    caption: 'Bó hoa cưới',
  },
  {
    src: 'https://images.unsplash.com/photo-1738508381284-92cb40cf9dfe?auto=format&fit=crop&w=1400&h=900&q=85&crop=faces',
    thumb: 'https://images.unsplash.com/photo-1738508381284-92cb40cf9dfe?auto=format&fit=crop&w=560&h=360&q=75&crop=faces',
    alt: 'Cô dâu chú rể cùng cầm bó hoa trong ảnh cưới',
    caption: 'Cùng nhau trong ngày vui',
  },
];

const preview = document.querySelector('#gallery-preview');
const photoViewer = document.querySelector('#photo-viewer');
const selectedPhoto = document.querySelector('#photo-selected');
const photoCaption = document.querySelector('#photo-caption');
const thumbnailTray = document.querySelector('#photo-thumbnails');
let selectedPhotoIndex = 0;

function showPhoto(index) {
  selectedPhotoIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[selectedPhotoIndex];
  selectedPhoto.src = photo.src;
  selectedPhoto.alt = photo.alt;
  photoCaption.textContent = photo.caption;
  [...thumbnailTray.children].forEach((button, buttonIndex) => {
    button.setAttribute('aria-current', String(buttonIndex === selectedPhotoIndex));
  });
  thumbnailTray.children[selectedPhotoIndex]?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

galleryPhotos.forEach((photo, index) => {
  const card = document.createElement('button');
  card.className = 'gallery-card';
  card.type = 'button';
  card.setAttribute('aria-label', `Mở ảnh ${index + 1}: ${photo.caption}`);
  const image = document.createElement('img');
  image.src = photo.thumb;
  image.alt = photo.alt;
  image.loading = index === 0 ? 'eager' : 'lazy';
  card.append(image);
  card.addEventListener('click', () => {
    showPhoto(index);
    photoViewer.showModal();
  });
  preview.append(card);

  const thumbnail = document.createElement('button');
  thumbnail.className = 'photo-thumb';
  thumbnail.type = 'button';
  thumbnail.setAttribute('aria-label', `Xem ảnh ${index + 1}: ${photo.caption}`);
  const thumbImage = document.createElement('img');
  thumbImage.src = photo.thumb;
  thumbImage.alt = '';
  thumbImage.loading = 'lazy';
  thumbnail.append(thumbImage);
  thumbnail.addEventListener('click', () => showPhoto(index));
  thumbnailTray.append(thumbnail);
});

document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(selectedPhotoIndex - 1));
document.querySelector('#photo-next').addEventListener('click', () => showPhoto(selectedPhotoIndex + 1));
document.querySelector('#photo-close').addEventListener('click', () => photoViewer.close());
photoViewer.addEventListener('click', (event) => {
  if (event.target === photoViewer) photoViewer.close();
});
document.addEventListener('keydown', (event) => {
  if (!photoViewer.open) return;
  if (event.key === 'ArrowLeft') showPhoto(selectedPhotoIndex - 1);
  if (event.key === 'ArrowRight') showPhoto(selectedPhotoIndex + 1);
});

const musicButton = document.querySelector('#music-toggle');
const audio = document.querySelector('#wedding-song');
musicButton.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.setAttribute('aria-pressed', 'true');
      musicButton.setAttribute('aria-label', 'Tắt nhạc');
    } catch {
      musicButton.setAttribute('aria-pressed', 'false');
    }
  } else {
    audio.pause();
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.setAttribute('aria-label', 'Bật nhạc');
  }
});

// Animate sections as they enter the viewport. Respect reduced-motion settings,
// and leave the page fully visible if the optional CDN script cannot be loaded.
function initScrollReveal() {
  if (!window.ScrollReveal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const reveal = window.ScrollReveal({
    distance: '24px',
    duration: 650,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    opacity: 0,
    origin: 'bottom',
    reset: false,
    viewFactor: 0.12,
  });

  reveal.reveal('.cover-title', { origin: 'top', distance: '18px', duration: 800 });
  reveal.reveal('.cover-photo', { distance: '20px', duration: 900, delay: 100 });
  reveal.reveal('.invitation-card, .event, .calendar, .site-footer', { interval: 80 });
  reveal.reveal('.tear', { origin: 'left', distance: '16px', duration: 550 });
  reveal.reveal('.gallery-card', { interval: 100, scale: 0.96 });
}

if (document.readyState === 'complete') {
  initScrollReveal();
} else {
  window.addEventListener('load', initScrollReveal, { once: true });
}
