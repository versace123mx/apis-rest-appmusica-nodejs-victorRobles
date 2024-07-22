import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createAlbum, getAlbumforId, showAlbums, updateAlbum , updateAlbumImage, showImageAlbum } from '../controllers/index.js'

const route = Router();

//Rutas para seguir a un usuario
route.post('/album/create',[
    validarJWT,
    check('artist','El campo artist debe de tener un id de Mongo Valido').isMongoId(),
    check('titulo','El campo titulo del Album es requerido').notEmpty().trim().toLowerCase(),
    check('titulo','El campo titulo del Album debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('description','El campo description del Album es requerido').notEmpty().trim().toLowerCase(),
    check('description','El campo description del Album debe ser minimo de 3 caracteres').isLength({min:3,max:70}).trim().toLowerCase(),
    check('year','El campo year es requerido').notEmpty().trim(),
    check('year','El campo year debe ser numerico de 4 caracteres').isNumeric().isLength({min:4,max:4}),
    validarCampos
],createAlbum)

//Mostrar un album por id
route.get('/album/get-album/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],getAlbumforId)


//Mostrar albunes por id
route.get('/album/get-albums-for-id/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],showAlbums)

//Metodo para actualizar datos del album por id
route.put('/album/update-album/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    check('titulo','El campo titulo del Album es requerido').notEmpty().trim().toLowerCase(),
    check('titulo','El campo titulo del Album debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('description','El campo description del Album es requerido').notEmpty().trim().toLowerCase(),
    check('description','El campo description del Album debe ser minimo de 3 caracteres').isLength({min:3,max:70}).trim().toLowerCase(),
    check('year','El campo year es requerido').notEmpty().trim(),
    check('year','El campo year debe ser numerico de 4 caracteres').isNumeric().isLength({min:4,max:4}),
    validarCampos
],updateAlbum)

//Metod para actualizar imagen del album por id
route.put('/album/update-album-image/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarArchivoSubir
],updateAlbumImage)


//Metodo para mostrar la imagen de un album por id
route.get('/album/show-album-image/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
],showImageAlbum)
export default route