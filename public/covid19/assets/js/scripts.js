const formularioSelector = document.querySelector('#formulario')
const emailSelector = document.querySelector('#email')
const passwordSelector = document.querySelector('#password')
const mostrarTablaSelector = document.querySelector('#cuerpo-tabla')
const modalChartSelector = document.querySelector('#myChartModal')

let graficoDatosPais = null

const datosPaisModal = new bootstrap.Modal(document.querySelector('#exampleModal'), {})

// funcionalidad para iniciar sesión con la api
const iniciarSesionConApi = async (email, password) => {
    console.log(email, password)
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token) //persistir el js, lo que significa que va a quedar guardado en el navegador
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

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
    console.log(location, active, confirmed, recovered, deaths, modalChartSelector)

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
                text: 'Predicted world population (millions) in 2050'
            }
        }
    });
}

const datoModalPais = async (locationText) => {
    //const pais = locationText
    const jwtToken = localStorage.getItem('jwt-token')
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${locationText}`,
            {
                method:
                    'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }

            })
        const { data } = await response.json()
        // $('#exampleModal').modal('toggle') // Agrega la propiedad toggle a nuestro modal
        crearChart(data.location, data.active, data.confirmed, data.recovered, data.deaths, modalChartSelector)

        return data

        //const modalChartSelector = document.querySelector('#modal-country')
        //crearChartModal(data.location, data.confirmed, data.deaths, data.recovered, data.active, modalChartSelector)
    }
    catch (error) {
        console.log(error)
    }
}


const pintarGraficos = (datosParaGrafico) => {
    const datosFiltradosContagio = datosParaGrafico.filter(datoPais => {
        return datoPais.confirmed >= 10000000
    })

    const ctx = document.getElementById('grafico');

    const data = {
        labels: datosFiltradosContagio.map(p => p.location),
        datasets: [
            {
                label: 'Confirmados',
                data: datosFiltradosContagio.map(p => p.confirmed),
                borderColor: 'red',
                backgroundColor: 'red',
                yAxisID: 'y1'
            },
            {
                label: 'Muertos',
                data: datosFiltradosContagio.map(p => p.deaths),
                borderColor: 'blue',
                backgroundColor: 'blue',
                yAxisID: 'y2'
            }
        ]
    };

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
                    text: 'Chart.js Bar Chart'
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
    };

    const myChart = new Chart(ctx, config)
}


formularioSelector.addEventListener('submit', async (event) => {
    event.preventDefault()
    // TODO: se comentaron y remplaron las const entregando de inmediato los datos
    const emailValor = 'Telly.Hoeger@billy.biz'
    const passwordValor = 'secret'
    //const emailValor = emailSelector.value
    //const passwordValor = passwordSelector.value

    await iniciarSesionConApi(emailValor, passwordValor)
    const jwtToken = localStorage.getItem('jwt-token')
    console.log(jwtToken)
    const resultado = await consumirDatosApiCovid()
    console.log(resultado)
    pintarGraficos(resultado)
    imprimirTabla();
})



// Intentando imprimir datos Api en tabla :S

const crearTd = (texto) => {
    const text = document.createTextNode(texto);
    const td = document.createElement('td');
    td.appendChild(text);
    return td;
};

const crearTr = () => {
    return document.createElement('tr');
};

const manejadorDeClick = async (e) => {
    const indice = e.target.dataset.indice;
    const location = e.target.dataset.location;
    console.log(indice, location);
    // destroy para limpiar gráficos
    // https://www.chartjs.org/docs/latest/developers/api.html
    if (graficoDatosPais !== null) {
        graficoDatosPais.destroy()
    }
    const pais = await datoModalPais(location)
    console.log(pais)
    datosPaisModal.show()

};

const crearTabla = (array) => {
    mostrarTablaSelector.innerHTML = `
        <tr>
        <th scope='col'>LOCATION</th>
        <th scope='col'>CONFIRMED</th>
        <th scope='col'>DEATHS</th>
        <th scope='col'>RECOVERED</th>
        <th scope='col'>ACTIVE</th>
        <th scope='col'>DETAILS</th>
        </tr>`;

    // Agregar nodo / elemento a const tr
    for (let i = 0; i < array.length; i++) {
        const tr = crearTr();
        tr.appendChild(crearTd(array[i].location));
        tr.appendChild(crearTd(array[i].confirmed));
        tr.appendChild(crearTd(array[i].deaths));
        tr.appendChild(crearTd(array[i].recovered));
        tr.appendChild(crearTd(array[i].active));

        const tdButton = crearTd('');
        const button = document.createElement('button');
        button.dataset.location = array[i].location;
        button.dataset.indice = i;
        button.addEventListener('click', manejadorDeClick);

        button.classList.add('btn', 'btn-link', 'boton-modal');
        const buttonText = document.createTextNode('Ver detalles');
        button.appendChild(buttonText);
        tdButton.appendChild(button);
        tr.appendChild(tdButton);

        mostrarTablaSelector.appendChild(tr);
    }
};

const imprimirTabla = async () => {
    const mostrarDatos = await consumirDatosApiCovid()
    console.log(mostrarDatos)
    crearTabla(mostrarDatos)
}

