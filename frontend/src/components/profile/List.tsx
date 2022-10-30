import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
  Avatar,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useNavigate } from 'react-router-dom';

const Btn = styled('button')({
  background: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0',
  fontSize: '16px',
});

type Props = { open: boolean; close: () => void; title: string; lists: any[] };

const List = ({ open, close, title, lists }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth='xs'
        PaperProps={{ sx: { margin: 1, width: '100%' } }}
      >
        <DialogTitle>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6' textTransform='capitalize'>
              {title}
            </Typography>
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ overflowY: 'scroll', maxHeight: '300px' }}>
          {lists.length === 0 && <div>No {title} found</div>}
          <Stack spacing={1.5}>
            {lists.length > 0 &&
              lists.map(item => (
                <Stack
                  key={item._id}
                  direction='row'
                  alignItems='center'
                  spacing={2}
                >
                  <Box>
                    <Avatar />
                  </Box>
                  <Btn
                    onClick={() => {
                      navigate(`/profile/${item._id}`);
                      close();
                    }}
                  >
                    {item.name}
                  </Btn>
                </Stack>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default List;
