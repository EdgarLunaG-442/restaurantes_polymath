const { Restaurante } = require("../models/restaurante")
const mongoose = require('mongoose')

const existeRestaurante=async(id)=>
{
	const restauranteId = await Restaurante.findById(id)
	if(!restauranteId)
	{
		throw new Error('el restaurante no existe')
	}
}

const sePuedeReservar = async(id,{req})=>
{
	let {dia,mes,anio,hora,minuto} = req.body
	let fecha = new Date(anio,mes-1,dia,hora-5,minuto,0)
	let midnight = new Date(anio,mes-1,dia,hora-5,minuto,0);
	midnight.setHours(24-5,0,0,0)
	let midnightPrev = new Date(anio,mes-1,dia,hora-5,minuto,0);
	midnightPrev.setHours(0-5,0,0,0)
	let now = new Date();
	let nowLocal = now.getHours()-5
	now.setHours(nowLocal)
	if(fecha<now)
	{
		console.log(fecha)
		throw new Error('No se puede reservar para una fecha ya ocurrida')
	}
	else
	{
		const reservasHoy = await Restaurante.aggregate(
			[
				{
					$match:
					{
						_id:mongoose.Types.ObjectId(`${id}`)
					}
				},
				{
					$project:
					{
						reservas:
						{
							$filter:
							{
								input:"$reservas",
								as:"reserva",
								cond:{$and:[{$lt:["$$reserva",midnight]},{$gt:["$$reserva",midnightPrev]}]}
							}
						}
					}
				}
			]
		)
		const restaurantesConReservasHoy = await Restaurante.aggregate(
			[
				{
					$project:
					{
						reservas:
						{
							$filter:
							{
								input:"$reservas",
								as:"reserva",
								cond:{$and:[{$lt:["$$reserva",midnight]},{$gt:["$$reserva",midnightPrev]}]}
							}
						}
					}
				}
			]
		)

		let sumaReservasRestaurantes = 0

		restaurantesConReservasHoy.forEach(rest=>
			{
				sumaReservasRestaurantes += rest.reservas.length
			}
		)

		if(reservasHoy[0].reservas.length>15 || sumaReservasRestaurantes>19)
		{
			throw new Error('Ya estan todas las reservas ocupadas para éste dia')
		}
	}

		
}

module.exports = 
{
	existeRestaurante,
	sePuedeReservar
}