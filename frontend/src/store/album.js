import { csrfFetch } from './csrf';

const SET_ALBUMS = 'album/setAlbums';
export const PAGE_SIZE = 10

export const setAlbums = (albums) => {
  return {
    type: SET_ALBUMS,
    payload: { albums },
  };
};

const initialState = { albums: [] };

const albumsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALBUMS:
      return {
        ...state,
        albums: action.payload.albums
      }
    default:
      return state;
  }
};

export const getAlbumsOfCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/albums/current');
  const data = await response.json();
  dispatch(setAlbums(data.Albums));
  return data.Albums;
};

export const createAlbum = (body) => async () => {
  const { title, description, imageUrl } = body
  const response = await csrfFetch('/api/albums', {
    method: "POST",
    body: JSON.stringify({ title, description, imageUrl }),
  });
  return response;
};

export const editAlbum = (body) => async () => {
  const { id, title, description, imageUrl } = body
  const response = await csrfFetch(`/api/albums/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description, imageUrl }),
  });
  return response;
};

export const deleteAlbum = (id) => async () => {
  const response = await csrfFetch(`/api/albums/${id}`, {
    method: "DELETE"
  });
  return response;
};


export default albumsReducer;