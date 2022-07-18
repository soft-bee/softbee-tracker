import React from 'react';

import {
  Box,
  IconButton,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { NavButton } from './NavButton';

type HeaderAvatarProps = {
  anchorElUser: null | HTMLElement;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
};

const menuItems = [
  { name: 'Profile', href: '/profile' },
  { name: 'Logout', href: '/logout' },
];

export const HeaderAvatar = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
}: HeaderAvatarProps) => {
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            ml: '30px',
            maxWidth: '40px',
            maxHeight: '40px',
          }}
        >
          <Avatar
            alt="User avatar"
            src="https://i.pravatar.cc/300
"
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.name} onClick={handleCloseUserMenu}>
            <NavButton page={item} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
