import { Skeleton, Box } from '@mui/material';

const LoadingComment = () => {
  return (
    <>
      <Box sx={{ display: 'flex', width: '100%', margin: '0 0 8px' }}>
        <Box sx={{ marginRight: 2 }}>
          <Skeleton variant='circular' width='40px' height='40px' />
        </Box>
        <Box
          sx={{
            backgroundColor: '#eeeeee',
            padding: '2px 8px',
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Skeleton variant='text' width={120} />
          <Skeleton variant='rounded' height={80} width='100%' />
        </Box>
      </Box>
    </>
  );
};

export default LoadingComment;
