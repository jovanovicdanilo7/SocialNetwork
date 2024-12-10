const session = new Session();
const sessionId = session.getSession();
const backToMainPage = document.querySelector("#back-btn");

const fetchUserById = async (userId) => {
    const user = new User();
    return await user.getUser(userId);
};

(async () => {
    const user = await fetchUserById(sessionId);

    document.querySelector('#edit_username').value = user.username;
    document.querySelector('#edit_email').value = user.email;
})();

document.querySelector('#editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = new User();

    user.username = document.querySelector('#edit_username').value;
    user.email = document.querySelector('#edit_email').value;

    await user.editUser();
});

document.querySelector("#deleteProfile").addEventListener('click', async (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete profile?')) {
        const user = new User();
        await user.deleteUser();
    }
});

backToMainPage.addEventListener("click", e => {
    e.preventDefault();

    window.location.href = "../Main/hexa.html";
})