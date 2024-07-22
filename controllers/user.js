import fs from 'fs'
import bcrypt from 'bcryptjs'
import generarJWT   from '../helper/generarJWT.js'
import { subirArchivo } from '../helper/subir-archivo.js'
import User from '../models/User.js'

//Metodo para crear un usuario
const createUser = async (req, res) => {
    //hacemos desestructuring
    const { nick, email, password, ...data } = req.body

    //creamos un objeto usuario y le asignamos los datos que vamos a guardar, los que destructuramos y el resto
    const usuario = new User({nick,email,...data})

    //validamos si el nick o el email ya existen ya que estos campos son unicos
    const user = await User.findOne({"$or":[{nick}, {email}]})
    if(user){
        return res.status(200).json({status:"error",msg:"El nickname o el email ya exiten, intenta con otro nickname u otro email",data:[],nick,email})
    }

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt) //Encriptamos la contraseña con el salt del objeto usuario.password

    //Guardar en DB
    try {
        await usuario.save()
        res.status(200).json({status:"success",msg:"Usuario registrado correctamente",data:usuario})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al guardar el registro",data:[],error})
    }
}


//Metodo para login
const login = async (req, res) => {
    
    //Extraigo lo que llega en el body
    const { email, password } = req.body

    try {
        
        //verifico si el usuario existe
        const user = await User.findOne({email,estado:true})
        if(!user){
            return res.status(200).json({ status: "error", msg: "Usuario no encontrado",data:[] })
        }
        
        //validar contraseña
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword){
            return res.status(400).json({ status:"error", msg: 'El email o password son incorrectos. - password',data:[]})
        }

        //Generar JWT se accede user.id o user._id ya que mongo asi lo permite id es un alias de _id
        const token = generarJWT(user.id)

        res.status(200).json({status:"success",msg:"login",
                                data:{name:user.name,nick:user.nick,token}})
    } catch (error) {
        return res.status(400).json({ status:"error", msg: 'Error en la generacion del token',data:[],error})
    }

}

//Mostrar perfil de usuario
const profile = async (req, res) => {

    //Recibo los datos del id
    const { id } = req.params
        
    try {
        //verifico si el usuario existe
        const user = await User.findOne({_id:id,estado:true})
        if(!user){
            return res.status(200).json({ status: "error", msg: "Usuario no encontrado",data:[] })
        }

        res.status(200).json({ status: "success", msg: "Usuario encontrado exitosamente",data:user})
    } catch (error) {
        return res.status(400).json({ status:"error", msg: 'Error en la peticion de buscar usuario',data:[],error})
    }
}

//Actualizar los datos del usuario logueado
const updateProfile =  async (req, res) => {

    const { name,surname } = req.body

    try {
        const userUpdate = await User.findByIdAndUpdate(
            {_id:req.usuario.id, estado:true},
            {name,surname,update_at: Date.now()}, 
            {new: true})
        res.status(200).json({ status: "success", msg:"desde update",data:userUpdate})
    } catch (error) {
        res.status(400).json({ status: "error", msg:"no se pudieron actualizar los datos.",data:'',error})
    }
}

export {
    createUser,
    login,
    profile,
    updateProfile
}