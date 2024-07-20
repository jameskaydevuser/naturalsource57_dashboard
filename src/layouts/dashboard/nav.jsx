import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import { AuthContext } from 'src/contexts/Auth';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export default function Nav({ openNav, onCloseNav }) {
  const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  );
  
  const pathname = usePathname();

  const user = useContext(AuthContext);

  const upLg = useResponsive('up', 'lg');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
      if (openNav) {
          onCloseNav();
      }
      // Fetch navigation config asynchronously
      navConfig().then(data => {
          setMenuItems(data);
      }).catch(error => {
          console.error("Failed to load navigation items:", error);
      });
  }, [openNav, onCloseNav]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar
        src="https://p7.hiclipart.com/preview/989/486/516/user-profile-computer-icons-login-database-github-thumbnail.jpg"
        alt="photoURL"
      />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{user && user.display_name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Admin
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {/* {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))} */}
      {/* <NavItem */}
      <ListItemButton
        component={RouterLink}
        href="/users"
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
        }}
      >
        {/* <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <SvgColor src={`/assets/icons/navbar/ic_users.svg`} sx={{ width: 1, height: 1 }} />
        </Box> */}

        <Box component="span">Users </Box>
      </ListItemButton>
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <img src="./assets/logo.svg" style={{ width: 200, marginTop: 24, marginLeft: 32 }} />

      {renderAccount}

      {/* {renderMenu} */}
      <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {menuItems.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
      {/* <NavItem path='/users' title='Users' />
      <NavItem path='/orders' title='Orders' />
      <NavItem path='/products?cat=xGa0maZtHz6kIwefCQFn' title='Category 1' />
      <NavItem path='/products?cat=gkF1xs9wzrvhQnlxlM2b' title='Category 2' />
      <NavItem path='/products?cat=QCsxmPtXtUhQLjIoSIfG' title='Category 3' /> */}

    </Stack>

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

// NavItem.propTypes = {
//   item: PropTypes.object,
// };
