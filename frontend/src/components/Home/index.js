import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as songActions from "../../store/songs";
import * as albumActions from '../../store/album';
import './style.css'

export function Home() {
  const dispatch = useDispatch();
  const songs = useSelector(state => state.songs.songs);
  const albums = useSelector(state => state.album.albums);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    if (!sessionUser) {
      return
    }
    dispatch(songActions.getSongsOfCurrentUser())
    dispatch(albumActions.getAlbumsOfCurrentUser())
    return () => {
      dispatch(songActions.setSongs(null))
      dispatch(albumActions.setAlbums(null))
    }
  }, [dispatch, sessionUser])

  return <div className='main home'>
    {
      !sessionUser && <>
        <div className='wrapper'>
          <h2>Sign in or sign up to start</h2>
        </div>
      </>
    }
    {sessionUser && <>
      <div className='wrapper'>
        <h2>Your Albums</h2>
        <div className='list'>
          {
            albums?.slice(-5).map(album => (
              <div className='list-item' key={album.id}>
                <img src={album.imageUrl} alt={album.title}></img>
                <span className='name'>{album.title}</span>
                <span className='desc'>{album.description}</span>
              </div>))
          }
        </div>
      </div>
      <div className='wrapper'>
        <h2>Your Songs</h2>
        <div className='list'>
          {songs?.slice(-5).map(song => (
            <div className='list-item' key={song.id}>
              <img src={song.imageUrl} alt={song.title}></img>
              <span className='name'>{song.title}</span>
              <span className='desc'>{song.description}</span>
            </div>))}
        </div>
      </div>
    </>}
  </div>
}