onload = () => {
    const uploadImage = document.getElementById('inputImage');
    const imageContainer = document.getElementById('userImage');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const signUp = document.getElementsByTagName('button')[0]

    imageContainer.onclick = () => {
        uploadImage.click();
    }

    uploadImage.onchange = () => {
        const file = uploadImage.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (e) => {
            imageContainer.src = reader.result
        }

        reader.onerror = () => {
            alert('Invalid Image')
        }

    }

    signUp.onclick = () => {
        const body = {
            username: username.value,
            password: password.value,
            picture: imageContainer.src
        }
        console.log(body)

        axios.post('https://aionversealpha.onrender.com/Register',body).then(response => {
            console.log(response)
            localStorage.setItem('AIONToken', response.data.token)
            localStorage.setItem('AIONRToken', response.data.RToken)
            location.href = 'home.html'
        }).catch((err) => {
            console.log(err)
            alert(err.response.data)
        })
    }
}