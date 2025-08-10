        // Отображение текущего года
        document.getElementById("current-year").textContent = new Date().getFullYear();

        // Функция для открытия модального окна
        function openModal(id) {
            const modal = document.getElementById(`modal${id}`);
            if (modal) {
                modal.style.display = "flex"; // Показываем окно с flexbox
            }
        }



        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
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

        document.addEventListener('DOMContentLoaded', () => {
            const screenshotBlocks = document.querySelectorAll('.js-hover');
        
            screenshotBlocks.forEach(block => {
                block.addEventListener('click', () => {
                    // Переключаем класс 'is-active' на текущем блоке
                    block.classList.toggle('is-active');
        
                    // Убираем 'is-active' со всех остальных блоков
                    screenshotBlocks.forEach(otherBlock => {
                        if (otherBlock !== block) {
                            otherBlock.classList.remove('is-active');
                        }
                    });
                });
            });
        });


        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
        
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', function() {
                    navLinks.classList.toggle('show');
                });
            }
        });