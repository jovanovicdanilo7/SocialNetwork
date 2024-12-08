class Post {
    constructor() {
        this.postId = '';
        this.postContent = '';
        this.userId = '';
        this.likes = 0;
        this.listOfLikes = new Map();
        this.apiUrl = 'https://danetwork.vercel.app/api';
    }

    async initializeApiUrl() {
        try {
            const response = await fetch('/api/config');
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

    async createPost() {
        try {
            const session = new Session();
            const sessionId = session.getSession();

            const data = {
                userId: sessionId,
                postContent: this.postContent,
                likes: this.likes,
                listOfLikes: this.listOfLikes,
            };

            const response = await fetch(`${this.apiUrl}/post/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return response.ok ? await response.json() : (await response.json()).error;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async getAllPosts() {
        try {
            const response = await fetch(`${this.apiUrl}/post/all`);
            return response.ok ? await response.json() : (await response.json()).error;
        } catch (error) {
            console.error('Error fetching all posts:', error);
            throw error;
        }
    }

    async likePostSave(postId, likes, listOfLikes) {
        try {
            const data = { likes, listOfLikes };

            const response = await fetch(`${this.apiUrl}/post/like/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return response.ok ? await response.json() : (await response.json()).error;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    }

    async deletePost(postId) {
        try {
            const response = await fetch(`${this.apiUrl}/post/delete/${postId}`, {
                method: 'DELETE',
            });

            return response.ok ? await response.json() : (await response.json()).error;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    async getPost(postId) {
        try {
            const response = await fetch(`${this.apiUrl}/post/${postId}`);
            return response.ok ? await response.json() : (await response.json()).error;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }
}
