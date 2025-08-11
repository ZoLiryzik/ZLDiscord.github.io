document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
      selectors: {
        container: '.feed-container',
        wrapper: '.comments-container',
        loader: '.loader',
        errorState: '.error-state',
        emptyState: '.empty-state',
        data: '#data-container'
      },
      scrollSpeed: 0.7,
      gap: 15,
      delayFirstBlock: 5000,
      delayLastBlock: 5000,
      gsapIntroDuration: 1
    };
  
    const state = {
      elements: {},
      position: 0,
      animationFrame: null,
      delayTimeout: null,
      scrollState: 'init',
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      itemWidth: 0,
      maxScroll: 0
    };
  
    const initElements = () => {
      for (const key in CONFIG.selectors) {
        state.elements[key] = document.querySelector(CONFIG.selectors[key]);
      }
      return Object.values(state.elements).every(Boolean);
    };
  
    const escapeHTML = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
  
    const createComment = (review) => {
      const username = escapeHTML(review.username || 'Аноним');
      const text = escapeHTML(review.text || '');
      const rating = Number(review.rating) || 0;
  
      const div = document.createElement('div');
      div.className = 'comment';
      div.style.zIndex = 1;
      div.style.opacity = '0';
      div.style.transform = 'translateY(20px)';
      div.innerHTML = `
        <div class="comment-header">
          <strong>${username}</strong> — <span>${rating}⭐</span>
        </div>
        <div class="comment-text">${text}</div>
      `;
      return div;
    };
  
    const renderComments = (reviews) => {
      const wrapper = state.elements.wrapper;
      wrapper.innerHTML = '';
  
      if (!Array.isArray(reviews) || reviews.length === 0) {
        state.elements.emptyState.classList.remove('hidden');
        return;
      }
  
      reviews.forEach(review => wrapper.appendChild(createComment(review)));
      setTimeout(() => {
        updateScroll();
        resetScroll();
        animateIntro();
      }, 0);
    };
  
    const animateIntro = () => {
      const items = state.elements.wrapper.querySelectorAll('.comment');
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: CONFIG.gsapIntroDuration,
        stagger: 0.1,
        ease: 'power2.out',
        onComplete: startAutoScroll
      });
    };
  
    const updateScroll = () => {
      const item = state.elements.wrapper.querySelector('.comment');
      if (item) {
        state.itemWidth = item.offsetWidth + CONFIG.gap;
        state.maxScroll = state.elements.wrapper.scrollWidth - state.elements.container.offsetWidth;
      }
    };
  
    const applyScroll = () => {
      state.elements.wrapper.style.transform = `translateX(-${state.position}px)`;
    };
  
    const resetScroll = () => {
      state.position = 0;
      applyScroll();
    };
  
    const autoScroll = () => {
      if (state.isDragging || state.maxScroll <= 0) return;
  
      if (state.scrollState === 'init') {
        state.scrollState = 'scrolling';
      }
  
      if (state.scrollState === 'paused-last') {
        state.scrollState = 'scrolling';
        state.position = 0;
        applyScroll();
        state.delayTimeout = setTimeout(() => {
          requestAnimationFrame(autoScroll);
        }, CONFIG.delayFirstBlock);
        return;
      }
  
      if (state.scrollState === 'scrolling') {
        state.position += CONFIG.scrollSpeed;
        if (state.position >= state.maxScroll - state.itemWidth) {
          state.position = state.maxScroll;
          applyScroll();
          state.scrollState = 'paused-last';
          state.delayTimeout = setTimeout(() => requestAnimationFrame(autoScroll), CONFIG.delayLastBlock);
          return;
        }
        applyScroll();
        requestAnimationFrame(autoScroll);
      }
    };
  
    const startAutoScroll = () => {
      cancelAnimationFrame(state.animationFrame);
      clearTimeout(state.delayTimeout);
      state.animationFrame = requestAnimationFrame(autoScroll);
    };
  
    const initMouseDrag = () => {
      const container = state.elements.container;
      const getX = (e) => e.touches ? e.touches[0].pageX : e.pageX;
  
      const stopDrag = () => {
        state.isDragging = false;
        startAutoScroll();
      };
  
      container.addEventListener('mousedown', (e) => {
        state.isDragging = true;
        state.startX = getX(e);
        state.scrollLeft = state.position;
      });
  
      container.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;
        const dx = getX(e) - state.startX;
        state.position = Math.max(0, Math.min(state.scrollLeft - dx, state.maxScroll));
        applyScroll();
      });
  
      container.addEventListener('mouseup', stopDrag);
      container.addEventListener('mouseleave', () => { if (state.isDragging) stopDrag(); });
  
      container.addEventListener('touchstart', (e) => {
        state.isDragging = true;
        state.startX = getX(e);
        state.scrollLeft = state.position;
      }, { passive: true });
  
      container.addEventListener('touchmove', (e) => {
        if (!state.isDragging) return;
        const dx = getX(e) - state.startX;
        state.position = Math.max(0, Math.min(state.scrollLeft - dx, state.maxScroll));
        applyScroll();
      }, { passive: true });
  
      container.addEventListener('touchend', stopDrag);
    };
  
    const initNavButtons = () => {
      const nav = document.createElement('div');
      nav.className = 'carousel-nav';
      nav.innerHTML = `
        <button class="nav-btn prev-btn" aria-label="Назад">&lt;</button>
        <button class="nav-btn next-btn" aria-label="Вперёд">&gt;</button>
      `;
      state.elements.container.appendChild(nav);
  
      nav.querySelector('.prev-btn').addEventListener('click', () => {
        state.position = Math.max(0, state.position - state.itemWidth);
        applyScroll();
      });
  
      nav.querySelector('.next-btn').addEventListener('click', () => {
        state.position = Math.min(state.maxScroll, state.position + state.itemWidth);
        applyScroll();
      });
    };
  
    const showError = (msg) => {
      const errorBlock = state.elements.errorState;
      if (errorBlock) {
        errorBlock.textContent = msg;
        errorBlock.classList.remove('hidden');
      }
    };
  
    const init = () => {
      if (!initElements()) return showError('Элементы не найдены');
  
      try {
        const raw = state.elements.data?.dataset.reviews;
        if (!raw) throw new Error('Пустые данные');
  
        const reviews = JSON.parse(raw);
        renderComments(reviews);
        initMouseDrag();
        initNavButtons();
      } catch (e) {
        console.error(e);
        showError('Ошибка загрузки отзывов');
      } finally {
        state.elements.loader.classList.add('hidden');
      }
    };
  
    init();
  });