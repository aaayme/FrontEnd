onload = function() {

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId')


    getUserData()

    function loadData(post){
        if (post.OwnerId === UserData.id) {
            // Get DOM elements
            const ImgInput = document.getElementById('imageInput');
            const titInput = document.getElementById('titleInput');
            const bodyInput = document.getElementById('bodyInput');
            const isPublic = document.getElementById('Public')

            let pic = post.picture
            if (pic){
                ImgInput.src = post.picture
            }
            else {
                ImgInput.parentElement.style.display = 'none'
            }

            titInput.value = post.title
            bodyInput.value = post.body
            document.getElementById('createPost').onclick = () => {
                axios.patch('https://aionversealpha.onrender.com/Post/',{
                        title: titInput.value,
                        body: bodyInput.value,
                        PostId: postId,
                        public: isPublic.checked
                },{
                    headers: {
                        Authorization: 'Bearer '+ localStorage.getItem('AIONToken')
                    }
                }
                ).then(() => {
                    alert('Post updated successfully')
                    location.href = '../home.html'
                })
                    .catch((err) => {
                        console.log(err)
                        alert('Failed to update post')
                    })
            }
        }

        else {
            alert('You cannot edit this post.')
            location.href = '../home.html'
        }
    }
    axios.get(`https://aionversealpha.onrender.com/Post/${postId}`,{
        headers: {
            'Authorization': 'Bearer '+ localStorage.getItem('AIONToken')
        }
    }).then(( res ) => {
        loadData(res.data)
    }).catch(function (){
        console.log('err')
        //location.href = './404.html'
    })

    //document.getElementById('createPost').onclick




}

