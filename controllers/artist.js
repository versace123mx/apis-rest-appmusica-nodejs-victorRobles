import fs from 'fs'
import bcrypt from 'bcryptjs'
import generarJWT   from '../helper/generarJWT.js'
import { subirArchivo } from '../helper/subir-archivo.js'
import { Artist } from '../models/index.js'


const createArtist = async (req, res) => {
    //hacemos desestructuring
    const { name, description } = req.body

    //creamos un objeto artist y le asignamos los datos que vamos a guardar, los que destructuramos
    const artist = new Artist({name,description})

    //validamos si el artista ya existe
    const artista = await Artist.findOne({name})
    //console.log(artista)
    //return

    if(artista){
        return res.status(200).json({status:"error",msg:"El Artista ya exite, intenta con otro artista",data:[],name})
    }

    //Guardar en DB
    try {
        await artist.save()
        res.status(200).json({status:"success",msg:"Artista registrado correctamente",data:artist})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al guardar el registro",data:[],error})
    }
}

export {
    createArtist
}