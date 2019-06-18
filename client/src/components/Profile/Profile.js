import React, { useContext, useState } from 'react';
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
import Slider from '@material-ui/lab/Slider';
import {Comment, PhotoLibrary} from '@material-ui/icons';

import { MainContext } from 'context';
import { MessageInput } from 'components';
import { Comments } from 'components/Comments';
// import messages from './Profile.messages';

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
    noPhotos: {
        marginTop: 40,
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
    const { user, defaultUserAvatar } = useContext(MainContext);
    const [ rating, setRating ] = useState(8);
    const {
        classes,
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        handleSubmitInput,
        submitRateUser
    } = props;

    function onChangeRatingHandler(e, val) {
        setRating(val);
    }

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
                                        rows={3}
                                        rowsMax={8}
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
                                            <b>{profile.ratersCount}</b> raters
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            {user.id !== profile.id &&
                                <Box mb="20px">
                                    <Grid container spacing={5}>
                                        <Grid item xs={4}>
                                            <Slider
                                                defaultValue={rating}
                                                aria-label="discrete-slider"
                                                valueLabelDisplay="auto"
                                                min={1}
                                                max={10}
                                                onChangeCommitted={onChangeRatingHandler}
                                                marks
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button variant="outlined" onClick={submitRateUser(rating)}>
                                                Rate
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }
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
                    <div>
                        <Grid container spacing={4} >
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
                        {(!profile.images || profile.images.length === 0) &&
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                                align={'center'}
                                className={classes.noPhotos}
                            >
                                User has no images yet.
                            </Typography>
                        }
                    </div>
                }
                {tabIndex === 1 &&
                    <Grid container spacing={4}>
                        <Comments
                            user={user}
                            defaultUserAvatar={defaultUserAvatar}
                            profileId={profile.id}
                        />
                    </Grid>
                }
            </Box>
        </React.Fragment>
    );
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    showMessageInput: PropTypes.bool.isRequired,
    setShowMessageInput: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired,
    setTabIndex: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    avatarLocation: PropTypes.string.isRequired,
    handleSubmitInput: PropTypes.func.isRequired,
    submitRateUser: PropTypes.func.isRequired
};

export default withStyles(styles)(Profile);