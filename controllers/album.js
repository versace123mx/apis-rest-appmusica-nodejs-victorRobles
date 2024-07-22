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

//Metodo para mostrar un album por id
const getAlbumforId = async (req, res) => {

    //Recibo los datos del id
    const { id } = req.params

    try {

        //verifico si el album existe y su estado es true
        const album = await Album.findOne({_id:id, estado:true}).select('-artist')
        .populate('artist','name description -_id')
        if(!album){
            return res.status(200).json({ status: "error", msg: "Album no encontrado", data:[] })
        }

        res.status(200).json({ status: "success", msg: "Album encontrado",data:album})

    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el registro",data:[],error})
    }

}

//Metodo para mostrar todos los albums de un artista y paginarlo
const showAlbums =  async (req, res) => {

    //Recibo los datos del id
    const { id } = req.params

    const { limite = 5, pagina = 1 } = req.query //Los parametros que bienen en la query

    if(isNaN(limite) || isNaN(pagina)){
        return res.json({ status: "error", msj: 'Los valores deben de ser numeros', data:[] });
    }

    try {
        //Para este caso se crean dos promesas para que corra al mismo tiempo y se hace una destructuracion de arreglos
        const [total, album] = await Promise.all([
            Album.countDocuments({artist:id, estado: true}),
            Album.find({artist:id,estado: true}).skip((pagina-1)*limite).limit(limite).sort("year")
        ])

        if(!total){
            return res.status(200).json({status: "success", msg:"No hay Album para ese criterio de busqueda, intenta con otro id de un Artista valido",data:[]})
        }
        const totalPaginas = Math.ceil(total/limite)
        res.status(200).json({ status: "success", msg:"desde el listado de album's",
            totalRegistros:total,pagina,totalPaginas,numRegistrosMostrarXPagina:limite,data:album})
    } catch (error) {
        return res.status(400).json({status:"error",msg:"Se produjo un erro al obtener el listado de Album's",data:[],error})
    }

}

//Metodo para actualizar los datos basicos de un album por id
const updateAlbum = async (req, res) => {

    const { titulo, description, year } = req.body
    const { id } = req.params

    try {
        const albumUpdate = await Album.findByIdAndUpdate(
            {_id:id, estado:true},
            { titulo, description, year, update_at: Date.now()}, 
            {new: true}).select("titulo description year")

            if(!albumUpdate){
                return res.status(200).json({status: "success", msg:"El Album no existe con ese criterio de busqueda o ya ha sido eliminado, intenta con otro id de un Album valido",data:[]})
            }
        
        res.status(200).json({ status: "success", msg:"desde update",data:albumUpdate})
    } catch (error) {
        res.status(400).json({ status: "error", msg:"no se pudieron actualizar los datos.",data:'',error})
    }

}

//Metodo para actualizar la imagen del album por id
const updateAlbumImage = async (req, res) => {

    const { id } = req.params

    try {
    
        const album = await Album.findOne({_id:id, estado:true})
        if(!album){
            return res.status(200).json({status: "success", msg:"El Album no existe con ese criterio de busqueda o ya ha sido eliminado, intenta con otro id de un Album valido",data:[]})
        }
        
        const pathImage = './uploads/img-album/' + album.imagen //creamos la ruta de la imagen previa
        //verificamos si existe la imagen
        if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)//en caso de que la imagen previa exista procedemos a eliminarla
        }

        const nombre = await subirArchivo(req.files, undefined, 'img-album')
        album.imagen = nombre
        album.update_at = Date.now()
        await album.save({ new: true })
        res.status(200).json({ status: "success", msg:"Imagen Album Actualizada Correctamente",data:[]})
    } catch (error) {
        res.status(400).json({ status: "error", msg:"No se pudo actualizar la imagen.",data:[],error})
    }

}

export {
    createAlbum,
    getAlbumforId,
    showAlbums,
    updateAlbum,
    updateAlbumImage
}