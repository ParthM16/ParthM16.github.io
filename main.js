/* â”€â”€ PRELOAD: remove is-preload after fonts settle â”€â”€ */
window.addEventListener('load', function () {
  setTimeout(function () {
    document.body.classList.remove('is-preload');
  }, 100);
});

/* â”€â”€ MOBILE MENU AUTO-CLOSE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function () {
    var toggle = document.getElementById('nav-toggle');
    if (toggle) toggle.checked = false;
  });
});

// Uncheck mobile toggle on window resize if window is wide
window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    var toggle = document.getElementById('nav-toggle');
    if (toggle) toggle.checked = false;
  }
});

/* â”€â”€ INTRO OVERLAY SCROLL BEHAVIOUR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Mirrors the original Massively theme exactly:
   - scrolling down past ~20vh hides the overlay
   - scrolling back up reveals it again
   - once fully hidden (transitionend), removed from DOM
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
(function () {
  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var threshold = window.innerHeight * 0.2;

    if (scrollY > threshold) {
      overlay.classList.add('hidden');
    } else {
      overlay.classList.remove('hidden');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* â”€â”€ TAB SWITCHING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function switchTab(btn, role) {
  document.querySelectorAll('.role-tab').forEach(function (t) {
    t.classList.remove('active-analyst', 'active-engineer', 'active-scientist');
    t.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.role-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  btn.classList.add('active-' + role);
  btn.setAttribute('aria-selected', 'true');
  document.getElementById('panel-' + role).classList.add('active');
}

/* â”€â”€ COUNTER ANIMATION (triggers on scroll into view) */
var countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  document.querySelectorAll('.count-up').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

var impactSection = document.getElementById('impact');
if (impactSection) {
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  counterObserver.observe(impactSection);
}

/* â”€â”€ SCROLL REVEAL for cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
var revealEls = document.querySelectorAll('.project-card, .exp-card, .skill-group');
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function () {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (i % 4) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  revealObserver.observe(el);
});

/* â”€â”€ CERTIFICATION SLIDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
(function () {
  const track = document.getElementById('cert-track');
  const prevBtn = document.querySelector('.cert-prev');
  const nextBtn = document.querySelector('.cert-next');
  const dotsContainer = document.getElementById('cert-pagination');
  const slideCurrentEl = document.getElementById('cert-slide-current');
  const slideTotalEl = document.getElementById('cert-slide-total');
  const totalCountEl = document.getElementById('cert-total-count');

  if (!track) return;

  const cards = Array.from(track.children);
  const totalCerts = cards.length;
  if (totalCountEl) totalCountEl.textContent = totalCerts;

  let currentIndex = 0;
  let cardsPerSlide = 3;

  function updateLayout() {
    if (window.innerWidth <= 768) cardsPerSlide = 1;
    else if (window.innerWidth <= 1024) cardsPerSlide = 2;
    else cardsPerSlide = 3;

    let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    updateSlider();
    createDots();
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
    let totalDots = maxIndex + 1;
    if (slideTotalEl) slideTotalEl.textContent = totalDots;

    for (let i = 0; i < totalDots; i++) {
      let dot = document.createElement('button');
      dot.className = 'cert-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    if (slideCurrentEl) slideCurrentEl.textContent = currentIndex + 1;

    Array.from(dotsContainer.children).forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function updateSlider() {
    let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;

    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      track.style.transition = 'transform 0.4s ease-in-out';
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateSlider();
    });
  }

  window.addEventListener('resize', () => {
    updateLayout();
  });

  // Mouse drag, touch swipe, and trackpad support
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  const trackContainer = document.querySelector('.cert-track-container');

  if (trackContainer) {
    trackContainer.style.cursor = 'grab';

    // Touch events
    trackContainer.addEventListener('touchstart', dragStart, { passive: true });
    trackContainer.addEventListener('touchend', dragEnd);
    trackContainer.addEventListener('touchmove', dragAction, { passive: true });

    // Mouse events
    trackContainer.addEventListener('mousedown', dragStart);
    trackContainer.addEventListener('mouseup', dragEnd);
    trackContainer.addEventListener('mouseleave', dragEnd);
    trackContainer.addEventListener('mousemove', dragAction);

    // Trackpad scroll (wheel)
    let isWheeling = false;
    let wheelTimer;
    trackContainer.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return; // Let vertical scroll pass
      e.preventDefault();
      if (isWheeling) return;

      isWheeling = true;
      if (e.deltaX > 0) {
        let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
        currentIndex = Math.min(maxIndex, currentIndex + 1);
      } else if (e.deltaX < 0) {
        currentIndex = Math.max(0, currentIndex - 1);
      }
      updateSlider();

      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { isWheeling = false; }, 300);
    }, { passive: false });
  }

  function dragStart(e) {
    if (e.type === 'touchstart') {
      startPos = e.touches[0].clientX;
    } else {
      startPos = e.clientX;
      isDragging = true;
      trackContainer.style.cursor = 'grabbing';
    }
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      prevTranslate = -(currentIndex * (cardWidth + gap));
    }
  }

  function dragAction(e) {
    if (e.type === 'mousemove' && !isDragging) return;
    const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    currentTranslate = prevTranslate + currentPosition - startPos;
    track.style.transition = 'none';
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd(e) {
    if (e.type !== 'touchend') {
      isDragging = false;
      trackContainer.style.cursor = 'grab';
    }

    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > 50) { // Swipe threshold
      if (movedBy < 0) {
        currentIndex += 1;
      } else {
        currentIndex -= 1;
      }
    }

    let maxIndex = Math.max(0, totalCerts - cardsPerSlide);
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    updateSlider();
  }

  // Init
  setTimeout(updateLayout, 100);
})();
