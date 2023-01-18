import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as songActions from "../../store/songs";
import CreateSongModal from './CreateSongModal'
import OpenModalButton from '../OpenModalButton';
import { ConfirmModal } from '../ConfirmModal';
import '../grid.css'

export default function Songs() {
  const dispatch = useDispatch();
  const songs = useSelector(state => state.songs.songs);
  const sessionUser = useSelector(state => state.session.user);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (page === 0) {
      return
    }
    dispatch(songActions.getAllSongs({ page, replace: page === 1 }))
      .then(songs => setHasMore(!!songs.length))
  }, [dispatch, page])

  const confirmDelete = (id) => {
    dispatch(songActions.deleteSong(id)).then(() => {
      setPage(0)
      setPage(1)
    })
  }

  return sessionUser && <div className='panel main'>
    <div className='title'>
      <span className='text'>All Songs</span>
      <OpenModalButton
        className='general-button'
        buttonText=" Add A Song"
        modalComponent={<CreateSongModal onClose={() => { setPage(0); setPage(1) }} />} />
    </div>
    <div className='grid'>
      {
        songs && songs.map(song => {
          return <div className='item' key={song.id}>
            <div className='image-wrapper'>
              <img src={song.imageUrl} alt={song.title} />
            </div>
            <div className='text'>{song.title}</div>
            <div className='text muted'>{song.description || <i>No description</i>}</div>
            {song.userId === sessionUser?.id && <div className='actions'>
              <OpenModalButton
                className='general-button small'
                buttonText="Edit"
                modalComponent={<CreateSongModal song={song} edit onClose={() => { setPage(0); setPage(1) }} />} />
              <OpenModalButton
                className='general-button small'
                buttonText="Delete"
                modalComponent={<ConfirmModal hint={`Are you sure to delete song ${song.title} ?`}
                  onConfirm={() => confirmDelete(song.id)} />} />
            </div>}
          </div>
        })
      }
    </div>
    {hasMore && <button className='load-more' style={{ marginTop: '10px' }} onClick={() => setPage(page => page + 1)}>Load More</button>}
  </div>
}
