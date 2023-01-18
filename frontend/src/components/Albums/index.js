import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as albumActions from "../../store/album";
import { ConfirmModal } from '../ConfirmModal';
import OpenModalButton from '../OpenModalButton';
import CreateAlbumModal from './CreateAlbumModal';
import './style.css'

export default function Albums() {
  const dispatch = useDispatch();
  const albums = useSelector(state => state.album.albums);
  const sessionUser = useSelector(state => state.session.user);
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(albumActions.getAlbumsOfCurrentUser())
  }, [dispatch, page])

  const visibleAlbums = albums?.slice(0, page * albumActions.PAGE_SIZE)
  const hasMore = page * albumActions.PAGE_SIZE < albums?.length

  const confirmDelete = (id) => {
    dispatch(albumActions.deleteAlbum(id)).then(() => {
      setPage(1)
      dispatch(albumActions.getAlbumsOfCurrentUser())
    })
  }

  return sessionUser && <div className='panel main'>
    <div className='title'>
      <span className='text'>Your Albums</span>
      <OpenModalButton
        className='general-button'
        buttonText="Create Album"
        modalComponent={<CreateAlbumModal onClose={() => { setPage(1) }} />} />
    </div>
    {albums !== null && <><div className='grid'>
      {
        visibleAlbums.map(album => {
          return <div className='item' key={album.id}>
            <div className='image-wrapper' onClick={() => window.location = `/albums/${album.id}`}>
              <div className='mask'>View</div>
              <img src={album.imageUrl} alt={album.title} />
            </div>
            <div className='text'>{album.title}</div>
            <div className='text muted'>{album.description}</div>
            <div className='actions'>
              <OpenModalButton
                className='general-button small'
                buttonText="Edit"
                modalComponent={<CreateAlbumModal album={album} edit onClose={() => { setPage(1) }} />} />
              <OpenModalButton
                className='general-button small'
                buttonText="Delete"
                modalComponent={<ConfirmModal hint={`Are you sure to delete album ${album.title} ?`}
                  onConfirm={() => confirmDelete(album.id)} />} />
            </div>
          </div>
        })
      }
    </div>
      {hasMore && <button className='load-more' style={{ marginTop: '10px' }} onClick={() => setPage(page => page + 1)}>Load More</button>}
    </>
    }
  </div>
}