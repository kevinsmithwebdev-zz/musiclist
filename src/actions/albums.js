import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action Creators
export const albumAddFailure = error => ({ type: 'MUSIC_ALBUM_ADD_FAILURE', error });
export const albumAddSuccess = json => ({ type: 'MUSIC_ALBUM_ADD_SUCCESS', json });
export const albumSearchClear = () => ({ type: 'MUSIC_ALBUM_SEARCH_CLEAR' });
export const albumSearchFailure = error => ({ type: 'MUSIC_ALBUM_SEARCH_FAILURE', error });
export const albumSearchSuccess = json => ({ type: 'MUSIC_ALBUM_SEARCH_SUCCESS', json });
export const albumsPopulateFailure = error => ({ type: 'MUSIC_ALBUMS_POPULATE_FAILURE', error });
export const albumsPopulateSuccess = json => ({ type: 'MUSIC_ALBUMS_POPULATE_SUCCESS', json });

// Add an Album
export function addAlbum(id) {
  return async (dispatch) => {
    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // Send packet to our API, which will communicate with Discogs
    await fetch(
      // where to contact
      '/api/albums/add',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.email) {
        return dispatch(albumAddSuccess(json));
      }
      return dispatch(albumAddFailure(new Error(json)));
    })
    .catch(error => dispatch(albumAddFailure(new Error(error))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// Populate Album data
export function populateAlbums(albums) {
  return async (dispatch) => {
    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // Hit the API
    await fetch(
      '/api/albums/populate',
      {
        method: 'POST',
        body: JSON.stringify(albums),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (!json.error) {
        return dispatch(albumsPopulateSuccess(json));
      }
      return dispatch(albumsPopulateFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumsPopulateFailure(new Error(error))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}

// Search Albums
export function searchAlbums(searchText) {
  return async (dispatch) => {
    // clear the error box if it's displayed
    dispatch(clearError());

    // turn on spinner
    dispatch(incrementProgress());

    // Build packet to send to Discogs API
    const searchQuery = {
      q: searchText,
      type: 'master',
      format: 'album',
    };

    // Send packet to our API, which will communicate with Discogs
    await fetch(
      // where to contact
      '/api/albums/search',
      // what to send
      {
        method: 'POST',
        body: JSON.stringify(searchQuery),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      },
    )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((json) => {
      if (json.results) {
        return dispatch(albumSearchSuccess(json));
      }
      return dispatch(albumSearchFailure(new Error(json.error)));
    })
    .catch(error => dispatch(albumSearchFailure(new Error(error))));

    // turn off spinner
    return dispatch(decrementProgress());
  };
}