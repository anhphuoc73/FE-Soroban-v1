import * as React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { Icon, ICON_NAME } from '../../../components/svg-color/index';
import Tooltip from '@mui/material/Tooltip';


// ----------------------------------------------------------------------
export function RenderCellTitle({ title }) {
  return (
    <Tooltip title={title} placement="top" arrow>
      <Typography
        sx={{
          fontSize: 14,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          display: 'block',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          fontWeight: 500,
          py: 2,
        }}
      >
        {title}
      </Typography>
    </Tooltip>
  );
}
export function RenderCellIconTitle({ title, level }) {
  let iconProps = {};

  switch (level) {
    case "low":
      iconProps = {
        name: ICON_NAME.ticketLow,
        sx: { display: "flex", alignItems: "center", mr: 1, width: "18px", backgroundColor: "#63B8FF" }
      };
      break;
    case "medium":
      iconProps = {
        name: ICON_NAME.ticketMedium,
        sx: { display: "flex", alignItems: "center", mr: 1, width: "18px", backgroundColor: "#d0af12" }
      };
      break;
    case "hight":
      iconProps = {
        name: ICON_NAME.ticketHigh,
        sx: { display: "flex", alignItems: "center", mr: 1, width: "18px", backgroundColor: "#FF6A6A" }
      };
      break;
    default:
      iconProps = {
        name: ICON_NAME.ticketLow,
        sx: { display: "flex", alignItems: "center", mr: 1, width: "18px", backgroundColor: "#63B8FF" }
      };
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Icon {...iconProps} />
      <Typography sx={{ py: 2, fontSize: 14 }}>{title}</Typography>
    </div>
  );
}
export function RenderCellTitleDateTime({ title }) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  };
  return <Typography sx={{ py: 2, fontSize: 14 }}>{formatDate(title)}</Typography>;
}
export  function  RenderStatusTitle({disposition}){
  let status = "";
  let statusStyle = {};

  if (disposition === "new") {
    status = "Mới tạo";
    statusStyle = { color: '#118D57', backgroundColor: 'rgba(34, 197, 94, 0.16)', borderRadius: '8px', padding: '5px 8px', };
  } else if (disposition === "success") {
    status = "Hoàn thành";
    statusStyle = { color: '#3366FF', backgroundColor: '#007AFF29', borderRadius: '8px', padding: '5px 8px' };
  } else if (disposition === "process") {
    status = "Đang xử lý";
    statusStyle = { color: '#FF9500', backgroundColor: '#FF950029', borderRadius: '8px', padding: '5px 8px' };
  } else if (disposition === "expired") {
    status = "Quá hạn";
    statusStyle = { color: '#EF4137', backgroundColor: '#ffbbb4', borderRadius: '8px', padding: '5px 8px' };
  }
  return (
    <Typography sx={{ py: 2, fontSize: 14, }}>
      <span style={statusStyle}>{status}</span>
    </Typography>
  );
}
RenderCellTitle.propTypes = {
  title: PropTypes.string,
};
RenderCellIconTitle.propTypes = {
  title: PropTypes.string,
  level: PropTypes.string,
};
RenderCellTitleDateTime.propTypes = {
  title: PropTypes.string,
};
RenderStatusTitle.propTypes = {
  disposition: PropTypes.string,
};
