class User {
    constructor() {
        this.username = '';
        this.email = '';
        this.password = '';
        this.apiUrl = 'https://danetwork.vercel.app/api';
    }

    async initializeApiUrl() {
        try {
            const response = await fetch("/api/config");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const config = await response.json();
            // this.apiUrl = config.apiUrl;
        } catch (error) {
            console.error('Error fetching API URL:', error);
            throw error;
        }
    }

    async createUser() {
        const data = {
            username: this.username,
            email: this.email,
            password: this.password,
        };

        try {
            const response = await fetch(`${this.apiUrl}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const userData = await response.json();
                const session = new Session();
                session.userId = userData._id;
                session.startSession();
                window.location.href = "../Main/hexa.html";
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/user/${userId}`);
            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async editUser() {
        const data = {
            username: this.username,
            email: this.email,
        };

        try {
            const session = new Session();
            const sessionId = session.getSession();

            const response = await fetch(`${this.apiUrl}/user/edit/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                window.location.href = "../Main/hexa.html";
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error('Error editing user:', error);
            throw error;
        }
    }

    async loginUser() {
        try {
            const response = await fetch(`${this.apiUrl}/user/login/${this.email}`);
            if (response.ok) {
                const data = await response.json();

                if (data.user.password === this.password) {
                    const session = new Session();
                    session.userId = data.user._id;
                    session.startSession();
                    window.location.href = "/Main/hexa.html";
                } else {
                    alert('Wrong password, please try again.');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('User login error:', error);
            throw error;
        }
    }

    async deleteUser() {
        try {
            const session = new Session();
            const sessionId = session.getSession();

            await fetch(`${this.apiUrl}/post/delete-by-user/${sessionId}`, {
                method: "DELETE",
            });

            await fetch(`${this.apiUrl}/comment/delete-by-user/${sessionId}`, {
                method: "DELETE",
            });

            const response = await fetch(`${this.apiUrl}/user/delete/${sessionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                session.destroySession();
                window.location.href = '../index.html';
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}
