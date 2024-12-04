class Session {
    constructor() {
        this.userId = '';
    }

    startSession() {
        const expires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `userId=${this.userId};expires=${expires};path=/`;
    }

    getSession() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const userIdCookie = cookies.find(cookie => cookie.startsWith('userId='));
        return userIdCookie ? userIdCookie.split('=')[1] : null;
    }

    destroySession() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        cookies.forEach(cookie => {
            const name = cookie.split('=')[0];
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    }
}
