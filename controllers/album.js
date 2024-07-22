import fs from 'fs'
import { subirArchivo } from '../helper/subir-archivo.js'
import { Artist, Album, Song } from '../models/index.js'


//Metodo para crear un album de un artista por su id
const createAlbum = async (req, res) => {

    //hacemos desestructuring
    const data = req.body

    //creamos un objeto artist y le asignamos los datos que vamos a guardar, los que destructuramos
    const album = new Album(data)

    //validamos si el artista existe
    const artistaValidation = await Artist.findOne({_id:data.artist, estado:true})
    if(!artistaValidation){
        return res.status(200).json({status:"error",msg:"El Artista no exite, intenta con otro artista",data:[]})
    }

    //validamos si el Album ya existe
    const albumValidation = await Album.findOne({titulo:data.titulo})
    if(albumValidation){
        return res.status(200).json({status:"error",msg:"El Album ya exite, intenta con otro album",data:[],album:albumValidation.titulo})
    }

    //Guardar en DB
    try {
        await album.save()
        res.status(200).json({status:"success",msg:"Artista registrado correctamente",data:album})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al guardar el registro",data:[],error})
    }
}

export {
    createAlbum
}