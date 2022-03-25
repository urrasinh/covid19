const formularioSelector = document.querySelector('#formulario')
const emailSelector = document.querySelector('#email')
const passwordSelector = document.querySelector('#password')


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
        const data = await response.json()
        return data.data
    } catch (err) {
        console.error(`Error: ${err} `)
        return []
    }
}

//console.log(formularioSelector, emailSelector, passwordSelector)



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

                    // grid line settings
                    grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            }
        },
    };

    const myChart = new Chart(ctx, config)
}




formularioSelector.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log('hola soy un formulario')
    // Telly.Hoeger@billy.biz
    const emailValor = emailSelector.value
    const passwordValor = passwordSelector.value

    await iniciarSesionConApi(emailValor, passwordValor)
    const jwtToken = localStorage.getItem('jwt-token')
    console.log(jwtToken)
    const resultado = await consumirDatosApiCovid()
    console.log(resultado)
    pintarGraficos(resultado)
})


