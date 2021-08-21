let fecha = new Date('08,21,2021')
let fechaHoy = new Date()
fecha.setHours(15,30,5)
console.log(fecha.toLocaleTimeString(),fechaHoy.toLocaleTimeString())