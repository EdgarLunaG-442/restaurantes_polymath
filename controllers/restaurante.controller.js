const { request, response } = require("express")
const { Restaurante } = require("../models/restaurante")
const mongoose = require('mongoose')

const crearRestaurante = async(req=request,res=response)=>
{
	let {urlFoto,...resto} = req.body
	if (urlFoto)
	{
		resto.urlFoto = urlFoto
	}
	try
	{
		const nuevoRestaurante = await new Restaurante(resto)
		res.json(nuevoRestaurante)
		await nuevoRestaurante.save()
	}

	catch(e)
	{
		res.json(e)
	}
}

const eliminarRestaurante = async(req=request,res=response)=>
{
	const {id:idRestaurante}= req.params
	try
	{
		const restauranteElimnar = await Restaurante.findByIdAndDelete(idRestaurante)
		res.json({mensaje: `Se elimino correctamente el restaurante: ${restauranteElimnar.nombre}`})

	}
	catch(e)
	{
		res.json(e)
	}
}
const actualizarRestaurante = async(req=request,res=response)=>
{
	const {id:idRestaurante}= req.params
	const restauranteActualizar = await Restaurante.findById(idRestaurante)
	const actualizarInfoRestaurante = 
	{
		nombre: req.body['nombre']?req.body['nombre']:restauranteActualizar.nombre,
		descripcion: req.body['descripcion']?req.body['descripcion']:restauranteActualizar.descripcion,
		direccion:req.body['direccion']?req.body['direccion']:restauranteActualizar.direccion,
		ciudad: req.body['ciudad']?req.body['ciudad']:restauranteActualizar.ciudad,
		urlFoto: req.body['urlFoto']?req.body['urlFoto']:restauranteActualizar.urlFoto,
	}
	try
	{
		const restauranteElimnar = await Restaurante.findByIdAndUpdate(idRestaurante,req.body)
		res.json({mensaje: `Se actualizó correctamente el restaurante: ${restauranteElimnar.nombre}`})

	}
	catch(e)
	{
		res.json(e)
	}
}
const obtenerRestaurantes = async(req=request,res=response)=>
{
	const restaurantes = await Restaurante.aggregate(
		[
			{
				$addFields:
				{
					id:"$_id"
				}
			},
			{
				$project:
				{
					reservas:0,
					"__v":0,
					"_id":0
				}
			}
		]
	)
	if(!restaurantes)
	{
		res.status(404).json({mensaje:'No hay restaurantes'})
	}
	else
	{
		res.status(200).json(restaurantes)
	}
}

const reservarRestaurante=async(req=request,res=response)=>
{
	const {id:idRestaurante}= req.params
	let {dia,mes,anio,hora,minuto} = req.body
	let fecha = new Date(anio,mes-1,dia,hora-5,minuto,0)

	try
	{
		const restauranteActualizar = await Restaurante.findById(idRestaurante)
		restauranteActualizar.reservas.push(fecha)
		await Restaurante.findByIdAndUpdate(idRestaurante,restauranteActualizar)
		res.status(200).json({mensaje: 'Se realizo correctamente la reserva'})
	}
	catch(e)
	{
		res.status(400).json({error:e})
	}
}

const detallarRestaurante = async(req=request,res=response)=>
{	
	let midnight = new Date();
	midnight.setHours(24-5,0,0,0)
	let midnightPrev = new Date();
	midnightPrev.setHours(0-5,0,0,0)
	let hoy = req.query.hoy
	try
	{
		
		let reservasHoy
		if(hoy)
		{
			reservasHoy = await Restaurante.aggregate(
				[
					{
						$match:
						{
							_id:mongoose.Types.ObjectId(`${req.params.id}`)
						}
					},
					{
						$addFields:
						{
							id:"$_id"
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
							},
							nombre:1,
							descripcion:1,
							direccion:1,
							ciudad:1,
							urlFoto:1,
							id:1,
							_id:0
						}
					}
				]
			)
		}
		else
		{
			reservasHoy = await Restaurante.aggregate(
				[
					{
						$match:
						{
							_id:mongoose.Types.ObjectId(`${req.params.id}`)
						}
					},
					{
						$addFields:
						{
							id:"$_id"
						}
					},
					{
						$project:
						{
							_id:0
						}
					}
				]
			)
		}
		res.status(200).json(reservasHoy[0])
	}
	catch(e)
	{
		res.status(404).json(e)
	}


}

module.exports = 
{
	crearRestaurante,
	eliminarRestaurante,
	actualizarRestaurante,
	obtenerRestaurantes,
	reservarRestaurante,
	detallarRestaurante
}