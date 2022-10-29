import { CircularProgress, Paper, CardContent } from '@mui/material';

const LoadingCircularCard = () => {
  return (
    <Paper>
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </CardContent>
    </Paper>
  );
};

export default LoadingCircularCard;
