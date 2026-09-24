import { galleryArtworks } from './gallery-data.js';

export function mountContent() {
  const $ = (s) => document.querySelector(s);

  // 1. GALLERY (이미지 전용 Pinterest 스타일 Masonry)
  let currentArtworkIndex = 0;

  function renderGallery() {
    const masonryContainer = $('#gallery-masonry');
    if (!masonryContainer) return;

    masonryContainer.innerHTML = galleryArtworks.map((art, index) => `
      <article class="masonry-item">
        <button class="artwork-card" type="button" data-index="${index}" aria-label="작품 ${index + 1} 크게 보기">
          <img src="${art.thumbnail || art.image}" alt="작품 ${index + 1}" loading="lazy" decoding="async">
        </button>
      </article>
    `).join('');
  }

  // 2. GALLERY LIGHTBOX DETAIL VIEWER (이미지 전용 간결한 뷰어)
  const lightbox = $('#gallery-lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxClose = $('#lightbox-close');
  const lightboxPrev = $('#lightbox-prev');
  const lightboxNext = $('#lightbox-next');
  const lightboxBackdrop = $('#lightbox-backdrop');

  let lastActiveElement = null;

  function updateLightboxView() {
    if (!galleryArtworks.length) return;
    const art = galleryArtworks[currentArtworkIndex];
    if (!art) return;

    lightboxImg.src = art.image;
    lightboxImg.alt = `작품 ${currentArtworkIndex + 1}`;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastActiveElement = document.activeElement;
    currentArtworkIndex = index;
    updateLightboxView();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  function prevArtwork() {
    if (!galleryArtworks.length) return;
    currentArtworkIndex = (currentArtworkIndex - 1 + galleryArtworks.length) % galleryArtworks.length;
    updateLightboxView();
  }

  function nextArtwork() {
    if (!galleryArtworks.length) return;
    currentArtworkIndex = (currentArtworkIndex + 1) % galleryArtworks.length;
    updateLightboxView();
  }

  // 갤러리 카드 클릭 시 라이트박스 열기
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-index]');
    if (!card || !$('#gallery-masonry')?.contains(card)) return;
    const index = parseInt(card.dataset.index, 10);
    if (!isNaN(index)) {
      openLightbox(index);
    }
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevArtwork(); });
  lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); nextArtwork(); });

  // 키보드 네비게이션 (ESC, ←, →)
  window.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevArtwork();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextArtwork();
    }
  });

  // 모바일 터치 스와이프 제스처
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchEndX = touchStartX;
      touchEndY = touchStartY;
    }
  }, { passive: true });

  lightbox?.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightbox?.addEventListener('touchend', () => {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextArtwork();
      } else {
        prevArtwork();
      }
    }
  });

  renderGallery();

  // 3. LOGS (모험 일지)
  const logs = [
    { date: '2026.09.17', tag: 'NEW DRAWING', title: '작은 마을의 문을 열었어요.', body: '그림을 그리고, 화분에 물을 주고, 가끔은 아무것도 하지 않는 곳. 이 작은 세계에 들러 주셔서 고마워요.' },
    { date: '2026.09.15', tag: 'DAILY', title: '도마뱀이 또 화분을 엎었다.', body: '범인은 모른 척 햇볕을 쬐고 있습니다. 흙을 치우고, 화분은 조금 더 안전한 곳으로 옮겨 두었어요.' },
    { date: '2026.09.12', tag: 'SKETCH', title: '좋아하는 초록색을 모으는 중.', body: '풀잎의 초록, 이끼의 초록, 도마뱀의 초록. 비슷해 보여도 하나씩 다른 색을 스케치북에 남겼어요.' }
  ];

  const allLogsEl = $('#all-logs');
  if (allLogsEl) {
    allLogsEl.innerHTML = logs.map(l => `
      <article class="log-entry">
        <time datetime="${l.date.replaceAll('.', '-')}">
          ${l.date.slice(5)}<small style="display:block">${l.date.slice(0, 4)}</small>
        </time>
        <div>
          <small>${l.tag}</small>
          <h2>${l.title}</h2>
          <p>${l.body}</p>
        </div>
      </article>
    `).join('');
  }

  // 4. CALENDAR & DETAIL DIALOG
  const dialog = $('#detail');
  let dialogOpener = null;

  function showDialog(html) {
    if (!dialog) return;
    dialogOpener = document.activeElement;
    $('#detail-content').innerHTML = html;
    dialog.showModal();
    $('#close-dialog')?.focus();
  }

  $('#close-dialog')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('close', () => dialogOpener?.focus());
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dialog.close();
      }
    }
  });

  let displayedMonth = new Date();
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);

  const events = {
    '2026-9-12': { icon: '✎', title: '초록색 스케치', type: 'DRAWING' },
    '2026-9-17': { icon: '★', title: '작은 마을 오픈', type: 'EVENT' },
    '2026-9-21': { icon: '●', title: '커미션 스케치', type: 'COMMISSION' },
    '2026-9-26': { icon: '♥', title: '느긋하게 쉬기', type: 'PERSONAL' }
  };

  function renderCalendar() {
    const y = displayedMonth.getFullYear();
    const m = displayedMonth.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const offset = new Date(y, m, 1).getDay();
    const today = new Date();

    const monthTitle = $('#month-title');
    if (monthTitle) {
      monthTitle.textContent = `${y} . ${String(m + 1).padStart(2, '0')}`;
    }

    const calendarDays = $('#calendar-days');
    if (calendarDays) {
      calendarDays.innerHTML = Array.from({ length: offset }, () => '<span aria-hidden="true"></span>').join('') +
        Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const key = `${y}-${m + 1}-${d}`;
          const ev = events[key];
          const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
          return `
            <button class="day ${isToday ? 'today' : ''}" data-day="${key}" aria-label="${y}년 ${m + 1}월 ${d}일${ev ? ' ' + ev.title : ''}">
              <span>${d}</span>
              ${ev ? `<span class="event">${ev.icon}</span>` : ''}
            </button>
          `;
        }).join('');
    }
  }

  $('#prev-month')?.addEventListener('click', () => {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    renderCalendar();
  });

  $('#next-month')?.addEventListener('click', () => {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);
    renderCalendar();
  });

  $('#calendar-days')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-day]');
    if (!b) return;
    const ev = events[b.dataset.day];
    showDialog(`
      <p class="eyebrow">QUEST CALENDAR</p>
      <h2 class="detail-title">${b.dataset.day.replaceAll('-', ' . ')}</h2>
      ${ev ? `<p style="font-size:16px;font-weight:bold;margin:12px 0;">${ev.icon} ${ev.title}</p><p class="detail-tag" style="color:var(--orange);">${ev.type} · 오늘의 퀘스트</p>` : '<p>정해진 퀘스트가 없는 날.</p><p>오늘은 마음 가는 대로 보내요.</p>'}
    `);
  });

  renderCalendar();

  return { showDialog, dialog };
}
