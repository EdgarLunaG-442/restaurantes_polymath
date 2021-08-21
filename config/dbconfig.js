const mongoose = require('mongoose')
require('dotenv').config()

const conectarDB=()=>
{
	try{
		mongoose.connect(process.env.MONGOSTRING,{ useNewUrlParser: true,useUnifiedTopology: true })
		console.log('Se conecto correctamente a la BD')
	}
	catch(e)
	{
		console.log('Hubo un error al conectar a la BD')
	}
}
module.exports = conectarDB