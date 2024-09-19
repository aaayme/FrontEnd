let PostsLoaded = 0
function deletePost(postId){
    axios.delete(`https://aionversealpha.onrender.com/Post`,{
        data: {
            PostId: postId
        },
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('AIONToken')}`
        }

    }).then(( ) => {
        alert('Post deleted successfully')
        location.reload()
    }).catch(function (err){
        if (err.status === 401){
            refreshToken().then(() => {
                deletePost(postId)
            }).catch(()=>{
                alert("Token expired. Please login again.")
                window.location.href = '../login.html'
            })
        }

    })
}

function updatePost(postId){
    location.href = `./Post/update.html?postId=${postId}`
}

addEventListener('load',  function() {

    setTimeout(async () => {

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id')
        const owner = id == UserData.id
        function LoadPosts(data) {



            const posts = data.posts
            const main = document.getElementsByTagName('main')[0]

            // create Post object
            if (owner) {
                main.innerHTML = `<button id="PostNew" onClick="CreateComment()"> Create New Post </button>`

            }

            // loading the posts
            for (let i = Math.min(posts.length,PostsLoaded + 10) - 1; i >= 0 ; i--) {
                const post = posts[i];
                const postId = post['_id']
                let Display = 'none'
                const picture = post.Picture
                if (picture) {
                    Display = 'block'
                }

                const postElement = document.createElement('div');
                if (owner && !(post.public)){
                    postElement.innerHTML = `
                            <div class="post">
                            <div class="UserHolder">
                                 <div class = 'user' onclick="redirectProfile('${post.OwnerId}')">
                                     <img src="${data.image}" alt="profileImage">
                                     <h3> ${data.username} </h3>
                                </div>
                                <img class='DeletePost' src="./Settings.png" onclick="updatePost('${postId}')" alt="Settings">
                            </div>
                            <h2>${post.Title}</h2>
                            <p>${post.Body}
                            </p>
                            <img src="${picture}" class='PostImage' style="display: ${Display}">
                             <div class="private">
                             <p>private</p>
                            </div>
                            </div> 
                        `
                }
                else if (owner) {
                    postElement.innerHTML = `
                            <div class="post">
                            <div class="UserHolder">
                                 <div class = 'user' onclick="redirectProfile('${post.OwnerId}')">
                                     <img src="${data.image}" alt="profileImage">
                                     <h3> ${data.username} </h3>
                                </div>
                                <img class='DeletePost' src="./garbage.png" onclick="deletePost('${postId}')" alt="Settings">
                            </div>
                                 
                            <h2>${post.Title}</h2>
                            <p>${post.Body}
                            </p>
                            <img src="${picture}" class='PostImage' style="display: ${Display}">
                                <div class="buttonList">
                                    <button class='share' onclick="share('${postId}')" type="button" >Share</button>
                                    <button class='comments' onclick="loadComments('${postId}')" type="button">Load Comments</button>
                                </div>
                                <div class="commentInput">
                                <input placeholder="write your comment here">
                                 <button type="submit" onclick="comment(this,'${postId}')">Submit</button>
                                </div>
                                <div class="comments">
                                     <div id=${postId}>
                                    </div>
                                 </div>
                            </div> 
                        `
                }
                else {
                    postElement.innerHTML = `
                            <div class="post">
                                 <div class = 'user' onclick="redirectProfile('${post.OwnerId}')">
                                     <img src="${data.image}" alt="profileImage">
                                     <h3> ${data.username} </h3>
                                </div>
                            <h2>${post.Title}</h2>
                            <p>${post.Body}
                            </p>
                            <img src="${picture}" class='PostImage' style="display: ${Display}">
                                <div class="buttonList">
                                    <button class='share' onclick="share('${postId}')" type="button" >Share</button>
                                    <button class='comments' onclick="loadComments('${postId}')" type="button">Load Comments</button>
                                </div>
                                <div class="commentInput">
                                <input placeholder="write your comment here">
                                 <button type="submit" onclick="comment(this,'${postId}')">Submit</button>
                                </div>
                                <div class="comments">
                                     <div id=${postId}>
                                    </div>
                                 </div>
                            </div> 
                        `
                }

                main.appendChild(postElement);

                PostsLoaded++;
            }

        }



        function loadData(data) {
            LoadPosts(data)
        }

        let header = {}
        if (owner) {
            header = {
                headers : {
                    Authorization: 'Bearer '+ localStorage.getItem('AIONToken')
                }
            }
        }

        axios.get(`https://aionversealpha.onrender.com/post/user/${id}`,header).then((res ) => {
            loadData(res.data)
        }).catch(function (err){
            console.error(err)
            location.href = './404.html'
        })





        // Submit form
    },2000)

})