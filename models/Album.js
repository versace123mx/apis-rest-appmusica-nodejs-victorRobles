import mongoose from "mongoose";

//Creamos el Schema
const AlbumSchema = mongoose.Schema({
    artist:{
        type: mongoose.Schema.Types.ObjectId, //este es el que indica que sera un tipo id objeto
        ref: 'Artist', //este es la referencia asia el id del usuario
        default: null
    },
    titulo: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    year:{
        type:Number,
        required: true
    },
    estado:{
        type: Boolean,
        default: true
    },
    imagen:{
        type: String,
        default:"no-image.jpg"
    },
    create_at:{
        type: Date,
        default:Date.now()
    },
    update_at:{
        type: Date,
        default:Date.now()
    }
})

//Retornamos solo los datos que nesecitamos ver no el passsword, no el __v, no _id esto es del Schema y al _id le cambiamos el nombre visualmente
AlbumSchema.methods.toJSON = function(){
    const {__v, _id, estado, update_at, imagen, ...album} = this.toObject();
    album.uid = _id;
    return album;
}

//Creamos el modelo dentro colocamos el nombre de la coleccion y le pasamos el schema, la coleccione ahora en mongo sera Articulo
const Album = mongoose.model('Album',AlbumSchema);

//Exportamos el modelo
export default Album;