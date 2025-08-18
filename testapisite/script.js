const BASE_URL = 'https://srv.zoliryzik.ru'; // Убедитесь, что здесь HTTPS

const authForm = document.getElementById('auth-form');
const confirmBtn = document.getElementById('confirm-btn');
const getReviewsBtn = document.getElementById('get-reviews-btn');
const authSection = document.getElementById('auth-section');
const reviewsSection = document.getElementById('reviews-section');
const authMessage = document.getElementById('auth-message');
const reviewsMessage = document.getElementById('reviews-message');
const reviewsList = document.getElementById('reviews-list');

let accessToken = null;
let refreshToken = null;
let tempToken = null;

// Проверяем, есть ли уже сессия в localStorage
function checkSession() {
    refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        refreshAccessToken();
    }
}

// Отправляет запрос на обновление Access Token
async function refreshAccessToken() {
    if (!refreshToken) return;

    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json().catch(() => null);
        if (!data || !data.success) {
            console.error('Не удалось обновить токен:', data ? data.error : 'Некорректный ответ сервера');
            localStorage.removeItem('refreshToken');
            authSection.classList.remove('hidden');
            reviewsSection.classList.add('hidden');
            authMessage.textContent = 'Сессия истекла. Пожалуйста, войдите снова.';
            return;
        }

        accessToken = data.accessToken;
        authSection.classList.add('hidden');
        reviewsSection.classList.remove('hidden');
        authMessage.textContent = 'Сессия успешно восстановлена.';
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        localStorage.removeItem('refreshToken');
        authSection.classList.remove('hidden');
        reviewsSection.classList.add('hidden');
        authMessage.textContent = 'Произошла ошибка при восстановлении сессии. Пожалуйста, попробуйте снова.';
    }
}

// Обработка отправки формы аутентификации
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    authMessage.textContent = 'Запрос отправлен...';
    authForm.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json().catch(() => null);

        if (!data || !data.success) {
            authMessage.textContent = `Ошибка аутентификации: ${data ? data.error : 'Некорректный ответ сервера'}`;
            authForm.classList.remove('hidden');
            return;
        }
        
        tempToken = data.token;
        authMessage.textContent = 'Временный токен отправлен на вашу почту. Пожалуйста, перейдите по ссылке в письме и затем нажмите кнопку "Подтвердить"';
        confirmBtn.classList.remove('hidden');
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        authMessage.textContent = 'Произошла ошибка при отправке запроса.';
        authForm.classList.remove('hidden');
    }
});

// Обработка кнопки "Подтвердить"
confirmBtn.addEventListener('click', async () => {
    if (!tempToken) {
        authMessage.textContent = 'Сначала запросите токен.';
        return;
    }

    authMessage.textContent = 'Подтверждение токена...';
    confirmBtn.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}/api/auth/check-token?token=${tempToken}`);
        
        const data = await response.json().catch(() => null);
        
        if (!data || !data.authenticated) {
            authMessage.textContent = `Подтверждение не удалось: ${data ? data.error : 'Некорректный ответ сервера'}`;
            authForm.classList.remove('hidden');
            return;
        }
        
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        
        authSection.classList.add('hidden');
        reviewsSection.classList.remove('hidden');
        authMessage.textContent = '✅ Аутентификация завершена. Сессия сохранена.';
        
    } catch (error) {
        console.error('Ошибка при подтверждении токена:', error);
        authMessage.textContent = 'Произошла ошибка при подтверждении токена.';
        authForm.classList.remove('hidden');
    }
});

// Обработка кнопки "Получить отзывы"
getReviewsBtn.addEventListener('click', async () => {
    if (!accessToken) {
        reviewsMessage.textContent = 'Вы не авторизованы. Пожалуйста, пройдите аутентификацию.';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/otz`, {
            method: 'GET',
            headers: { 'X-Api-Key': accessToken }
        });

        const data = await response.json().catch(() => null);
        
        if (response.status === 401) {
            reviewsMessage.textContent = 'Токен истёк. Попытка обновления...';
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                getReviewsBtn.click();
            } else {
                reviewsMessage.textContent = 'Не удалось обновить токен. Пожалуйста, авторизуйтесь снова.';
            }
            return;
        }

        if (data && data.success) {
            reviewsList.innerHTML = '';
            if (data.data.length > 0) {
                data.data.forEach(review => {
                    const reviewEl = document.createElement('div');
                    reviewEl.classList.add('reviews-item');
                    reviewEl.innerHTML = `<strong>${review.username}</strong> (Рейтинг: ${review.rating}/5): ${review.text}`;
                    reviewsList.appendChild(reviewEl);
                });
            } else {
                reviewsList.innerHTML = '<p>Отзывы не найдены.</p>';
            }
            reviewsMessage.textContent = 'Отзывы успешно загружены.';
        } else {
            reviewsMessage.textContent = `Ошибка: ${data ? data.error : 'Некорректный ответ сервера'}`;
        }
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        reviewsMessage.textContent = 'Произошла ошибка при загрузке отзывов.';
    }
});

document.addEventListener('DOMContentLoaded', checkSession);
