const mainTitle = document.querySelector(".title h1");
const registerButton = document.querySelector('#registrationBtn');
const loginForm = document.querySelector('#loginForm');

const user = new User();

function animateTitleSpans() {
    const mainTitleSplitted = mainTitle.textContent.split('');
    mainTitle.innerHTML = '';

    mainTitleSplitted.forEach(char => {
        const span = document.createElement('span');
        span.innerHTML = char === " " ? "&nbsp;" : char;
        mainTitle.appendChild(span);
    });

    const mainTitleSpans = mainTitle.querySelectorAll('span');
    let k = 0;

    const interval = setInterval(() => {
        mainTitleSpans[k].className = 'fadeMove';
        k++;
        if (k === mainTitleSpans.length) clearInterval(interval);
    }, 70);
}

registerButton.addEventListener('click', () => window.location.href = "/Register/register.html");

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    user.email = document.querySelector('#login_email').value;
    user.password = document.querySelector('#login_password').value;
    await user.loginUser();
});

const session = new Session().getSession();
if (session && session !== "") window.location.href = "/Main/hexa.html";

(async () => {
    // await user.initializeApiUrl();
    animateTitleSpans();
})();
