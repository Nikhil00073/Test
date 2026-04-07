import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  Box,
  Button
} from "@mui/material";
import { colorTheme } from "../../theme/color";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from '@mui/icons-material/Logout';
import { useOktaAuth } from '@okta/okta-react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getData } from "../../config/apiService";


const getUserSecurityProfile = () => {
  try {
    const data = localStorage.getItem('user-security-profile');
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const Header = ({ userInfo }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInitials, setUserInitials] = useState("");
  const [securityProfile, setSecurityProfile] = useState(getUserSecurityProfile());
  const hasFetchedProfile = useRef(false);
  // const { oktaAuth, authState } = useOktaAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    try {
      if (userInfo) {
        const firstName = userInfo?.FirstName?.split('');
        const lastName = userInfo?.LastName?.split('');
        if (firstName && lastName) {
          const initials = `${firstName[0]}${lastName[0]}`;
          setUserInitials(initials || 'JD');
        }
      } else {
        setUserInitials('JD');
      }
    } catch (error) {
      console.error('Error getting user initials:', error);
      setUserInitials('JD');
    }
  }, [userInfo]);

  // useEffect(() => {
  //   // Only fetch profile after login (when userInfo is available and authenticated)
  //   if (authState?.isAuthenticated && userInfo && !hasFetchedProfile.current) {
  //     hasFetchedProfile.current = true;
  //     let retriesCount = 0;
  //     const fetchProfile = async () => {
  //       try {
  //         const profile = await getData('/api/v2/user-security-profile', '');
  //         if (profile.data) {
  //           localStorage.setItem('user-security-profile', JSON.stringify(profile.data));
  //           setSecurityProfile(profile.data);
  //           if (profile.data.is_databricks_available === false && retriesCount < 3) {
  //             retriesCount += 1;
  //             setTimeout(fetchProfile, 60000);
  //           }
  //         }
  //       } catch {
  //         localStorage.removeItem('user-security-profile');
  //       }
  //     };
  //     fetchProfile();
  //   }
  //   // Reset flag on logout
  //   if (!authState?.isAuthenticated) {
  //     hasFetchedProfile.current = false;
  //     setSecurityProfile(null);
  //     localStorage.removeItem('user-security-profile');
  //   }
  // }, [authState?.isAuthenticated, userInfo]);
  const handleLogout = () => {
    localStorage.removeItem('user-security-profile');
    // oktaAuth.signOut();
  };
  return (
    <AppBar sx={{ position: "relative", zIndex: "9999", backgroundColor: colorTheme.whiteColor, boxShadow: 'none', width: 'auto' }}>
      <Toolbar
        sx={{
          justifyContent: "space-between", '@media (max-width: 992px)': {
            minHeight: '56px',
          }
        }}
      >

        {/* <Typography sx={{ fontSize: '12px', color: colorTheme.tertiary }} variant="body1">
          {securityProfile?.geography && securityProfile.geography !== 'Global' && securityProfile.geography !== '' && <> <WarningAmberIcon sx={{ color: colorTheme.warningColor, verticalAlign: 'middle', margin: '-1px 5px 0 0px', fontSize: '12px' }} />
            Answers may be limited by your Security Level: {securityProfile?.geographyGeography && "Geography"} ({securityProfile?.geography}) {securityProfile?.category && "and Category"} {securityProfile?.category && "("} {securityProfile?.category}{securityProfile?.category && ")"}
          </>}</Typography> */}
        <Typography sx={{ fontSize: '12px', color: colorTheme.tertiary }} variant="body1">
          <WarningAmberIcon sx={{ color: colorTheme.warningColor, verticalAlign: 'middle', margin: '-1px 5px 0 0px', fontSize: '12px' }} />
          Answers may be limited by your Security Level: {securityProfile?.geographyGeography && "Geography"} ({securityProfile?.geography}) {securityProfile?.category && "and Category"} {securityProfile?.category && "("} {securityProfile?.category}{securityProfile?.category && ")"}
        </Typography>
        <IconButton onClick={handleMenuClick} color="inherit" sx={{ padding: '0' }} data-testid='profile-icon'>
          {/* <AccountCircleOutlinedIcon sx={{ color: colorTheme.tertiary, fontSize: '33px' }} /> */}
          <Box sx={{
            backgroundColor: colorTheme.secondary, height: '40px', width: '40px',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: colorTheme.primary,
            fontWeight: '600', fontSize: '12px', border: '3px solid #fff', outline: `2px solid ${colorTheme.buttonColor}`
          }}>
            {userInitials}
          </Box>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            mt: "15px", '.MuiPaper-root': {
              maxHeight: 'none !important'
            }
          }}
          className="headerMenu"
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton onClick={handleMenuClose} sx={{ padding: '0', position: 'absolute', right: '15px' }} aria-label="close menu">
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: 'center', margin: '20px 0 10px', borderBottom: '1px solid #BFC6CE' }}>
              <Box sx={{
                backgroundColor: colorTheme.buttonColor, height: '42px', width: '42px',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: colorTheme.whiteColor,
                margin: '0 auto 5px'
              }}>
                {userInitials}
              </Box>
              <Typography variant="body1" sx={{ fontSize: '16px', marginBottom: '20px' }}>Hi, {userInfo?.FirstName}!</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', marginBottom: '20px', padding: '15px' }}>
              <Typography variant="body1" sx={{ fontSize: '14px', marginBottom: '20px' }}>Access Level</Typography>

              <Box sx={{ marginBottom: '20px' }}>{securityProfile?.geography && (
                <Typography variant="body1" sx={{ fontSize: '14px' }}>
                  <b>Geography</b>: {securityProfile.geography}
                </Typography>
              )}
                {securityProfile?.category && (
                  <Typography variant="body1" sx={{ fontSize: '14px' }}>
                    <b>Category</b>: {securityProfile.category}
                  </Typography>
                )}
              </Box>
              <Typography variant="body1" sx={{ fontSize: '14px', marginBottom: '20px', maxWidth: '300px' }}>The answers provided are limited by your access level - if you ask a broad question, the response will only be pulled from data within your level of access listed above.</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon sx={{ color: colorTheme.primary }} />}
              sx={{
                borderRadius: '25px', color: colorTheme.primary + '!important', backgroundColor: `${colorTheme.whiteColor} !important`, justifyContent: 'flex-start', border: 'none',
                padding: '12px 26px !important', width: '100%',
                "&:hover": {
                  border: 'none',
                  background: '#fff'
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
