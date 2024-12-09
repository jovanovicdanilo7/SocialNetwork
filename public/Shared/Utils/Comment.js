class Comment {
    constructor() {
        this.postId = '';
        this.userId = '';
        this.commentContent = '';
    }

    async createComment() {
        try {
            const data = {
                postId: this.postId,
                userId: this.userId,
                commentContent: this.commentContent,
            };

            const response = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return response.ok;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    }

    async getPostComments(postId) {
        try {
            const response = await fetch(`/api/comment/${postId}`);

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error);
                return [];
            }

            const data = await response.json();
            return data.filter(item => item.postId === postId);
        } catch (error) {
            console.error('Error getting comments for post:', error);
            throw error;
        }
    }
}
