const {model,Schema} = require('mongoose')

const restauranteSchema = new Schema(
	{
		nombre:
		{
			type: String,
			required:true,
			unique:true
		},
		descripcion:
		{
			type: String,
			required: true,
		},
		direccion:
		{
			type: String,
			required:true
		},
		ciudad:
		{
			type: String,
			required:true
		},
		urlFoto:
		{
			type: String,
			default: "https://latarta.com.co/wp-content/uploads/2018/06/default-placeholder.png"
		},
		reservas:
		{
			type: Array,
			default: []
		}
	}
)

module.exports = {Restaurante:model('Restaurante',restauranteSchema)}