document.addEventListener('DOMContentLoaded', () => {
    // Динамическая загрузка отзывов
    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        renderReviews(data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    };
  
    // Рендеринг отзывов
    const renderReviews = (reviews) => {
      const container = document.getElementById('reviews-container');
      container.innerHTML = reviews.length > 0 
        ? reviews.map(review => `
            <div class="review-card">
              <div class="review-header">
                <img src="${review.avatar}" class="user-avatar">
                <span class="username">${review.username}</span>
                <div class="rating">
                  ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p class="review-text">${review.review_text}</p>
              <time class="review-date">
                ${new Date(review.created_at).toLocaleDateString('ru-RU')}
              </time>
            </div>
          `).join('')
        : '<div class="no-reviews">Пока нет отзывов</div>';
    };
  
    // Обработка формы
    const form = document.getElementById('review-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const response = await fetch('/submit-review', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          loadReviews();
          form.reset();
        }
      });
    }
  
    // Инициализация
    loadReviews();
  });