import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createArtist, getArtist, getlistArtist, updateArtistInfo, eliminarArtista, updateImageArtist, showImageArtist } from '../controllers/index.js'

const route = Router();

//Rutas para seguir a un usuario
route.post('/artist/create-artist',[
    validarJWT,
    check('name','El campo nombre es obligatorio').notEmpty().trim().toLowerCase(),
    check('name','El campo nombre debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('description','El campo description es obligatorio').notEmpty().trim().toLowerCase(),
    check('description','El campo description debe ser minimo de 3 caracteres').isLength({min:3,max:70}).trim().toLowerCase(),
    validarCampos
],createArtist)

//Ruta que obtiene un artista en base a su id
route.get('/artist/get-artist/:id',[
    validarJWT,
    check('id','El Id no es un Id de Mongo valido').isMongoId(),
    validarCampos
],getArtist)

//Ruta para obtener la lista de artistas y paginarlo
route.get('/artist/get-list-artist', validarJWT, getlistArtist)

//Ruta para editar Artista en base a su id
route.put('/artist/update-artist-info/:id',[
    validarJWT,
    check('id','El Id no es un Id de Mongo valido').isMongoId(),
    check('name','El campo nombre es obligatorio').notEmpty().trim().toLowerCase(),
    check('name','El campo nombre debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('description','El campo description es obligatorio').notEmpty().trim().toLowerCase(),
    check('description','El campo description debe ser minimo de 3 caracteres').isLength({min:3,max:70}).trim().toLowerCase(),
    validarCampos
],updateArtistInfo)


//Ruta para eliminar un artista
route.delete('/artist/delete-artist/:id',[
    validarJWT,
    check('id','El Id no es un Id de Mongo valido').isMongoId(),
    validarCampos
],eliminarArtista)


//Ruta para actualizar la imagen del artista apartir de su id
route.put('/artist/updateImage/:id',[
    validarJWT,
    check('id','El Id no es un Id de Mongo valido').isMongoId(),
    validarCampos
], updateImageArtist)

//Ruta para mostrar la imagen del artista en base a su id
route.get('/artist/showImage/:id',[
    validarJWT,
    check('id','El Id no es un Id de Mongo valido').isMongoId(),
    validarCampos
], showImageArtist)
export default route