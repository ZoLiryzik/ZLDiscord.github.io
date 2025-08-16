document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('review-form');
    const messageDiv = document.getElementById('message');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      messageDiv.textContent = '';
      messageDiv.className = 'message';
  
      const reviewText = document.getElementById('reviewText').value;
      const rating = parseInt(document.getElementById('rating').value, 10);
  
      const reviewData = {
        reviewText,
        rating
      };
  
      try {
        const response = await fetch('https://srv.zoliryzik.ru/api/submit-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewData)
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          messageDiv.textContent = data.message;
          messageDiv.classList.add('success');
          form.reset(); // Очистить форму после успешной отправки
        } else {
          messageDiv.textContent = data.message || 'Произошла ошибка при отправке.';
          messageDiv.classList.add('error');
        }
      } catch (error) {
        console.error('Ошибка сети:', error);
        messageDiv.textContent = 'Ошибка сети. Пожалуйста, попробуйте еще раз.';
        messageDiv.classList.add('error');
      }
    });
  });