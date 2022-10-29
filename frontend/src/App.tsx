import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CssBaseline } from '@mui/material';

import { RootState, AppDispatch } from './app/store';
import { showMessage } from './features/alert/alertSlice';
import { loginWithToken } from './features/auth/authSlice';
import { Home, Login, SignUp, Search } from './pages';
import Layout from './components/layout/Layout';
import Loading from './components/UI/Loading';
import AlertMessage from './components/UI/AlertMessage';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isError, isLoading, msg } = useSelector(
    (store: RootState) => store.auth
  );

  useEffect(() => {
    if (user && !user.name) {
      dispatch(loginWithToken());
    }
  }, [dispatch, user]);

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
          <Route index element={user ? <Home /> : <Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>
        <Route path='search' element={<Search />} />
      </Routes>
    </>
  );
}

export default App;
