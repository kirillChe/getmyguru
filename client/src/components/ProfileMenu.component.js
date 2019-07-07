import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Avatar, MenuItem, Menu, Fade } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { withSnackbar } from 'notistack';

import { MainContext } from 'context';
import { useIntl } from 'hooks';
import messages from './ProfileMenu.messages';

const ProfileMenu = (props) => {
    const { formatMessage } = useIntl();
    const [anchorEl, setAnchorEl] = useState(null);
    const { updateMainState, user } = useContext(MainContext);

    function handleClick (event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose () {
        setAnchorEl(null);
    }

    function handleMessages () {
        // event.preventDefault();
        console.log('Go to my messages');
        props.history.push(`/account/messages/${user.id}`);
        setAnchorEl(null);
    }

    function handleProfile (event) {
        // event.preventDefault();
        console.log('Go to profile');
        props.history.push(`/account/profile/${user.id}`);
        setAnchorEl(null);
    }

    function handleMain (event) {
        // event.preventDefault();
        console.log('Go to main page');
        props.history.push('/');
        setAnchorEl(null);
    }

    async function handleLogout (event) {
        // event.preventDefault();
        console.log('logging out');
        try {
            let response = await axios.post('/auth/logout');

            if (response.status === 200) {
                updateMainState({
                    loggedIn: false,
                    user: {}
                });

                props.history.push('/');
            } else {
                props.enqueueSnackbar(formatMessage(messages.logoutError), { variant: 'error' });
            }
        } catch (e) {
            props.enqueueSnackbar(formatMessage(messages.logoutError), { variant: 'error' });
            console.log('Logout error: ', e);
        }
    }

    return (
        <React.Fragment>
            <IconButton
                aria-owns={Boolean(anchorEl) ? 'fade-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                {user.avatarLocation ? (
                    <Avatar alt="avatar" src={user.avatarLocation} />
                ) : (
                    <AccountIcon />
                )}
            </IconButton>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleMain}>{formatMessage(messages.main)}</MenuItem>
                <MenuItem onClick={handleProfile}>{formatMessage(messages.profile)}</MenuItem>
                <MenuItem onClick={handleMessages}>{formatMessage(messages.messages)}</MenuItem>
                <MenuItem onClick={handleLogout}>{formatMessage(messages.logout)}</MenuItem>
            </Menu>
        </React.Fragment>
    );
};

ProfileMenu.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired
};

export default withRouter(withSnackbar(ProfileMenu));