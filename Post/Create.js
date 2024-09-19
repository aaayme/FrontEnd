onload = function() {
    // Get DOM elements
    const ImgInput = document.getElementById('imageInput');
    const titInput = document.getElementById('titleInput');
    const bodyInput = document.getElementById('bodyInput');
    const isPublic = document.getElementById('Public')
    document.getElementById('createPost').onclick = createComment

    // Add event listener for image input
    ImgInput.addEventListener('change', function(e) {
        // Get the selected image file
        const file = e.target.files[0];

        // Check if the file is an image
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }

        // Create a new FileReader object
        const reader = new FileReader();

        // Add event listener for file reading complete
        reader.onload = function(e) {
            // Get the loaded image data URL
            ImgInput.previousElementSibling.src = e.target.result;
        };

        // Read the selected image file
        reader.readAsDataURL(file);
    });



    function createComment(){
        axios.post('https://aionversealpha.onrender.com/Post/',{
                title: titInput.value,
                body: bodyInput.value,
                picture: ImgInput.previousElementSibling.src,
                public: isPublic.checked
           },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('AIONToken')
                }
            }
        ).then(function(response){
            alert('Post created successfully')
            location.href = '../home.html'
        }).catch(function(err){
            if (err.status === 401){
                refreshToken().then(() => {
                    createComment()
                    window.location.href = '../home.html'
                }).catch(()=>{
                    alert("Token expired. Please login again.")
                    window.location.href = '../login.html'
                })
            }
            else {
                alert(err.response.data)
            }
        })
    }
}


