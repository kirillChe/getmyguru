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
    Slide,
    IconButton,
    Slider
} from '@material-ui/core';
import {Comment, PhotoLibrary, Add, Delete} from '@material-ui/icons';

import { MainContext } from 'context';
import { MessageInput } from 'components';
import { Comments } from 'components/Comments';
import { useIntl } from 'hooks';
import messages from './Profile.messages';

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
    cardAdd: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
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
    dialog: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(500 + theme.spacing(3) * 2)]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    content: {
        marginTop: theme.spacing(2),
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    }
});

class Transition extends React.Component {
    render() {
        let props = this.props;
        return <Slide direction="down" {...props} />;
    }
}

const Profile = (props) => {
    const { user, countriesList } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const {
        classes,
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        handleSubmitInput,
        submitRateUser,
        handleClickEdit,
        profileImages,
        getRootProps,
        getInputProps,
        removeImage
    } = props;
    const [ rating, setRating ] = useState(profile.rating || 8);

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
                                        <Button className={classes.editButton} variant="outlined" onClick={handleClickEdit}>
                                            {formatMessage(messages.editProfile)}
                                        </Button>
                                    }
                                    {user.id !== profile.id &&
                                        <Button className={classes.editButton} variant="outlined" onClick={() => setShowMessageInput(true)}>
                                            {formatMessage(messages.sendMessage)}
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
                                        {formatMessage(messages.newMessageFor)} {profile.firstName} {profile.lastName}
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
                                            <b>{profile.rating}</b> {formatMessage(messages.rating)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            <b>{profile.ratersCount}</b> {formatMessage(messages.raters)}
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
                                                {formatMessage(messages.rateButton)}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            }
                            <Typography variant="body1" bold="true">
                                {countriesList[profile.info && profile.info.country]} {profile.info && profile.info.phone}
                            </Typography>
                            <Typography variant="body1">{profile.info && profile.info.description}</Typography>
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
                        label={formatMessage(messages.tabTitlePhotos)}
                        icon={<PhotoLibrary />}
                        classes={{ selected: classes.selected, root: classes.tabRoot, labelIcon: classes.labelIcon, textColorInherit: classes.textColorInherit, wrapper: classes.wrapper }}
                    />
                    <MuiTab
                        label={formatMessage(messages.tabTitleComments)}
                        icon={<Comment />}
                        classes={{ selected: classes.selected, root: classes.tabRoot, labelIcon: classes.labelIcon, textColorInherit: classes.textColorInherit, wrapper: classes.wrapper }}
                    />
                </MuiTabs>
                {tabIndex === 0 &&
                    <div>
                        <Grid container spacing={4} >
                            {profileImages.map(image => (
                                <Grid item key={image.id} xs={4}>
                                    <Card className={classes.card}>
                                        {profile.id === user.id &&
                                            <IconButton color="inherit" aria-label="Icon" onClick={removeImage(image.id)}>
                                                <Delete/>
                                            </IconButton>
                                        }
                                        <CardActionArea>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={image.url}
                                            />
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                            {profile.id === user.id &&
                                <Grid item key={'addImage'} xs={4}>
                                    <Card className={classes.cardAdd} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <div>
                                            <Add/>
                                            <Typography
                                                align={'center'}
                                                variant="h4"
                                                component="h4"
                                            >
                                                {formatMessage(messages.addPhotoTitle)}
                                            </Typography>
                                        </div>
                                    </Card>
                                </Grid>
                            }
                        </Grid>
                        {(profileImages.length === 0) && profile.id !== user.id &&
                            <Typography
                                variant="h4"
                                component="h4"
                                gutterBottom
                                align={'center'}
                                className={classes.noPhotos}
                            >
                                {formatMessage(messages.noImagesTitle)}
                            </Typography>
                        }
                    </div>
                }
                {tabIndex === 1 &&
                    <Grid container spacing={4}>
                        <Comments
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
    profileImages: PropTypes.array.isRequired,
    handleClickEdit: PropTypes.func.isRequired,
    handleSubmitInput: PropTypes.func.isRequired,
    submitRateUser: PropTypes.func.isRequired,
    getRootProps: PropTypes.func.isRequired,
    getInputProps: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    // getUserImages: PropTypes.func.isRequired,
};

export default withStyles(styles)(Profile);