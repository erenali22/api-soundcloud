import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as albumActions from "../../../store/album";
import { useDispatch } from "react-redux";
import './style.css'

export default function AlbumDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [album, setAlbum] = useState(null)
  useEffect(() => {
    dispatch(albumActions.getAlbum(id)).then(album => setAlbum(album))
    return () => {
      setAlbum(null)
    }
  }, [dispatch, id])
  return album && <div className="main album-details">
    <div className="title">
      <div className="badge-container">
        <div className="badge large">{album.title}</div>
        <div className="badge">{album.Artist?.firstName}{album.Artist?.lastName}</div>
        <div className="badge">{album.description}</div>
      </div>
      <img src={album.imageUrl} alt="Album Cover"></img>
    </div>
    <ul className="song-ul">
      {
        album.Songs?.map((song, idx) => (<li key={song.id} className="song-li">
          <img src={song.imageUrl} alt="Song Cover"></img><span>{idx + 1}</span>
          <span>{song.Artist?.firstName}{' '}{song.Artist?.lastName}</span>
          <span>-</span><span className="highlight">{song.title}</span>
        </li>))
      }
    </ul>
  </div>
}
