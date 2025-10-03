import { m } from 'framer-motion';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { debounce } from '@mui/material/utils';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { varHover } from 'src/components/animate';
import { Icon, ICON_NAME } from 'src/components/svg-color';

export function TableToolbar({
  onFilters,
  actionButton,
  isFilter,
  actionButtonList,
  onClickFilter,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFilterName = debounce(
    useCallback(
      (event) => {
        onFilters(event.target.value);
      },
      [onFilters]
    ),
    500
  );

  const handleClickActionButton = (id) => () => actionButton[id]();

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        px: '18px',
        position: 'absolute',
        zIndex: 11,
        top: '20px',
        width: '100% !important',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ width: '100% !important' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isFilter && (
            <Tooltip title="Bộ lọc" placement="top" arrow>
              <IconButton
                component={m.button}
                variants={varHover(1.2)}
                whileTap="tap"
                whileHover="hover"
                onMouseUp={onClickFilter}
              >
                <Icon
                  name={ICON_NAME.filter}
                  sx={{ display: 'flex', alignItems: 'center', width: '20px', flexShrink: 0 }}
                />
              </IconButton>
            </Tooltip>
          )}

          <m.div
            animate={{ width: isFocused ? 350 : 180 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', display: 'inline-block' }}
          >
            <TextField
              sx={{
                '& input': {
                  padding: '10.5px 0px',
                },
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => !e.target.value && setIsFocused(false)}
              fullWidth
              onChange={handleFilterName}
              placeholder="Tìm kiếm"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon
                      name={ICON_NAME.search}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mr: 1,
                        width: '18px !important',
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </m.div>
        </Box>

        <Stack direction={{ xs: 'row' }} alignItems="center" justifyContent="center" spacing={2}>
          {actionButtonList.map((button) => (
            <Button
              onClick={handleClickActionButton(button.id)}
              variant="contained"
              color="primary"
              key={button.id}
              startIcon={button.icon}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
