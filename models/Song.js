import mongoose from "mongoose";

//Creamos el Schema
const SongSchema = mongoose.Schema({
    album:{
        type: mongoose.Schema.Types.ObjectId, //este es el que indica que sera un tipo id objeto
        ref: 'Album', //este es la referencia asia el id del usuario
        default: null
    },
    track:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    file:{
        type:String,
        required: true
    },
    estado:{
        type: Boolean,
        default: true
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
SongSchema.methods.toJSON = function(){
    const {__v, _id, estado, update_at, imagen, ...song} = this.toObject();
    song.uid = _id;
    return song;
}

//Creamos el modelo dentro colocamos el nombre de la coleccion y le pasamos el schema, la coleccione ahora en mongo sera Articulo
const Song = mongoose.model('Song',SongSchema);

//Exportamos el modelo
export default Song;