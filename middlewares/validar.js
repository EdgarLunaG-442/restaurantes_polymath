const {validationResult} = require('express-validator')
const validar = async(req,res,next)=>
{
	if(!validationResult(req).isEmpty())
	{
		res.status(400).json({error:validationResult(req).array()})
		return
	}
	next()
}

module.exports = validar