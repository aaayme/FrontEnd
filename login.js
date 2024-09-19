onload = main

function main(){
    const username = document.getElementById('username')
    const password = document.getElementById('password')
    const wrongUser = document.getElementById('userError')
    const wrongPassword = document.getElementById('passError')

    let login = document.getElementById('login')


    login.onclick = () => {
        const body = {
            username: username.value,
            password: password.value
        }
        axios.post('https://aionversealpha.onrender.com/Login',body).then(response => {
            let data = response.data
            let error = data.error
            if (error) {
                wrongUser.innerHTML = error
                return
            }

            localStorage.setItem('AIONToken',data.token)
            localStorage.setItem('AIONRToken',data.RToken)
            location.href = "home.html"
        }).catch((err) => {

            wrongUser.innerHTML = 'Invalid username or password'
        })
    }
}