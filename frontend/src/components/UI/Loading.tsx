import { LinearProgress, styled } from '@mui/material';

const BackdropBox = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10000,
  backgroundColor: '#09090980',
}));

const Loading = () => {
  return (
    <BackdropBox>
      <LinearProgress />
    </BackdropBox>
  );
};

export default Loading;
