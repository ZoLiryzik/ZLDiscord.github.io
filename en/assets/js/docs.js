// Код для config.yml файла в документации

const configCodeElement = document.getElementById('config-code');
fetch('/project/resources/config.yml')
    .then(response => {
        if (!response.ok) {
            throw new Error('Не удалось загрузить файл config.yml. Проверьте путь и доступ.');
        }
        return response.text();
    })
    .then(text => {
        configCodeElement.textContent = text;
        hljs.highlightAll();
    })
    .catch(error => {
        console.error('Ошибка:', error);
        configCodeElement.textContent = 'Ошибка загрузки: ' + error.message;
    });
