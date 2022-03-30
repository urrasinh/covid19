const formularioSelector = document.querySelector('#formulario')
const emailSelector = document.querySelector('#email')
const passwordSelector = document.querySelector('#password')
const cuerpoModalSelector = document.querySelector('#cuerpo-modal')
const cerrarModalSelector = document.querySelectorAll('.cerrar-modal')
const menuItemSituacionChileSelector = document.querySelector('#menu-item-situacion-chile')
const menuItemLoginSelector = document.querySelector('#menu-item-login')
const menuItemLogoutSelector = document.querySelector('#menu-item-logout')
const botonLoginSelector = document.querySelector('#boton-login')
const botonLogoutSelector = document.querySelector('#boton-logout')

const iniciarSesionModal = new bootstrap.Modal(document.querySelector('#modal-principal'), {})

// ocultar elementos del menu (situción chile, cerrar sesion)
menuItemSituacionChileSelector.style.display = "none"
menuItemLogoutSelector.style.display = "none"

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
    // agregar elementos al menu
    menuItemSituacionChileSelector.style.display = "list-item"
    menuItemLogoutSelector.style.display = "list-item"
    // ocultando item menu (iniciar sesion)
    menuItemLoginSelector.style.display = "none"

})

botonLoginSelector.addEventListener("click", () => {
    iniciarSesionModal.show()
})
/*
botonLogoutSelector.addEventListener("click", () => {
    localStorage.setItem('jwt-token', '')
    menuItemSituacionChileSelector.style.display = "none"
    menuItemLogoutSelector.style.display = "none"
    menuItemLoginSelector.style.display = "list-item"
})
*/
//const manejadorClick = () => {
/*
    const datoModalPais = async () => {
        const jwtToken = localStorage.getItem('jwt-token')
        try {
            const response = await fetch(`http://localhost:3000/api/countries/US`,
                {
                    method:
                        'GET',
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
    
                })
            const { data } = await response.json()
            console.log(data)
            return data
            //$('#exampleModal').modal('toggle')
            //const modalChartSelector = document.querySelector('#modal-country')
            //crearChartModal(data.location, data.confirmed, data.deaths, data.recovered, data.active, modalChartSelector)
        }
        catch (error) {
            console.log(error)
        }
    }
    */