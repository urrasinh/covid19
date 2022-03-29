const formularioSelector = document.querySelector('#formulario')
const emailSelector = document.querySelector('#email')
const passwordSelector = document.querySelector('#password')
const cuerpoModalSelector = document.querySelector('#cuerpo-modal')
const cerrarModalSelector = document.querySelectorAll('.cerrar-modal')
const iniciarSesionModal = new bootstrap.Modal(document.querySelector('#modal-principal'), {})
const botonLoginSelector = document.querySelector('#boton-login')


const postData = async (email, password) => {
    try {
        const response = await fetch("http://localhost:3000/api/login", // Consulta para crear token
            {
                method: 'POST', // Crear el token 
                body: JSON.stringify({ email, password }),
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token) // Persistiendo el token
        return token
    } catch (err) {
        //console.error(`Error: ${err}`)
        document.querySelector('#modal-footer').innerHTML = err.message;
    }
}

formularioSelector.addEventListener("submit", async (event) => {
    event.preventDefault()
    const dataUser = await postData(emailSelector.value, passwordSelector.value)
    console.log(dataUser)
    iniciarSesionModal.hide()
})

botonLoginSelector.addEventListener("click", () => {
    iniciarSesionModal.show()
})

//const manejadorClick = () => {


