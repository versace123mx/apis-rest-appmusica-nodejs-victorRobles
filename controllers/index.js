import { createUser, login, profile , updateProfile, updateImageProfile, showImageProfile } from './user.js'
import { createArtist, getArtist, getlistArtist, updateArtistInfo, eliminarArtista, updateImageArtist, showImageArtist } from './artist.js'
import { createAlbum, getAlbumforId, showAlbums, updateAlbum, updateAlbumImage, showImageAlbum } from './album.js'
import { createSong, showSong, showSongs, updateSong, updateFileSong } from './song.js'

export {
    createUser,
    login,
    profile,
    updateProfile,
    updateImageProfile,
    showImageProfile,
    createArtist,
    getArtist,
    getlistArtist,
    updateArtistInfo,
    eliminarArtista,
    updateImageArtist,
    showImageArtist,
    createAlbum,
    getAlbumforId,
    showAlbums,
    updateAlbum,
    updateAlbumImage,
    showImageAlbum,
    createSong,
    showSong,
    showSongs,
    updateSong,
    updateFileSong
}