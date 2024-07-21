import {Router} from "express";
import { check } from 'express-validator'
import { validarCampos, validarArchivoSubir, validarJWT } from '../middleware/index.js'
//import { follow, unfollow, followin, followers } from '../controllers/index.js'

const route = Router();

//Rutas para seguir a un usuario
//route.post('/album/follow',validarJWT,follow)


export default route