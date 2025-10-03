import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// ----------------------------------------------------------------------
// import copy from 'copy-to-clipboard';
// import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { varHover } from '../animate';

export default function TablePaginationCustom({
  hostname,
  onChangeDense,
  rowsPerPageOptions = [10, 20, 30],
  sx,
  ...other
}) {
  // const { enqueueSnackbar } = useSnackbar();

  const handleClickCopy = () => {
    // copy(hostname);
    // enqueueSnackbar('Sao chép ip server thành công', { variant: 'success' });
  };

  const handleChangePage = (e, page) => {
    other.onPageChange(e, page - 1);
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: 'transparent',

          '& p': {
            fontWeight: 'bold',
          },
          '& .MuiSelect-select': {
            fontWeight: 'bold',
          },
          '& .MuiTablePagination-actions': {
            display: 'none',
          },

          '& .MuiTablePagination-displayedRows': {
            pr: 4,
          },
          '& .MuiTablePagination-spacer': {
            flex: "unset"
          },
        }}
      />
      <Pagination
        sx={{
          pl: hostname ? 30 : 3,
          py: 1.5,
          top: '50%',
          right: 20,
          transform: 'translateY(-50%)',
          position: {
            sm: 'absolute',
          },
          zIndex: 10,
          '& button': {
            fontWeight: 'bold',
          },
        }}
        count={Math.ceil(other.count / other.rowsPerPage)}
        page={other.page + 1}
        onChange={handleChangePage}
      />
      {hostname && (
        <Typography
          variant="body2"
          sx={{
            pl: 4,
            py: 1.5,
            top: '50%',
            transform: 'translateY(-50%)',
            position: {
              sm: 'absolute',
            },
            zIndex: 10,
            fontWeight: 'bold',
          }}
        >
          IP Server: {hostname}
          <Tooltip title="Sao chép" placement="top" arrow>
            <IconButton
              component={m.button}
              variants={varHover(1.2)}
              whileTap="tap"
              whileHover="hover"
              onClick={handleClickCopy}
            >
              {/* <ContentCopyIcon fontSize="small" /> */}
            </IconButton>
          </Tooltip>
        </Typography>
      )}
    </Box>
  );
}

TablePaginationCustom.propTypes = {
  onChangeDense: PropTypes.func,
  hostname: PropTypes.string,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  // sx: PropTypes.object,
};
