import React, { useEffect, useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import * as R from 'ramda';
import axios from 'axios';

import {MainContext} from '../context';

const styles = theme => ({
    cardGrid: {
        padding: `${theme.spacing(8)}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '100%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(1300 + theme.spacing(3) * 2)]: {
            width: 1300,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    }
});


const ImageGrid = (props) => {
    const { defaultUserAvatar } = useContext(MainContext);
    const [users, setUsers] = useState([]);
    const {classes} = props;

    function handleClickCard (profileId) {
        return event => {
            console.log('ImageGrid.component.js :60', profileId);
            event.preventDefault();
            console.log('Go to profile');
            // return <Redirect to='/profile' />
            props.history.push(`/account/profile/${profileId}`);
        }
    }


    useEffect(() => {
        async function getGuruProfiles() {
            let params = {
                _limit: 4,
                _order: 'DESC',
                _sort: 'rating',
                filter: {
                    where: {
                        userType: 'guru'
                    }
                }
            };

            if (props.attr === 'last')
                params._sort = 'createdAt';

            try {
                let response = await axios.get('/api/users/getGurusPreviews', {params});

                if (response.data) {
                    let users = R.map(user => {
                        if (!user.avatarLocation)
                            user.avatarLocation = defaultUserAvatar[user.gender];

                        return user;
                    }, response.data);

                    setUsers(users);
                } else {
                    console.log('Get users: no users');
                }
            }catch (e) {
                console.log('Show image grid error: ');
                console.log(e);
            }
        }

        getGuruProfiles();
    }, [defaultUserAvatar, props]);

    return (
        <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={10}>
                {users.map(user => (
                    <Grid item key={user.avatarLocation + '-' + user.id} sm={6} md={4} lg={3}>
                        <Card className={classes.card}>
                            <CardActionArea onClick={handleClickCard(user.id)}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={user.avatarLocation}
                                    title={user.title}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

ImageGrid.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ImageGrid));