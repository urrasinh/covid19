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

const mostrarGrafico = (data) => {
    new Chart(document.getElementById("grafico"), {
        type: 'line',
        data: {
            labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
            datasets: [{
                data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                label: "Confimados",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                label: "Muertos",
                borderColor: "#8e5ea2",
                fill: false
            }, {
                data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                label: "Europe",
                borderColor: "#3cba9f",
                fill: false
            }, {
                data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                label: "Latin America",
                borderColor: "#e8c3b9",
                fill: false
            }, {
                data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                label: "North America",
                borderColor: "#c45850",
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'World population per region (in millions)'
            }
        }
    });
}
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
    const resultadosConfirmed = await consumirDatosApiConfirmed()
    const resultadosRecovered = await consumirDatosApiRecovered()
    const resultadosDeaths = await consumirDatosApiDeaths()
    console.log(resultadosConfirmed)
    console.log(resultadosRecovered)
    console.log(resultadosDeaths)
    mostrarGrafico(data)
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

// const manejadorClick = () => {
