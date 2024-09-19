let UserData = {}
let loadedComments = {}
addEventListener('load',getUserData)



function logout (){

    axios.post('http://aionversealpha.onrender.com/Logout',{
        RToken: localStorage.getItem('AIONRToken')
    }).then(function(response){
        console.log(response)
        localStorage.removeItem('AIONToken')
        localStorage.removeItem('AIONRToken')
        window.location.href = './login.html'
    })

}

function getUser(id){
    return axios.get(`https://aionversealpha.onrender.com/users/${id}`)
}
function getUserData(){

    axios.get('https://aionversealpha.onrender.com/myuser',{
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem('AIONToken')
        }
    }).then(
        (res) => {
            UserData = res.data
            const header = document.getElementsByTagName('header')[0]
            header.innerHTML = `<div class = 'user headUser' onclick="redirectProfile('${UserData.id}')" >
                     <img src="${UserData.image}" alt="profileImage">
                      <h3> ${UserData.username} </h3>
                     </div>
                     <div class="headerButtons">
                      <a href="./home.html"> Home </a>
                    <a onclick="logout()"> Logout </a>
                       </div>
                    
`

            header.classList.add('loggedUser')

        }).catch((error)=> {
            console.warn('An error occurred')
        if (error.status === 401){
            refreshToken().then(() => {
                getUserData()
            }).catch(()=>{})
        }
        else {
        }

    })
}

function refreshToken(){
    return new Promise((resolve ,reject) => {
        axios.patch('https://aionversealpha.onrender.com/Token', {RToken:localStorage.getItem('AIONRToken')})
            .then(response => {
                localStorage.setItem('AIONToken', response.data.token)
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}

function comment(button,PostId){
    let Comment = button.previousElementSibling
    axios.post(`https://aionversealpha.onrender.com/post/${PostId}`,{
        comment: Comment.value,
    },{
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem('AIONToken')
        }
    }).then( () => {

        let commentList = document.getElementById(PostId)
        loadedComments[PostId] = false
        commentList.innerHTML = ""
        Comment.value = ""
        loadComments(PostId)

    }).catch((error)=> {
        if (error.status === 401){
            refreshToken().then(() => {
                comment(button,PostId)
            }).catch(() => {
                alert('Please sign up or log in to be able to comment')
            })

        }
        else {
            alert("Invalid Comment")
        }

    })
}

function deleteComment(PostId,index){
    axios.delete(`https://aionversealpha.onrender.com/Post/${PostId}/${index}`,{
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem('AIONToken')
        }
    }).then(
        (response) => {
            console.log("comment deleted")
            let commentList = document.getElementById(PostId)
            loadedComments[PostId] = false
            commentList.innerHTML = ""
            loadComments(PostId)
        })
        .catch(error=>{
            if (error.status === 401){
                refreshToken().then(
                    () => {
                        deleteComment(PostId,index)
                    }

                ).catch( () => {
                    alert('Please sign up or log in to be able to delete comments')
                })

            }
            else {
                alert('Error while deleting this comment')
            }
        })

}
function loadComments(PostId){

    if (loadedComments[PostId]) {return}
    axios.get(`https://aionversealpha.onrender.com/Post/${PostId}`)
        .then(response => {
            const data = response.data
            const comments = data.comments

            for (let i = comments.length - 1 ; i >= 0; i--) {
                const comment = comments[i];
                getUser(comment.id).then(user => {

                    const User = user.data
                    const commentElement = document.createElement('div');

                    if (comment.id === UserData.id){
                        commentElement.innerHTML = `
                        <div class="comment">
                        <div class ='commentOptions'>
                            <div class = 'user' onclick="redirectProfile('${User.id}')">
                                <img src="${User.image}" alt="profileImage">
                                <h3>${User.username}</h3>
                            </div >
                            <img src="garbage.png" onclick="deleteComment('${PostId}','${i}')" class="deleteImage" alt="X">
                        </div>
                            <p>${comment.comment}
                            </p>
                        </div>`
                    }
                    else {
                        commentElement.innerHTML = `
                        <div class="comment">
                            <div class = 'user' >
                                <img src="${User.image}" alt="profileImage">
                                <h3>${User.username}</h3>
                            </div>
                            <p>${comment.comment}
                            </p>
                        </div>`
                    }


                    document.getElementById(PostId).appendChild(commentElement);
                })
            }
            loadedComments[PostId] = true
        })
}



function CreateComment(){
    if (UserData.username){
        location.href = 'Post/Create.html'
    }
    else {
        location.href = 'login.html'
    }
}

function share(PostId) {
    navigator.clipboard.writeText(`ht`).then(() => {
        alert('Link has been copied to clipboard');
    })
}

function redirectProfile(userId){
    location.href = `./User.html?id=${userId}`
}

