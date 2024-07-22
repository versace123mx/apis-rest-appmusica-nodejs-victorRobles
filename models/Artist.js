import mongoose from "mongoose";

//Creamos el Schema
const ArtistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
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
ArtistSchema.methods.toJSON = function(){
    const {__v, _id, estado, update_at, imagen, ...artist} = this.toObject();
    user.artist = _id;
    return artist;
}

//Creamos el modelo dentro colocamos el nombre de la coleccion y le pasamos el schema, la coleccione ahora en mongo sera Articulo
const Artist = mongoose.model('Artist',ArtistSchema);

//Exportamos el modelo
export default Artist;