import fs from 'fs'
import bcrypt from 'bcryptjs'
import generarJWT   from '../helper/generarJWT.js'
import { subirArchivo } from '../helper/subir-archivo.js'
import { Artist } from '../models/index.js'

//Crear un artista
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

//Obtener un artista
const getArtist = async (req, res) => {

    //Recibo los datos del id
    const { id } = req.params

    try {

        //verifico si el artista existe y su estado es true
        const artist = await Artist.findOne({_id:id, estado:true})
        if(!artist){
            return res.status(200).json({ status: "error", msg: "Artista no encontrado", data:[] })
        }

        res.status(200).json({ status: "success", msg: "Artista encontrado",data:artist})

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el registro",data:[],error})
    }

}

//Metodo para obtener los artistas y paginarlos
const getlistArtist = async (req, res) => {

    const { limite = 5, pagina = 1 } = req.query //Los parametros que bienen en la query

    if(isNaN(limite) || isNaN(pagina)){
        return res.json({ status: "error", msj: 'Los valores deben de ser numeros', data:[] });
    }

    try {
        //Para este caso se crean dos promesas para que corra al mismo tiempo y se hace una destructuracion de arreglos
        const [total, usuarios] = await Promise.all([
            Artist.countDocuments({estado: true}),
            Artist.find({estado: true}).skip((pagina-1)*limite).limit(limite).sort("name")
        ])
        const totalPaginas = Math.ceil(total/limite)
        res.status(200).json({ status: "success", msg:"desde el listado de artistas",
            totalRegistros:total,pagina,totalPaginas,numRegistrosMostrarXPagina:limite,data:usuarios})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el listado de Artistas",data:[],error})
    }

}

//Metodo para editar la informacion del artistas que tenga un estatus de activo
//Tambien solo podria editar esta informacion un usuario con un rol especifico, pero eso no lo hago por ahora
const updateArtistInfo =  async (req, res) => {

    const { name,description } = req.body
    const { id } = req.params

    try {

        const artistUpdate = await Artist.findOneAndUpdate({_id:id,estado: true},
                                    {name,description,update_at: Date.now()}, {new: true})

        if(!artistUpdate){
            return res.status(200).json({ status: "error", msj: 'El artista no se encuentra o ha sido eliminado', data:[] });
        }

        res.status(200).json({ status: "success", msg:"El artistas se ha actualizado correctamente",data:artistUpdate})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"no se pudieron actualizar los datos.",data:'',error})
    }
}

//Metood para eliminar un artista
const eliminarArtista =  async(req, res) => {

    const { id } = req.params

    try {

        const artistUpdate = await Artist.findOneAndUpdate({_id:id},
                                    {estado:false,update_at: Date.now()}, {new: true})

        if(!artistUpdate){
            return res.status(200).json({ status: "error", msj: 'El artista no se encuentra o ha sido eliminado', data:[] });
        }

        res.status(200).json({ status: "success", msg:"El artistas se ha eliminado correctamente",data:artistUpdate})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"no se pudieron eliminar, validado con el admin.",data:[],error})
    }

}

//Metodo para actualizar imagen de Artista
const updateImageArtist = async (req, res) => {

    const { id } = req.params

    try {

        //verificar si el artista esta activa y verificamos si corresponde con el id
        const validaArtist = await Artist.findOne({_id:id,estado:true})
        if(!validaArtist){
            return res.status(200).json({status:"success",msg:"El Artista no existe o ya ha sido eliminado.",data:[] })
        }
        
        const pathImage = './uploads/artist/' + validaArtist.imagen //creamos la ruta de la imagen previa
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)//en caso de que la imagen previa exista procedemos a eliminarla
        }

        const nombre = await subirArchivo(req.files, undefined,'artist')
        const result = await Artist.findOneAndUpdate({_id:id},
            {imagen:nombre,update_at:Date.now()},{ new: true })
        res.status(200).json({ status: "success", msg:"Imagen Actualizada Correctamente", data:[]})
    } catch (error) {
        return res.status(400).json({ status: "error", msg:"No se pudo actualizar la imagen catch.",data:[],error})
    }

}

//Metodo para mostrar la imagen del Artista
const showImageArtist =  async (req, res) => {

    const { id } = req.params

    try {

        //verificar si el artista esta activa y verificamos si corresponde con el id
        const validaArtist = await Artist.findOne({_id:id,estado:true})
        if(!validaArtist){
            return res.status(200).json({status:"success",msg:"El Artista no existe o ya ha sido eliminado.",data:[] })
        }

        //creamos la ruta de la imagen previa
        const pathImage = `${process.cwd()}/uploads/artist/${validaArtist.imagen}` 
        
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage)
        }

    } catch (error) {
        res.status(400).json({ status: "error", msg:"Error Al obtenr la Imagen.",data:[],error})
    }

    const pathImage = `${process.cwd()}/assets/no-image.jpg`
    return res.sendFile(pathImage)

}

export {
    createArtist,
    getArtist,
    getlistArtist,
    updateArtistInfo,
    eliminarArtista,
    updateImageArtist,
    showImageArtist
}