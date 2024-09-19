addEventListener("load", main )

let PostsLoaded = 0;



function LoadPosts(){
    const main = document.getElementsByTagName('main')[0]
    axios.get('https://aionversealpha.onrender.com/post')
       .then(response => {
            const data = response.data


            for (let i = 0; i < data.length && PostsLoaded + 10; i++) {
                const post = data[i];

                let Display = 'none'
                const picture = post.Picture
                if (picture) {
                    Display = 'block'
                }
                getUser(data[i].OwnerId).then(user => {

                    const User = user.data
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                    <div class="post">
                         <div class = 'user' onclick="redirectProfile('${post.OwnerId}')">
                             <img src="${User.image}" alt="profileImage">
                             <h3> ${User.username} </h3>
                        </div>
                    <h2>${post.Title}</h2>
                    <p>${post.Body}
                    </p>
                    <img src="${picture}" class='PostImage' style="display: ${Display}">
                        <div class="buttonList">
                            <button class='share' onclick="share('${post.PostId}')" type="button" >Share</button>
                            <button class='comments' onclick="loadComments('${post.PostId}')" type="button">Load Comments</button>
                        </div>
                        <div class="commentInput">
                        <input placeholder="write your comment here">
                         <button type="submit" onclick="comment(this,'${post.PostId}')">Submit</button>
                        </div>
                        <div class="comments">
                             <div id=${post.PostId}>
                            </div>
                         </div>
                    </div> 
                    
                `;
                    main.appendChild(postElement);
                })

                PostsLoaded++;
            }

        })
       .catch(error => {
            console.error(error);
        });
}
function main(){
    LoadPosts();
}