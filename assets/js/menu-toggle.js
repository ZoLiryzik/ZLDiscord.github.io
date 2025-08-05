document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const shapkaLinks = document.querySelector('.shapka-links');

    menuToggle.addEventListener('click', () => {
        shapkaLinks.classList.toggle('active-menu');
        menuToggle.classList.toggle('menu-toggle-active')
    });
});