
onload = function() {



    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId'); // Get the 'postId' query parameter

    function loadData(data) {

        // Get form elements
        const username = document.getElementById('username');
        const postTitle = document.getElementById('PostTitle')
        const postBody = document.getElementById('PostBody')
        const LoadComments = document.getElementById('loadComments')
        const postImage = document.getElementById('PostImage')
        const submitButton = document.getElementById('Submit')

        getUserData()
        // Fetch user data
        getUser(data.OwnerId).then(function(user){
            username.innerHTML = user.data.username
            username.previousElementSibling.src = user.data.image
        })
            .catch( () => {alert('Could not fetch user data')})


        // Load post data
        postTitle.innerHTML = data.title
        postBody.innerHTML = data.body
        let picture = data.picture
        if (picture) {
            postImage.style.display = 'block'
            postImage.src = picture
        }
        const Submit = document
        const div = document.getElementsByClassName('comments')[1]
        div.innerHTML = `<div id="${postId}"></div>`
        div.setAttribute('id', postId)

        //event handlers
        LoadComments.onclick = () => {
            loadComments(postId)
        }

        document.getElementsByClassName('share')[0].addEventListener('click',
            () => {share(postId)}
        )

        submitButton.addEventListener('click',() => {
            console.log(submitButton)
            comment(submitButton, postId)
        })

    }

    axios.get(`https://aionversealpha.onrender.com/Post/${postId}`).then((res ) => {
        loadData(res.data)
    }).catch(function (){
        location.href = './404.html'
    })





    // Submit form
}