import React from 'react';
import { Modal, Box, Typography } from '@mui/material';

// eslint-disable-next-line arrow-body-style
const SimpleModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6">Modal Title</Typography>
        <Typography variant="body2">This is a simple modal.</Typography>
      </Box>
    </Modal>
  );
};

export default SimpleModal;