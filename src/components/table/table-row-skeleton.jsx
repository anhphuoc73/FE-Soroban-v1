import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';

export default function TableRowSkeleton({ rowNumber }) {
  return (
    <TableRow>
      {Array(rowNumber)
        .fill(0)
        .map((_, index) => (
          <TableCell
            key={index}
            align="center"
            sx={{ paddingLeft: index === 0 ? 2 : 0, paddingRight: index === rowNumber-1 ? 2 : 0 }}
          >
            <Skeleton animation="wave" variant="rectangular" height={40} />
          </TableCell>
        ))}
    </TableRow>
  );
}

TableRowSkeleton.propTypes = {
  rowNumber: PropTypes.number.isRequired,
};
