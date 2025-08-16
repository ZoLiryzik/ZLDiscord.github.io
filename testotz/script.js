document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const loadingMessage = document.getElementById('loading-message');

    // Функция для получения и отображения отзывов
    const fetchReviews = async () => {
        try {
            const response = await fetch('https://srv.zoliryzik.ru/api/feedbacks');
            const data = await response.json();

            // Удаляем сообщение о загрузке
            loadingMessage.style.display = 'none';

            if (data.success && data.data.length > 0) {
                data.data.forEach(review => {
                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'review-card';

                    const metaDiv = document.createElement('div');
                    metaDiv.className = 'review-meta';

                    const authorSpan = document.createElement('span');
                    authorSpan.className = 'review-author';
                    authorSpan.textContent = review.username;

                    const ratingSpan = document.createElement('span');
                    ratingSpan.className = 'review-rating';
                    ratingSpan.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                    metaDiv.appendChild(authorSpan);
                    metaDiv.appendChild(ratingSpan);

                    const textP = document.createElement('p');
                    textP.className = 'review-text';
                    textP.textContent = review.text;

                    reviewCard.appendChild(metaDiv);
                    reviewCard.appendChild(textP);

                    reviewsContainer.appendChild(reviewCard);
                });
            } else {
                reviewsContainer.innerHTML = '<p id="no-reviews-message">Отзывов пока нет.</p>';
            }
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            reviewsContainer.innerHTML = '<p id="error-message">Произошла ошибка при загрузке отзывов. Попробуйте еще раз позже.</p>';
        }
    };

    fetchReviews();
});
