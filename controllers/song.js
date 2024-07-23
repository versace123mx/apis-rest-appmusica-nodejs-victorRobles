import fs from 'fs'
import { subirArchivo } from '../helper/subir-archivo.js'
import { Album, Song } from '../models/index.js'

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
const showSongs = async (req, res) => {
    
    //Recibo los datos del id
    const { id } = req.params

    try {
        //Verificamos si el album existe y esta activo
        const album = await Album.findOne({_id:id, estado:true})
        if(!album){
            return res.status(200).json({ status: "error", msg: "Album no encontrada", data:[] })
        }

        //verifico si el album tiene canciones asociadas
        const songs = await Song.find({album:id, estado:true}).select('-create_at -album')
        .populate('album','titulo description year -_id')
        if(!songs){
            return res.status(200).json({ status: "error", msg: "Canciones no encontradas", data:[] })
        }

        res.status(200).json({ status: "success", msg: "Canciones encontradas",data:songs})

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el registro",data:[],error})
    }

}

//Metodo para actualizar cancion de un album
const updateSong = async (req, res) => {

    const { track, name, duration } = req.body
    const { id } = req.params

    try {
        const songUpdate = await Song.findByIdAndUpdate(
            {_id:id, estado:true},
            { track, name, duration, update_at: Date.now()}, 
            {new: true}).select("name track duration")

            if(!songUpdate){
                return res.status(200).json({status: "success", msg:"La Cancion no existe con ese criterio de busqueda o ya ha sido eliminada, intenta con otro id de una Cancion valida",data:[]})
            }
        
        res.status(200).json({ status: "success", msg:"desde update Song",data:songUpdate})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"no se pudieron actualizar los datos.",data:'',error})
    }

}

//Metodo para subir el archivo de la cancion
const updateFileSong = async (req, res) => {

    const { id } = req.params

    try {
    
        const song = await Song.findOne({_id:id, estado:true})
        if(!song){
            return res.status(200).json({status: "success", msg:"La Cancion no existe con ese criterio de busqueda o ya ha sido eliminado, intenta con otro id de un Cancion valida",data:[]})
        }
        
        const pathImage = './uploads/img-song/' + song.file //creamos la ruta de la imagen previa
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)//en caso de que la imagen previa exista procedemos a eliminarla
        }

        const nombre = await subirArchivo(req.files, ['mp3'], 'img-song')
        song.file = nombre
        song.update_at = Date.now()
        await song.save({ new: true })
        res.status(200).json({ status: "success", msg:"La cancion mp3 se ha Actualizada Correctamente",data:[]})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"No se pudo actualizar la imagen.",data:[],error})
    }

}

//Metodo para eliminar cancion
const deleteSong = async (req, res) => {

    const { id } = req.params

    try {

        const sognUpdate = await Song.findOneAndUpdate({_id:id, estado:true},
                                    {estado:false,update_at: Date.now()}, {new: true})
                                    .select("-album -file -create_at")

        if(!sognUpdate){
            return res.status(200).json({ status: "error", msj: 'La Cancion no se encuentra o ha sido eliminada', data:[] });
        }

        res.status(200).json({ status: "success", msg:"La canciones se han eliminado, correctamente",data:sognUpdate})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"no se pudieron eliminar, validado con el admin.",data:[],error})
    }

}


export {
    createSong,
    showSong,
    showSongs,
    updateSong,
    updateFileSong,
    deleteSong
}