import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
import { createUser, login, profile, updateProfile, updateImageProfile, showImageProfile } from '../controllers/index.js'

const route = Router();

//Rutas para crear un usuario
route.post('/user/create-user',[
    check('name','El campo nombre es requerido').notEmpty().trim().toLowerCase(),
    check('name','El campo nombre debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('nick','El campo nick es requerido').notEmpty().trim().toLowerCase(),
    check('nick','El campo nick debe ser minimo de 3 caracteres').isLength({min:3,max:50}).trim().toLowerCase(),
    check('email','El campo email es requerido').notEmpty().trim().toLowerCase(),
    check('email','El campo email no tine formato de email valido').isEmail().trim().toLowerCase(),
    check('password','El campo password es requerido').notEmpty().trim(),
    check('password','El password debe de ser minimo de 8 caracteres').isLength({min:8,max:70}).trim(),
    check('surname').trim().toLowerCase(),
    validarCampos
],createUser)

//Ruta para login
route.post('/user/login',[
    check('email','El campo email es requerido').notEmpty().trim().toLowerCase(),
    check('email','El campo email no tine formato de email valido').isEmail().trim().toLowerCase(),
    check('password','El campo password es requerido').notEmpty().trim(),
    validarCampos
],login)


//Ruta para obtener el perfil de un usuario por id
route.get('/user/profile/:id',[
    validarJWT,
    check('id','El id no es un id de Mongo valido').isMongoId(),
    validarCampos
],profile)

//Ruta para actualizar los datos del usuario logeado
route.put('/user/updateprofile',[
    validarJWT,
    check('name','El campo Name no debe de estar vacio').rtrim().notEmpty().toLowerCase(),
    check('surname','El campo Surname no debe de estar vacio').rtrim().notEmpty().toLowerCase(),
    validarCampos
],updateProfile)

//Actualiza imagen de perfil, usuario logueado
route.put('/user/updateimageprofile',[
    validarJWT,
    validarArchivoSubir
],updateImageProfile)


//Ruta para mostrar la imagen de perfil logueado
route.get('/user/mostrar-imagen-perfil',validarJWT,showImageProfile)

export default route