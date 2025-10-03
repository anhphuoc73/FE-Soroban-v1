import { useState } from 'react';
// ----------------------------------------------------------------------

import Stack from '@mui/material/Stack';
import { viVN } from '@mui/x-data-grid/locales';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';

import { GridSkeleton } from 'src/components/data-grid';
import { EmptyContent } from 'src/components/empty-content';

const HIDE_COLUMNS = {
  category: false,
};
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

export const Table = ({ rows, columns, loading, onRowClick, ...rest }) => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DataGrid
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      getRowHeight={() => 'auto'}
      pageSizeOptions={[5, 10, 25]}
      localeText={{
        ...viVN.components.MuiDataGrid.defaultProps.localeText,
        toolbarColumns: '',
      }}
      onRowClick={onRowClick}
      sx={{
        '& .MuiDataGrid-toolbarContainer': {
          padding: '22px 18px',
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none',
        },
        '& .MuiDataGrid-virtualScroller': {
          overflowY: 'hidden',
        },

        

        '& .MuiDataGrid-columnHeader': {
          fontWeight: 'bold',
          color: 'black !important',
          fontSize: 14.5,
        },
        '& .MuiDataGrid-columnHeader[aria-colindex="1"] .MuiDataGrid-columnHeaderTitleContainer': {
          paddingLeft: '10px !important',
        },
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      hideFooterPagination
      slots={{
        toolbar: () => (
          <GridToolbarContainer sx={{ backgroundColor: 'white' }}>
            <Stack
              flexGrow={1}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ p: '18px' }}
            />
          </GridToolbarContainer>
        ),
        noRowsOverlay: () => <EmptyContent title="Không có dữ liệu" />,
        noResultsOverlay: () => <EmptyContent title="Không có dữ liệu" />,
        loadingOverlay: GridSkeleton,
      }}
      slotProps={{
        columnsPanel: {
          getTogglableColumns,
        },
      }}
      {...rest}
    />
  );
};
