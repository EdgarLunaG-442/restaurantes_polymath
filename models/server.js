const express  = require('express')
const conectarDB = require('../config/dbconfig')
const cors = require('cors')
require('dotenv').config()
const {restaurantesRouter} = require('../routes/restaurante.routes')

class Server
{
	constructor()
	{
		this.app = express()
		this.port = process.env.PORT
		this.restaurantesUrl = '/api/restaurantes'
		conectarDB()
		this.middlewares()
		this.routes()

	}

	middlewares()
	{
		this.app.use(express.json())
		this.app.use(express.static('public'))
		this.app.use(cors())

	}

	listen()
	{
		this.app.listen(this.port)
		console.log('App corriendo en puerto: ' + this.port)
	}

	routes()
	{
		this.app.use(this.restaurantesUrl,restaurantesRouter)
	}
}

module.exports = Server