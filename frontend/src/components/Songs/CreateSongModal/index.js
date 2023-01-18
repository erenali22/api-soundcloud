import React, { useEffect, useState } from "react";
import * as songsAction from "../../../store/songs";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import * as albumAction from '../../../store/album'
import './style.css'

function CreateSongModal({ edit, song, onClose }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [albums, setAlbums] = useState([])
  const [songData, setSongData] = useState(edit ? song : {
    title: '',
    description: '',
    url: '',
    imageUrl: '',
    albumId: -1,
  })
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    const method = edit ? songsAction.editSong : songsAction.createSong
    return dispatch(method(songData))
      .then(() => {
        console.log(11111)
        if (onClose) onClose()
        closeModal()
      })
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const setSongDataField = (name, e) => {
    const value = e.target.value
    setSongData(state => ({
      ...state,
      [name]: value
    }))
  }

  useEffect(() => {
    dispatch(albumAction.getAlbumsOfCurrentUser()).then(data => {
      setAlbums(data)
      setSongData(state => ({
        ...state,
        albumId: data[0]?.id
      }))
    })
  }, [dispatch])

  return (
    <>
      <div className="Form">
        <div className="title">{edit ? `Edit ${song.title}` : 'Add A New Song'}</div>
        {errors.length > 0 && <ul className="form-error">
          {errors.map((error, idx) => (
            <li key={error} className="warning">{error}</li>
          ))}
        </ul>}
        <form onSubmit={handleSubmit}>
          <label>Add To Album
            <select required onChange={setSongDataField.bind(this, 'albumId')}>
              {albums.map(album => (<option key={album.id} value={album.id}>{album.title}</option>))}
            </select>
          </label>
          <label>
            Title <input type="text" value={songData.title} onChange={setSongDataField.bind(this, 'title')} required />
          </label>
          <label>
            Description <input type="text" value={songData.description} onChange={setSongDataField.bind(this, 'description')} />
          </label>
          <label>
            Song URL <input type="text" value={songData.url} onChange={setSongDataField.bind(this, 'url')} required />
          </label>
          <label>
            Cover Image URL <input type="text" value={songData.imageUrl} onChange={setSongDataField.bind(this, 'imageUrl')} required />
          </label>
          <div className="actions">
            <button className="general-button" onClick={closeModal}>Cancel</button><button className="general-button" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateSongModal;
