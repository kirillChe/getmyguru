import React from 'react';
import { IconButton, Avatar, MenuItem, Menu, Fade } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import {withRouter} from "react-router-dom";

import { MainContext } from '../context';

class ProfileMenu extends React.Component {
    static contextType = MainContext;

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleProfile = event => {
        event.preventDefault();
        console.log('Go to profile');
        // return <Redirect to='/profile' />
        this.props.history.push(`/profile/${this.context.user.id}`);
        this.setState({ anchorEl: null });
    };

    handleMain = event => {
        event.preventDefault();
        console.log('Go to main page');
        this.props.history.push('/');
        this.setState({ anchorEl: null });
    };

    handleLogout = event => {
        event.preventDefault();
        console.log('logging out');
        axios.post('/auth/logout').then(response => {
            console.log(response.data);
            if (response.status === 200) {
                this.context.updateUser({
                    loggedIn: false,
                    user: {}
                })
            }
            this.props.history.push('/');
        }).catch(error => {
            console.log('Logout error');
            console.log('ProfileMenu.component.js :43', error);
        })
    };

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const { avatarLocation } = this.context.user;

        return (
            <React.Fragment>
                <IconButton
                    aria-owns={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    {avatarLocation ? (
                        <Avatar alt="avatar" src={avatarLocation} />
                    ) : (
                        <AccountIcon />
                    )}
                </IconButton>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={this.handleMain}>Main Page</MenuItem>
                    <MenuItem onClick={this.handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My messages</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
            </React.Fragment>
        );
    }
}

export default withRouter(ProfileMenu);