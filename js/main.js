document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("current-year").textContent = new Date().getFullYear();

    function applyVersion(ver) {
        document.querySelectorAll('a[href*="ZoLiryzik.jar"]').forEach(function(a) {
            var url = a.getAttribute('href');
            if (url && url.indexOf('/project/ZoLiryzik.jar') !== -1) {
                a.setAttribute('href', '/project/' + ver + '/ZoLiryzik.jar');
            }
        });
        document.querySelectorAll('.plugin-version').forEach(function(el) {
            el.textContent = ver;
        });
        document.title = document.title.replace(/v\d+\.\d+/, 'v' + ver);
    }

    fetch('/project/version.txt?' + Date.now())
        .then(function(r) { return r.text().then(function(t) { return t.trim(); }); })
        .then(function(ver) { if (ver) applyVersion(ver); })
        .catch(function() {});

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var nav = document.getElementById('navLinks');
            if (nav) nav.classList.remove('show');
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    var screenshotBlocks = document.querySelectorAll('.js-hover');
    screenshotBlocks.forEach(function(block) {
        block.addEventListener('click', function() {
            block.classList.toggle('is-active');
            screenshotBlocks.forEach(function(other) {
                if (other !== block) other.classList.remove('is-active');
            });
        });
    });

    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    var languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        var languageLabel = languageSelect.querySelector('.language-label');
        var languageDropdown = languageSelect.querySelector('.language-dropdown');
        if (languageLabel && languageDropdown) {
            languageLabel.addEventListener('click', function(e) {
                e.stopPropagation();
                languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
            });
            document.addEventListener('click', function(e) {
                if (!languageSelect.contains(e.target)) {
                    languageDropdown.style.display = 'none';
                }
            });
        }
    }
});
