console.log(document.querySelector('.error-state'));
// Клиентский JavaScript
if (document.querySelector('.error-state').textContent.trim() == "") {
document.querySelector('.error-state').style.border = 'none';
}