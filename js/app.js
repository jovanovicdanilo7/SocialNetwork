console.log('App je ucitan!');

let session = new Session();
session = session.getSession();

if(session !== "")
{
    window.location.href = "hexa.html";
}

document.querySelector('#registracija').addEventListener('click', () => 
{
    document.querySelector('.custom-modal').style.display = 'block';
});

document.querySelector('#closeModal').addEventListener('click', () => 
{
    document.querySelector('.custom-modal').style.display = 'none';
});

let config = {
    'korisnicko_ime': {
        required: true,
        minlength: 3,
        maxlength: 20
    },

    'email': {
        required: true,
        email: true,
        minlength: 12,
        maxlength: 50
    },

    'lozinka': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'ponovi_lozinku'
    },

    'ponovi_lozinku': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'lozinka'
    }
};


let validator = new Validator(config, '#registrationForm');
let registrationForm = document.querySelector('#registrationForm');
let regFormButton = document.querySelector('#btn');

registrationForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        if (checkInputs()) {
            regFormButton.removeAttribute('disabled'); 

            registrationForm.addEventListener('submit', e => 
            {
                e.preventDefault();

                if(validator.validationPassed())
                {
                    let user = new User();
                    user.username = document.querySelector('#korisnicko_ime').value;
                    user.email = document.querySelector('#email').value;
                    user.password = document.querySelector('#lozinka').value;
                    user.createUser();
                } else 
                {
                    alert('Polja nisu dobro popunjena!');
                }
            });

        } else {
            regFormButton.setAttribute('disabled', true); 
        }
    });
});

document.querySelector('#loginForm').addEventListener('submit', e => 
{
    e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let password = document.querySelector('#login_lozinka').value;

    let user = new User();
    user.email = email;
    user.password = password;
    user.loginUser();
});

function checkInputs() {
    const inputs = registrationForm.querySelectorAll('input');
    for (let input of inputs) {
        if (!input.value) {
            return false; 
        }
    }
    return true; 
}