import {
  Skeleton,
  Paper,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';

const LoadingPost = () => {
  return (
    <>
      <Paper>
        <CardHeader
          avatar={<Skeleton variant='circular' width='40px' height='40px' />}
          title={<Skeleton variant='text' />}
          subheader={<Skeleton variant='text' height='12px' width='100px' />}
        />
        <Divider />
        <CardContent>
          <Skeleton variant='rectangular' width='100%' height='80px' />
        </CardContent>
        <CardActions></CardActions>
      </Paper>
    </>
  );
};

export default LoadingPost;
