import {
  TextField,
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  FormControl,
  OutlinedInput,
  FormHelperText,
  IconButton,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Joi from 'joi';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { RootState, AppDispatch } from '../app/store';
import { reset, signup } from '../features/auth/authSlice';

const formSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .min(5)
    .required(),
  confirmPassword: Joi.ref('password'),
});

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId, isSuccess, isError } = useSelector(
    (store: RootState) => store.auth
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({ name: '', text: '' });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (isError) {
      setFormData(prev => ({
        ...prev,
        email: '',
        password: '',
        confirmPassword: '',
      }));
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (isSuccess && userId) {
      navigate('/');
    }
  }, [userId, isSuccess, navigate]);

  const toggleShowPassword = () => setIsShowPassword(!isShowPassword);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { value, error } = formSchema.validate(formData);
    if (error) {
      const err = error as Joi.ValidationError;
      setError({
        name: err.details[0].path[0] as string,
        text: err.message,
      });
      return;
    }
    setError({ name: '', text: '' });
    dispatch(reset());
    dispatch(signup(value));
  };

  return (
    <>
      <Box
        component='section'
        sx={{
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper sx={{ padding: '1rem', width: '320px' }}>
          <Typography variant='h6' align='center' gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={onSubmit}>
            <Stack direction='column' alignItems='center' spacing={2}>
              <TextField
                name='name'
                label='Name'
                type='text'
                fullWidth
                value={formData.name}
                onChange={onChange}
                helperText={error.name === 'name' ? error.text : null}
                error={error.name === 'name'}
              />
              <TextField
                name='email'
                type='email'
                label='Email'
                fullWidth
                value={formData.email}
                onChange={onChange}
                helperText={error.name === 'email' ? error.text : null}
                error={error.name === 'email'}
              />
              <FormControl
                sx={{ width: '100%' }}
                error={error.name === 'password'}
                variant='outlined'
              >
                <InputLabel htmlFor='password'>Password</InputLabel>
                <OutlinedInput
                  id='password'
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={onChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={toggleShowPassword}
                        edge='end'
                      >
                        {isShowPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label='Password'
                />
                <FormHelperText>
                  {error.name === 'password' ? error.text : null}
                </FormHelperText>
              </FormControl>
              <TextField
                name='confirmPassword'
                type='password'
                label='Confirm password'
                fullWidth
                value={formData.confirmPassword}
                onChange={onChange}
                helperText={
                  error.name === 'confirmPassword'
                    ? '"Password" doesn\'t confirm'
                    : null
                }
                error={error.name === 'confirmPassword'}
              />
              <Box
                sx={{ display: 'flex', justifyContent: 'right', width: '100%' }}
              >
                <Button
                  type='submit'
                  sx={{ textTransform: 'capitalize' }}
                  disableElevation
                  variant='contained'
                >
                  Sign up
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};
