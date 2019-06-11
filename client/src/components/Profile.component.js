import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiTab from '@material-ui/core/Tab';
import MuiTabs from '@material-ui/core/Tabs';
import MuiAvatar from '@material-ui/core/Avatar';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Grid,
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Slide
} from '@material-ui/core';
import {Comment, PhotoLibrary} from '@material-ui/icons';
import { MainContext } from '../context';

import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from "socket.io-client";
import {MessageInput, Comments} from ".";

const styles = theme => ({
    editButton: {
        marginLeft: 10,
        marginTop: 0,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '100%', // 16:9
    },
    tabsRoot: {
        borderTop: '1px solid #efefef',
    },
    tabsIndicator: {
        height: 1,
        transform: 'translateY(-53px)',
        backgroundColor: '#262626',
    },
    fixed: {
        overflowX: 'visible',
    },
    labelIcon: {
        minHeight: null,
        paddingTop: null,
        '& $wrapper :first-child': {
            fontSize: 16,
            marginBottom: 0,
            marginRight: 6,
        },
    },
    textColorInherit: {
        color: '#999',
    },
    selected: {
        color: '#262626'
    },
    wrapper: {
        flexDirection: 'row',
    },
    tabRoot: {
        minHeight: 54,
        fontWeight: 600,
        minWidth: 0,
        [theme.breakpoints.up('md')]: {
            minWidth: 0,
        },
    },
    avatar: {
        width: 152,
        height: 152,
    },
});

class Transition extends React.Component {
    render() {
        let props = this.props;
        return <Slide direction="down" {...props} />;
    }
}

const Profile = (props) => {
    const [showMessageInput, setShowMessageInput] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [profile, setProfile] = useState({});
    const [avatarLocation, setAvatarLocation] = useState(null);
    const { defaultUserAvatar, user } = useContext(MainContext);
    const {classes} = props;
    // "/account/profile/{profileId}"
    const profileId = R.split('/', window.location.pathname)[3];

    function handleSubmitInput (text) {
        const socket = socketIOClient('/');
        let data = {
            senderId: user.id,
            receiverId: profileId,
            text
        };
        socket.emit('NEW_MESSAGE', data);
        setShowMessageInput(false);
    }


    useEffect(() => {
        async function getProfile(id) {
            const response = await axios.get(`/api/users/userProfile/${id}`);
            setProfile(response.data);
            setAvatarLocation(response.data.avatarLocation || defaultUserAvatar[response.data.gender]);
        }

        getProfile(profileId);
    }, [profileId, defaultUserAvatar]);

    return (
        <React.Fragment>
            <Box component="main" maxWidth={935} margin="auto" padding="60px 20px 0">
                <Box mb="44px">
                    <Grid container>
                        <Grid item xs={4}>
                            <MuiAvatar
                                className={classes.avatar}
                                alt="My profile"
                                src={avatarLocation}
                                style={{ margin: 'auto' }}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Box clone mb="20px">
                                <Grid container alignItems="center">
                                    <Typography component="h1" variant="h4" ightweight="true">
                                        {profile.firstName} {profile.lastName}
                                    </Typography>
                                    {user.id === profile.id &&
                                        <Button className={classes.editButton} variant="outlined" href={`/account/profile/${user.id}/edit`}>
                                            Edit Profile
                                        </Button>
                                    }
                                    {user.id !== profile.id &&
                                        <Button className={classes.editButton} variant="outlined" onClick={() => setShowMessageInput(true)}>
                                            Send Message
                                        </Button>
                                    }
                                </Grid>
                            </Box>
                            <Dialog
                                open={showMessageInput}
                                TransitionComponent={Transition}
                                onClose={() => setShowMessageInput(false)}
                                aria-labelledby="responsive-dialog-title"
                                className={classes.dialog}
                            >
                                <DialogContent className={classes.content}>
                                    <Typography variant="h5">
                                        New message for {profile.firstName} {profile.lastName}
                                    </Typography>
                                    <MessageInput
                                        onSubmit={handleSubmitInput}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Box mb="20px">
                                <Grid container spacing={5}>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>{profile.rating}</b> rating
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>325</b> raters
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
                </Box>
                <MuiTabs
                    value={tabIndex}
                    centered
                    onChange={(event, value) => {
                        setTabIndex(value);
                    }}
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, fixed: classes.fixed }}
                >
                    <MuiTab
                        label="Photos"
                        icon={<PhotoLibrary />}
                        classes={{ selected: classes.selected, root: classes.tabRoot, labelIcon: classes.labelIcon, textColorInherit: classes.textColorInherit, wrapper: classes.wrapper }}
                    />
                    <MuiTab
                        label="Comments"
                        icon={<Comment />}
                        classes={{ selected: classes.selected, root: classes.tabRoot, labelIcon: classes.labelIcon, textColorInherit: classes.textColorInherit, wrapper: classes.wrapper }}
                    />
                </MuiTabs>
                {tabIndex === 0 &&
                    <Grid container spacing={4}>
                        {profile.images && profile.images.map(image => (
                            <Grid item key={image} xs={4}>
                                <Card className={classes.card}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={image}
                                        />
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                }
                {tabIndex === 1 &&
                    <Grid container spacing={4}>
                        <Comments />
                    </Grid>
                }
            </Box>
        </React.Fragment>
    );
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);