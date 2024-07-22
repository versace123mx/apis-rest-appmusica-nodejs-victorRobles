import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createSong, showSong , showSongs, updateSong} from '../controllers/index.js'

const route = Router();

//Rutas para crear una cancion
route.post('/song/create',[
    validarJWT,
    check('album','El id no es un id de Mongo valido.').isMongoId(),
    check('track','El track debe de ser numerico').isNumeric(),
    check('track','El track debe de tener minimo 1 caracter maximo 2').isLength({min:1, max:2}),
    check('name','El campo nombre es requerido').notEmpty().trim().toLowerCase(),
    check('name','El campo nombre debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('duration','El campo duration es requerido').notEmpty().trim(),
    check('duration','El campo duration debe tener almenos 1 digito a 6').isLength({min:1, max:5}),
    validarCampos
],createSong)

//Mostrar una cancion por id
route.get('/song/get-song/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],showSong)

//Ruta para mostrar las canciones de un album por id
route.get('/song/get-songs-album/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],showSongs)

//Ruta para actualizar los datos de una cancion
route.put('/song/update-song/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    check('track','El track debe de ser numerico').isNumeric(),
    check('track','El track debe de tener minimo 1 caracter maximo 2').isLength({min:1, max:2}),
    check('name','El campo nombre es requerido').notEmpty().trim().toLowerCase(),
    check('name','El campo nombre debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('duration','El campo duration es requerido').notEmpty().trim(),
    check('duration','El campo duration debe tener almenos 1 digito a 6').isLength({min:1, max:5}),
    validarCampos
],updateSong)

export default route