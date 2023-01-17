import React, { useState } from "react";
import * as albumActions from "../../../store/album";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import './style.css'
import { mapErrors } from "../../../util";

function CreateAlbumModal({ edit, album, onClose }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState(edit ? album : {
    title: '',
    description: '',
    imageUrl: '',
  })
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    const method = edit ? albumActions.editAlbum : albumActions.createAlbum
    return dispatch(method(data))
      .then(() => {
        onClose && onClose()
        dispatch(albumActions.setAlbums([]))
        dispatch(albumActions.getAlbumsOfCurrentUser())
        closeModal()
      })
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(mapErrors(data.errors));
        }
      );
  };

  const setDataField = (name, e) => {
    const value = e.target.value
    setData(state => ({
      ...state,
      [name]: value
    }))
  }

  return (
    <div className="Form">
      <div className="title">{edit ? `Edit ${album.title}` : 'Add A New Album'}</div>
      {errors.length > 0 && <ul className="form-error">
        {errors.map((error, idx) => (
          <li key={idx} className="warning">{error}</li>
        ))}
      </ul>}
      <form onSubmit={handleSubmit}>
        <label>
          Title <input type="text" value={data.title} onChange={setDataField.bind(this, 'title')} required />
        </label>
        <label>
          Description <input type="text" value={data.description} onChange={setDataField.bind(this, 'description')} />
        </label>
        <label>
          Cover Image URL <input type="text" value={data.imageUrl} onChange={setDataField.bind(this, 'imageUrl')} required />
        </label>
        <div className="actions">
          <button className="general-button" onClick={closeModal}>Cancel</button><button className="general-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CreateAlbumModal;
