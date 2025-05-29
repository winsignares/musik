function registerUser() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/users/register', data)
    .then(response => {
        console.log(response.data)
        window.location.href='/sesion';
    })
    .catch(error => {
        console.log(error);
    });
}

function login() {

}
