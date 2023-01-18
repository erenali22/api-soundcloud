import { csrfFetch } from './csrf';

const SET_SONGS = 'songs/set';
const APPEND_SONGS = 'songs/append';
export const PAGE_SIZE = 5;

export const setSongs = (songs) => {
  return {
    type: SET_SONGS,
    payload: { songs },
  };
};

export const appendSongs = (songs) => {
  return {
    type: APPEND_SONGS,
    payload: { songs },
  };
}

const initialState = { songs: [] };

const songsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONGS:
      return {
        ...state,
        songs: action.payload.songs
      }
    case APPEND_SONGS:
      console.log(222, state.songs)
      return {
        ...state,
        songs: [...(state.songs || []), ...action.payload.songs]
      }
    default:
      return state;
  }
};

export const getAllSongs = ({ page, title, replace }) => async (dispatch) => {
  const response = await csrfFetch(`/api/songs?page=${(+page || 1) - 1}&size=${PAGE_SIZE}${title ? `&title=${encodeURIComponent(title)}` : ''}`);
  const data = await response.json();
  if (replace) {
    dispatch(setSongs(data.Songs))
  } else {
    dispatch(appendSongs(data.Songs))
  }
  return data.Songs;
};

export const getSongsOfCurrentUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/songs/current');
  const data = await response.json();
  dispatch(setSongs(data.Songs));
  return response;
};

export const createSong = (body) => async (dispatch) => {
  const { albumId, title, description, url, imageUrl } = body
  const response = await csrfFetch('/api/songs', {
    method: "POST",
    body: JSON.stringify({ albumId, title, description, url, imageUrl }),
  });
  return response;
};

export const editSong = (body) => async (dispatch) => {
  const { id, albumId, title, description, url, imageUrl } = body
  const response = await csrfFetch(`/api/songs/${id}`, {
    method: "PUT",
    body: JSON.stringify({ albumId, title, description, url, imageUrl }),
  });
  return response;
};

export const deleteSong = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/songs/${id}`, {
    method: "DELETE"
  });
  return response;
};


export default songsReducer;