document.addEventListener('DOMContentLoaded', function() {
    // Отображение текущего года
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.classList.remove('show');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Обработчик для скриншотов
    const screenshotBlocks = document.querySelectorAll('.js-hover');
    screenshotBlocks.forEach(block => {
        block.addEventListener('click', () => {
            block.classList.toggle('is-active');
            screenshotBlocks.forEach(otherBlock => {
                if (otherBlock !== block) {
                    otherBlock.classList.remove('is-active');
                }
            });
        });
    });

    // Обработчик для мобильного меню (кнопка ☰)
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    // Обработчик для кнопки Language
    const languageSelect = document.querySelector('.language-select');
    const languageLabel = languageSelect.querySelector('.language-label');
    const languageDropdown = languageSelect.querySelector('.language-dropdown');

    if (languageLabel && languageDropdown) {
        languageLabel.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем закрытие меню при клике на кнопку
            languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Скрываем меню Language, если клик был вне его
        document.addEventListener('click', function(e) {
            if (!languageSelect.contains(e.target)) {
                languageDropdown.style.display = 'none';
            }
        });
    }
});