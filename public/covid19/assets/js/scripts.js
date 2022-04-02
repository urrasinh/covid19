const formularioSelector = document.querySelector('#formulario')
const emailSelector = document.querySelector('#email')
const passwordSelector = document.querySelector('#password')
const mostrarTablaSelector = document.querySelector('#cuerpo-tabla')
const modalChartSelector = document.querySelector('#modalDetalles')

let graficoDatosPais = null

const datosPaisModal = new bootstrap.Modal(document.querySelector('#modalParaDatos'), {})

// funcion asíncrona que consume de API Login que recibe parametros de acceso utilizando metodo POST
const iniciarSesionConApi = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email, password })
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

// funcion asíncrona que consume API datos paises que recibe valores con el metodo GET
const consumirDatosApiCovid = async () => {
    try {
        const jwtToken = localStorage.getItem('jwt-token')
        const response = await fetch('http://localhost:3000/api/total',
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
        return []
    }
}

const crearChart = (location, active, confirmed, recovered, deaths, modalChartSelector) => {
    graficoDatosPais = new Chart(document.getElementById('pie-chart'), {
        type: 'pie',
        data: {
            labels: ['Activos', 'Confirmados', 'Recuperados', 'Muertos'],
            datasets: [{
                label: 'Population (millions)',
                backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
                data: [active, confirmed, recovered, deaths]
            }]
        },
        options: {
            title: {
                display: true,
            }
        }
    })
}

// funcion asíncrona que consume API de datos de cada paises
const datoModalApiPais = async (pais) => {
    const jwtToken = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${pais}`,
            {
                method:
                    'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
        const { data } = await response.json()
        // se pasan parametros de la api a la función "crearChart" para usarlos en modal
        crearChart(data.location, data.active, data.confirmed, data.recovered, data.deaths, modalChartSelector)
        return data
    }
    catch (error) {
        console.log(error)
    }
}

// filtro de datos para gráfico
const pintarGraficos = (datosParaGrafico) => {
    const datosFiltradosContagio = datosParaGrafico.filter(datoPais => {
        return datoPais.confirmed >= 1000000 
    })

    const ctx = document.getElementById('grafico')
    const data = {
        labels: datosFiltradosContagio.map(p => p.location),
        datasets: [
            {
                label: 'Confirmados',
                data: datosFiltradosContagio.map(p => p.confirmed),
                borderColor: 'red',
                backgroundColor: '#f18a8a',
                yAxisID: 'y1'
            },
            {
                label: 'Muertos',
                data: datosFiltradosContagio.map(p => p.deaths),
                borderColor: 'blue',
                backgroundColor: '#aecfff',
                yAxisID: 'y2'
            }
        ]
    }

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'SITUACIÓN MUNDIAL COVID-19'
                },
            },
            scales: {
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            }
        },
    }
    // se instancia el grafico
   new Chart(ctx, config)
}

// se escucha submit del formulario para ejecutar gráfico y tabla
formularioSelector.addEventListener('submit', async (event) => {
    event.preventDefault()
    const emailValor = emailSelector.value
    const passwordValor = passwordSelector.value
    await iniciarSesionConApi(emailValor, passwordValor)
    const resultado = await consumirDatosApiCovid()
    pintarGraficos(resultado)
    imprimirTabla()
})

// funciones que crea los elementos nodos
const crearTd = (texto) => {
    const text = document.createTextNode(texto) // Crea un nuevo nodo de texto
    const td = document.createElement('td')
    td.appendChild(text)
    return td
}

const crearTr = () => {
    return document.createElement('tr')
}


// agregar tabla con datos en el html
const crearTabla = (array) => {
    mostrarTablaSelector.innerHTML = `
        <tr>
        <th scope='col'>PAIS</th>
        <th scope='col'>CONFIRMADOS</th>
        <th scope='col'>MUERTES</th>
        <th scope='col'>RECUPERADOS</th>
        <th scope='col'>ACTIVOS</th>
        <th scope='col'>DETALLES</th>
        </tr>`
    // se agregan nodos con "appendChild" utilizando un ciclo donde se escriben los datos de cada iteración
    for (let i = 0; i < array.length; i++) {
        const tr = crearTr()
        tr.appendChild(crearTd(array[i].location))
        tr.appendChild(crearTd(array[i].confirmed))
        tr.appendChild(crearTd(array[i].deaths))
        tr.appendChild(crearTd(array[i].recovered))
        tr.appendChild(crearTd(array[i].active))

        const tdButton = crearTd('')
        const button = document.createElement('button') // crea elemento botón
        button.dataset.location = array[i].location
        button.dataset.indice = i
        button.addEventListener('click', manejadorClickDetalles)

        button.classList.add('btn', 'btn-link', 'boton-modal') // estilos de boton
        const buttonText = document.createTextNode('Ver detalles') // botón ver detalles
        button.appendChild(buttonText) 
        tdButton.appendChild(button) 
        tr.appendChild(tdButton) // Se crean nodos para botón 

        mostrarTablaSelector.appendChild(tr)
    }
}

// está función asíncrona ejecuta lo definido en la tabla
const imprimirTabla = async () => {
    const mostrarDatos = await consumirDatosApiCovid()
    crearTabla(mostrarDatos)
}

const manejadorClickDetalles = async (e) => {
    const location = e.target.dataset.location
    // destroy para limpiar gráficos
    // https://www.chartjs.org/docs/latest/developers/api.html
    if (graficoDatosPais !== null) {
        graficoDatosPais.destroy()
    }
    await datoModalApiPais(location)
    datosPaisModal.show()
}