import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import FilterTicket from '../views/filter-ticket';
import { TableToolbar } from '../../../components/table/index';
import { Icon, ICON_NAME } from '../../../components/svg-color/index';
import { debounce } from '@mui/material/utils';


export default function SearchToolBar({ filters,setDefaultValue,onFilters }) {

  const [openFilter, setOpenFilter] = useState(false);

  const toggleDrawer = () => {
    setOpenFilter((value) => !value);
  };

  const actionButtonList = [
    {
      id: 1,
      label: 'Thêm quyền',
      icon: <Icon name={ICON_NAME.add} sx={{ width: '16px !important' }} />,
    },
  ];
  const actionButton = {
    1: ()=>{},
  };
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0}
        sx={{ width: 400 }}
      >
        <Icon
          name={ICON_NAME.filter}
          sx={{ display: 'flex', alignItems: 'center', width: '18px',marginLeft: "40px",cursor: 'pointer' }}
          onClick={toggleDrawer}
        />
        <TableToolbar
          filters={filters}
          onFilters={onFilters}
          actionButtonList={actionButtonList}
          actionButton={actionButton}
        />
      </Stack>
      <FilterTicket onClickToggle={toggleDrawer} open={openFilter} setDefaultValue={setDefaultValue} />
    </Stack>
  );
}

SearchToolBar.propTypes = {
  filters: PropTypes.string,
  setDefaultValue: PropTypes.func,
  onFilters : PropTypes.func,
};
