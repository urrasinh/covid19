

const ctx = document.getElementById('grafico');

const graficoWeb = () => {
    fetch(`http://localhost:3000/api/total`).then((respuesta) => {
        respuesta.json().then((data) => {
            console.log(data)
            grafico(data)
            
        })
    })
}

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


/*
let alumnos = [
    {nombre: 'Juan', edad: 24},
    {nombre: 'Pedro', edad: 19},
    {nombre: 'Maria', edad: 22},
    {nombre: 'Jose', edad: 28},
    {nombre: 'Diego', edad: 18},
    ]
    let alumnosNuevo = alumnos.map(alumno => {
    alumno.esMayor = alumno.edad > 18
    return alumno
    })

    */

