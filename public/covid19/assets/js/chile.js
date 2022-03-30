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


// llamado a la Api Confirmed
const consumirDatosApiConfirmed = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        //console.log(jwtToken)
        const response = await fetch('http://localhost:3000/api/confirmed',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()
        //console.log(data)
        return data
    } catch (err) {
        console.error(`Error: ${err} `)

    }
}

// llamado a la Api Recovered
const consumirDatosApiRecovered = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        //console.log(jwtToken)
        const response = await fetch('http://localhost:3000/api/recovered',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()
        //console.log(data)
        return data
    } catch (err) {
        console.error(`Error: ${err} `)

    }
}

// llamado a la Api Deaths
const consumirDatosApiDeaths = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        const response = await fetch('http://localhost:3000/api/deaths',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()
        //console.log(data)
        return data
    } catch (err) {
        console.error(`Error: ${err} `)

    }
}

formularioSelector.addEventListener("submit", async (event) => {
    event.preventDefault()
    const dataUser = await postData(emailSelector.value, passwordSelector.value)
    //console.log(dataUser)
    iniciarSesionModal.hide()
    // agregar elementos al menu
    menuItemSituacionChileSelector.style.display = "list-item"
    menuItemLogoutSelector.style.display = "list-item"
    // ocultando item menu (iniciar sesion)
    menuItemLoginSelector.style.display = "none"
    // llamado asincrono de Apis
    await consumirDatosApiConfirmed()
    await consumirDatosApiRecovered()
    await consumirDatosApiDeaths()
})

botonLoginSelector.addEventListener("click", () => {
    iniciarSesionModal.show()
})

botonLogoutSelector.addEventListener("click", () => {
    localStorage.setItem('jwt-token', '')
    menuItemSituacionChileSelector.style.display = "none"
    menuItemLogoutSelector.style.display = "none"
    menuItemLoginSelector.style.display = "list-item"
})

//const manejadorClick = () => {



