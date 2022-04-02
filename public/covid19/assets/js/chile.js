// Selectores del DOM
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
const cerrarGraficoSelector = document.querySelector('#grafico')

// crea un nuevo modal con ID
const iniciarSesionModal = new bootstrap.Modal(document.querySelector('#modal-principal'), {})

// oculta item de menu
menuItemSituacionChileSelector.style.display = 'none'
menuItemLogoutSelector.style.display = 'none'

// Gráfico de datos Chile
const mostrarGrafico = (resultadosConfirmed, resultadosRecovered, resultadosDeaths) => {
    new Chart(document.getElementById('grafico'), {
        type: 'line',
        data: {
            labels: resultadosConfirmed.map(p => p.date),
            datasets: [{
                data: resultadosConfirmed.map(p => p.total),
                label: 'Confimados',
                borderColor: '#3e95cd',
                fill: false
            }, {
                data: resultadosRecovered.map(p => p.total),
                label: 'Recuperados',
                borderColor: '#8e5ea2',
                fill: false
            }, {
                data: resultadosDeaths.map(p => p.total),
                label: 'Muertos',
                borderColor: '#3cba9f',
                fill: false
            },
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Situación Covid-19 Chile (in milliones)'
            }
        }
    })
}

// funcion asíncrona que consume de API Login que recibe parametros de acceso utilizando metodo POST
const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
        return token
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}


const consumirDatosApiConfirmed = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        const response = await fetch('http://localhost:3000/api/confirmed',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()

        return data
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}

const consumirDatosApiRecovered = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        const response = await fetch('http://localhost:3000/api/recovered',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()

        return data
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}

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
        return data
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}

// se escucha submit del formulario iniciar sesión
formularioSelector.addEventListener('submit', async (event) => {
    event.preventDefault()
    const dataUser = await postData(emailSelector.value, passwordSelector.value)
    iniciarSesionModal.hide() //esconde modal
    menuItemSituacionChileSelector.style.display = 'list-item'  // muestra item de menu Situación Chile
    menuItemLogoutSelector.style.display = 'list-item' // muestra item de menu cerrar sesión
    menuItemLoginSelector.style.display = 'none' //esconde item de menu iniciar sesion

    const llamadosApi = [
        consumirDatosApiConfirmed(), consumirDatosApiRecovered(), consumirDatosApiDeaths() 
    ]
    const [resultadosConfirmed, resultadosRecovered, resultadosDeaths] = await Promise.all(llamadosApi)
    mostrarGrafico(resultadosConfirmed, resultadosRecovered, resultadosDeaths) // muestra datos si se cumple la promesa
})

// evento click para mostrar el modal 
botonLoginSelector.addEventListener('click', () => {
    iniciarSesionModal.show()
})


// evento click que cierra sesión
botonLogoutSelector.addEventListener('click', () => {
    localStorage.setItem('jwt-token', '') // se vacia localstorage
    menuItemSituacionChileSelector.style.display = 'none'
    menuItemLogoutSelector.style.display = 'none'
    menuItemLoginSelector.style.display = 'list-item'
    cerrarGraficoSelector.style.display = 'none'
})


