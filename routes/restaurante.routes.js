const {Router} = require('express')
const {check} = require('express-validator')
const {crearRestaurante, eliminarRestaurante, actualizarRestaurante, obtenerRestaurantes, reservarRestaurante, detallarRestaurante, reservasRestauranteHoy} = require('../controllers/restaurante.controller')
const validar= require('../middlewares/validar')
const {existeRestaurante, sePuedeReservar} = require('../helpers/validadores')
let restaurantesRouter = Router()

// Crea un restaurante
restaurantesRouter.post('/',crearRestaurante)

//Elimina un restaurante a partir de su Id
restaurantesRouter.delete('/:id',[check('id').custom(existeRestaurante),validar],eliminarRestaurante)

//Editar un restaurante a partir de su Id
restaurantesRouter.put('/:id',[check('id').custom(existeRestaurante),validar],actualizarRestaurante)

restaurantesRouter.get('/',obtenerRestaurantes)

restaurantesRouter.get('/:id',[check('id').custom(existeRestaurante),validar],detallarRestaurante)

restaurantesRouter.post('/:id',[check('id').custom(existeRestaurante),check('id').custom(sePuedeReservar),validar],reservarRestaurante)

module.exports = {restaurantesRouter}