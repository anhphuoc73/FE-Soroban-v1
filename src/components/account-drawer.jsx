import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks/index';
import { varAlpha } from 'src/theme/styles/index';
import { Label } from 'src/components/label/index';
import { Iconify } from 'src/components/iconify/index';
import { Scrollbar } from 'src/components/scrollbar/index';
import { AnimateAvatar } from 'src/components/animate/index';
import { useMockedUser } from 'src/auth/hooks/index';
import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import { getProfileFromLS } from '../utils/auth';
import ChangePasswordModal from './math/change-password-modal';

// ----------------------------------------------------------------------

export function AccountDrawer({ data = [], sx, ...other }) {
  const theme = useTheme();

  const router = useRouter();

  const pathname = usePathname();

  const { user } = useMockedUser();

  const [open, setOpen] = useState(false);

  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: { src: user?.photoURL, alt: user?.displayName },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {user?.displayName?.charAt(0).toUpperCase()}
    </AnimateAvatar>
  );

  const profileLocalStorage = getProfileFromLS()
  
  return (
    <>
      <AccountButton
        onClick={handleOpenDrawer}
        photoURL={user?.photoURL}
        displayName={user?.displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, textTransform: 'uppercase' }} noWrap>
              {profileLocalStorage?.fullname}
            </Typography>
          </Stack>
          <Stack
            sx={{
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {data.map((option) => {
              const rootLabel = pathname.includes('/content') ? 'Home' : 'Dashboard';
              const rootHref = pathname.includes('/content') ? '/' : paths.content.root;

              const handleItemClick = () => {
                if (option.id === 2) {
                  // 👉 Ở đây bạn xử lý mở modal
                  setOpenChangePasswordModal(true);
                  handleCloseDrawer(); // đóng drawer nếu muốn
                } else {
                  handleClickItem(option.label === 'Home' ? rootHref : option.href);
                }
              };

              return (
                <MenuItem
                  key={option.id}
                  onClick={handleItemClick}
                  sx={{
                    py: 1,
                    color: 'text.secondary',
                    '& svg': { width: 24, height: 24 },
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  {option.icon}

                  <Box component="span" sx={{ ml: 2 }}>
                    {option.label === 'Home' ? rootLabel : option.label}
                  </Box>

                  {option.info && (
                    <Label color="error" sx={{ ml: 1 }}>
                      {option.info}
                    </Label>
                  )}
                </MenuItem>
              );
            })}

          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
      <ChangePasswordModal
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
      />
    </>
  );
}
