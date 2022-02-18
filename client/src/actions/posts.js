import * as api from '../api/index.js';

//action creaters
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    dispatch({ type: 'FETCH_ALL', payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: 'CREATE', payload: data });
  } catch (e) {
    console.log(e.message);
  }
};

export const updatePost = (post, id) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(post, id);
    dispatch({ type: 'UPDATE', payload: data });
  } catch (e) {
    console.log(e.message);
  }
};
