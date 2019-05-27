/* eslint-disable */
import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
import {Button, Avatar, Typography, Grid, Divider, Box } from '@material-ui/core';
import { MainContext } from '../context';

const styles = {
    editButton: {
        marginLeft: 0,
        marginTop: 12,
    },
    divider: {
        marginTop: 12,
    }
};

export default function Profile() {
    // const [tabIndex, setTabIndex] = React.useState(0);
    const { defaultUserAvatar, user } = React.useContext(MainContext);
    const classes = styles;

    console.log('___________________');
    console.log('___________________');
    console.log(user);
    console.log('___________________');
    console.log('___________________');

    let states = {
        avatarLocation: user.avatarLocation || (user.gender === 'male' ? defaultUserAvatar.male : defaultUserAvatar.female),
    };

    return (
        <React.Fragment>
            <Box component="main" maxWidth={935} margin="auto" padding="60px 20px 0">
                <Box mb="44px">
                    <Grid container>
                        <Grid item xs={4}>
                            <Avatar
                                alt="My profile"
                                src={states.avatarLocation}
                                style={{ margin: 'auto' }}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Box clone mb="20px">
                                <Grid container alignItems="center">
                                    <Typography component="h1" variant="h4" ightweight="true">
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Button variant="outlined" href={`/profile/${user.id}/edit`} >
                                        Edit Profile
                                    </Button>
                                </Grid>
                            </Box>
                            <Box mb="20px">
                                <Grid container spacing={5}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>132</b> posts
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>325</b> followers
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>260</b> following
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Typography variant="body1" bold="true">
                                Siriwat Kunaporn
                            </Typography>
                            <Typography variant="body1">Bangkok Christian College</Typography>
                            <Typography variant="body1">{user.phone}</Typography>
                        </Grid>
                    </Grid>
                <Divider />
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <img
                            alt="post"
                            style={{ width: '100%' }}
                            src="https://via.placeholder.com/500/f5f5f5"
                        />
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
}