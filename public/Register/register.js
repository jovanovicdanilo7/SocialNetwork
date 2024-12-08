const registrationForm = document.querySelector('#registrationForm');
const regFormButton = document.querySelector('#btn');

const user = new User();

function checkInputs() {
    return Array.from(registrationForm.querySelectorAll('input')).every(input => input.value);
}

registrationForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        regFormButton.disabled = !checkInputs();
    });
});

registrationForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (validator.validationPassed()) {
        user.username = document.querySelector('#username').value;
        user.email = document.querySelector('#email').value;
        user.password = document.querySelector('#password').value;
        await user.createUser();
    } else {
        alert('Invalid fields. Please try again.');
    }
});

const config = {
    'username': { required: true, minlength: 3, maxlength: 20 },
    'email': { required: true, email: true, minlength: 12, maxlength: 50 },
    'password': { required: true, minlength: 7, maxlength: 25, matching: 'confirmPassword' },
    'confirmPassword': { required: true, minlength: 7, maxlength: 25, matching: 'password' }
};
const validator = new Validator(config, '#registrationForm');