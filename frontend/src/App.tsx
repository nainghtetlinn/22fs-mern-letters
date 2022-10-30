import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CssBaseline } from '@mui/material';

import { AppDispatch, RootState } from './app/store';
import { showMessage } from './features/alert/alertSlice';
import { loginWithToken } from './features/auth/authSlice';

import PrivateRoute from './utils/PrivateRoute';
import { Home, Login, SignUp, Profile } from './pages';
import Layout from './components/layout/Layout';
import Loading from './components/UI/Loading';
import AlertMessage from './components/UI/AlertMessage';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token, userId, isLoading, isSuccess, isError, msg } = useSelector(
    (store: RootState) => store.auth
  );

  useEffect(() => {
    if (token && !userId) {
      dispatch(loginWithToken());
    }
  }, [token, userId, dispatch]);

  useEffect(() => {
    if (isSuccess && userId) {
      navigate('/');
    }
  }, [userId, isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
      dispatch(showMessage({ type: 'error', msg }));
    }
  }, [isError, msg, dispatch, navigate]);

  return (
    <>
      <CssBaseline />
      {isLoading && <Loading />}
      <AlertMessage />
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PrivateRoute isLoggedIn={Boolean(token)} />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile/:id' element={<Profile />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
