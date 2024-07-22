import fs from 'fs'
import { subirArchivo } from '../helper/subir-archivo.js'
import { Song } from '../models/index.js'

//Metodo para crear una cancion
const createSong = async (req, res) => {
    //hacemos desestructuring
    const { album, track, name, duration } = req.body

    //creamos un objeto usuario y le asignamos los datos que vamos a guardar
    const song = new Song({album, track, name, duration})

    //validamos si la cancion ya existe
    const searchSong = await Song.findOne({name})
    if(searchSong){
        return res.status(200).json({status:"error",msg:"La cancion ya exiten, intenta con otro nombre",data:[],name})
    }

    //Guardar en DB
    try {
        await song.save()
        res.status(200).json({status:"success",msg:"Usuario registrado correctamente",data:song})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al guardar el registro",data:[],error})
    }
}

//Metodo para mostrar cancion
const showSong = async (req, res) => {

    //Recibo los datos del id
    const { id } = req.params

    try {

        //verifico si el album existe y su estado es true
        const album = await Song.findOne({_id:id, estado:true}).select('-create_at -album')
        .populate('album','titulo description year -_id')
        if(!album){
            return res.status(200).json({ status: "error", msg: "Cancion no encontrada", data:[] })
        }

        res.status(200).json({ status: "success", msg: "Cancion encontrada",data:album})

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el registro",data:[],error})
    }

}

//Metodo para listar canciones de un album

//Metodo para actualizar cancion de un album

//Metodo para subir el archivo de la cancion

//Metodo para eliminar cancion

export {
    createSong,
    showSong
}