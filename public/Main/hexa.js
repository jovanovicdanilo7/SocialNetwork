const session = new Session();
const sessionId = session.getSession();

if (!sessionId) window.location.href = '../index.html';

const fetchUserById = async (userId) => {
    const user = new User();
    return await user.getUser(userId);
};

const renderPost = async (post, currentUser, commentsHtml) => {
    const deletePostButton = sessionId === post.userId
        ? '<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>'
        : '';

    const isLiked = post.listOfLikes && post.listOfLikes[sessionId];
    const likeButtonBackground = isLiked 
        ? "url('../Shared/Css/img/dislike.png')" 
        : "url('../Shared/Css/img/like.png')";

    return `
        <div class="single-post" data-post_id="${post._id}">
            <div class="post-content">${post.postContent}</div>
            <div class="post-actions">
                <p><b>Author of post:</b> ${currentUser.username}</p>
                <div>
                    <button 
                        onclick="likePost(this)" 
                        class="likePostJS like-btn" 
                        style="background-image: ${likeButtonBackground}">
                        <span>${post.likes}</span>
                    </button>
                    <button class="comment-btn" onclick="commentPost(this)"></button>
                    ${deletePostButton}
                </div>
            </div>
            <div class="post-comments">
                <form>
                    <input placeholder="Write a comment..." type="text">
                    <button onclick="commentPostSubmit(event)">Comment</button>
                </form>
                ${commentsHtml}
            </div>
        </div>`;
};

(async () => {
    const user = await fetchUserById(sessionId);

    document.querySelector('#username').innerText = user.username;
    document.querySelector('#email').innerText = user.email;
})();

document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault();
    session.destroySession();
    window.location.href = '../index.html';
});

const editAccount = document.querySelector('#editAccount');
editAccount.addEventListener('click', () => {
    window.location.href = "../Edit/edit.html";
});

document.querySelector('#postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const postContent = document.querySelector("#postContent");

    const post = new Post();
    
    post.postContent = postContent.value;
    document.querySelector("#postContent").value = '';

    const createdPost = await post.createPost();
    const currentUser = await fetchUserById(sessionId);
    const renderedPost = await renderPost(createdPost, currentUser, '');
    document.querySelector('#allPostsWrapper').innerHTML = renderedPost + document.querySelector('#allPostsWrapper').innerHTML;
});

const loadAllPosts = async () => {
    const postManager = new Post();
    const allPosts = await postManager.getAllPosts();

    const postsHtml = await Promise.all(allPosts.map(async (post) => {
        const currentUser = await fetchUserById(post.userId);

        const commentManager = new Comment();
        const comments = await commentManager.getPostComments(post._id);

        const commentsHtml = await Promise.all(comments.map(async (comment) => {
            const commentUser = await fetchUserById(comment.userId);
            return `
                <div class="single-comment">
                    <p><b>Author of comment:</b> ${commentUser.username}</p>
                    <hr>
                    <p>${comment.commentContent}</p>
                </div>`;
        }));

        return await renderPost(post, currentUser, commentsHtml.join(''));
    }));

    document.querySelector('#allPostsWrapper').innerHTML = postsHtml.join('');
};

loadAllPosts();

const likePost = async (button) => {
    const postId = button.closest(".single-post").getAttribute("data-post_id");
    const post = new Post();

    const postData = await post.getPost(postId);

    if (postData.listOfLikes[sessionId]) {
        button.querySelector('span').innerText = parseInt(button.querySelector('span').innerText) - 1;
        button.style.backgroundImage = "url('../Shared/Css/img/like.png')";

        postData.listOfLikes[sessionId] = false;
        await post.likePostSave(postId, postData.likes - 1, postData.listOfLikes);
    } else {
        button.querySelector('span').innerText = parseInt(button.querySelector('span').innerText) + 1;
        button.style.backgroundImage = "url('../Shared/Css/img/dislike.png')";

        postData.listOfLikes[sessionId] = true;
        await post.likePostSave(postId, postData.likes + 1, postData.listOfLikes);
    }
};

const commentPost = (button) => {
    const mainPostElement = button.closest('.single-post');
    const commentSection = mainPostElement.querySelector('.post-comments');

    commentSection.style.display = commentSection.style.display === 'block' ? 'none' : 'block';
};

const commentPostSubmit = async (e) => {
    e.preventDefault();

    const commentValue = e.target.closest('.post-comments').querySelector('input');
    const commentManager = new Comment();

    commentManager.commentContent = commentValue.value;
    commentManager.userId = sessionId;
    commentManager.postId = e.target.closest('.single-post').getAttribute('data-post_id');
    await commentManager.createComment();

    const currentUser = await fetchUserById(sessionId);
    const commentHtml = `
        <div class="single-comment">
            <p><b>Author of comment:</b> ${currentUser.username}</p>
            <hr>
            <p>${commentManager.commentContent}</p>
        </div>`;
    e.target.closest('.post-comments').innerHTML += commentHtml;
};

const removeMyPost = async (button) => {
    const postId = button.closest('.single-post').getAttribute('data-post_id');
    const postManager = new Post();

    await postManager.deletePost(postId);
    button.closest('.single-post').remove();
};
