const BASE_URL = 'https://srv.zoliryzik.ru';
const authForm = document.getElementById('auth-form');
const getReviewsBtn = document.getElementById('get-reviews-btn');
const authSection = document.getElementById('auth-section');
const reviewsSection = document.getElementById('reviews-section');
const authMessage = document.getElementById('auth-message');
const reviewsMessage = document.getElementById('reviews-message');
const reviewsList = document.getElementById('reviews-list');

let accessToken = null;
let refreshToken = null;

// Проверяем, есть ли уже сессия в localStorage
function checkSession() {
    refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        // Если Refresh Token найден, пытаемся получить новый Access Token
        refreshAccessToken();
    }
}

// Отправляет запрос на обновление Access Token
async function refreshAccessToken() {
    if (!refreshToken) return;

    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();
        if (data.success) {
            accessToken = data.accessToken;
            // Обновляем Refresh Token на случай, если сервер вернул новый
            refreshToken = data.refreshToken;
            localStorage.setItem('refreshToken', refreshToken);
            // Показываем раздел с отзывами, если аутентификация успешна
            authSection.classList.add('hidden');
            reviewsSection.classList.remove('hidden');
            authMessage.textContent = 'Сессия успешно восстановлена.';
        } else {
            console.error('Не удалось обновить токен:', data.error);
            // Если токен недействителен, удаляем его и просим повторить аутентификацию
            localStorage.removeItem('refreshToken');
            authSection.classList.remove('hidden');
            reviewsSection.classList.add('hidden');
            authMessage.textContent = 'Сессия истекла. Пожалуйста, войдите снова.';
        }
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
    }
}

// Обработка отправки формы аутентификации
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${BASE_URL}/api/auth/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            authMessage.textContent = 'Временный токен отправлен на вашу почту. Пожалуйста, перейдите по ссылке и вернитесь сюда.';
            // В идеале, после подтверждения по почте, вы должны получить Access и Refresh токены
            // Но для упрощения мы показываем, что нужно сделать вручную
        } else {
            authMessage.textContent = `Ошибка аутентификации: ${data.error}`;
        }
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        authMessage.textContent = 'Произошла ошибка при отправке запроса.';
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
            headers: {
                'X-Api-Key': accessToken
            }
        });

        const data = await response.json();
        if (response.status === 401) {
             // Если Access Token недействителен, пытаемся его обновить
            await refreshAccessToken();
            // Затем повторяем запрос
            await getReviewsBtn.click();
            return;
        }

        if (data.success) {
            reviewsList.innerHTML = ''; // Очищаем список
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
            reviewsMessage.textContent = `Ошибка: ${data.error}`;
        }
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        reviewsMessage.textContent = 'Произошла ошибка при загрузке отзывов.';
    }
});

// Запускаем проверку сессии при загрузке страницы

document.addEventListener('DOMContentLoaded', checkSession);

