import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CssBaseline } from '@mui/material';

import { AppDispatch, RootState } from './app/store';
import { showMessage } from './features/alert/alertSlice';
import { loginWithToken } from './features/auth/authSlice';

import { Home, Login, SignUp, Profile, Search } from './pages';
import Layout from './components/layout/Layout';
import Loading from './components/UI/Loading';
import AlertMessage from './components/UI/AlertMessage';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token, userId, isLoading, isError, msg } = useSelector(
    (store: RootState) => store.auth
  );

  useEffect(() => {
    if (token && !userId) {
      dispatch(loginWithToken());
    }
  }, [token, userId, dispatch]);

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
        <Route path='/' element={<Layout />}>
          <Route index element={token ? <Home /> : <Login />} />
          <Route
            path='/profile/:id'
            element={token ? <Profile /> : <Navigate to='/login' />}
          />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>
        <Route
          path='/search'
          element={token ? <Search /> : <Navigate to='/login' />}
        />
      </Routes>
    </>
  );
}

export default App;
