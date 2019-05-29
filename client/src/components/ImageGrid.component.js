import React, { Component } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";

import * as R from 'ramda';
import axios from 'axios';

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


class ImageGrid extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        };

        this.getGuruProfiles = this.getGuruProfiles.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleClickCard = this.handleClickCard.bind(this);
    }

    componentDidMount() {
        this.getGuruProfiles()
    }

    handleClickCard = profileId => event => {
        console.log('ImageGrid.component.js :60', profileId);
        event.preventDefault();
        console.log('Go to profile');
        // return <Redirect to='/profile' />
        this.props.history.push(`/profile/${profileId}`);
    };

    getGuruProfiles() {

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

        if (this.props.attr === 'last')
            params._sort = 'createdAt';

        axios.get('/api/users/getGurusPreviews', {params})
            .then(response => {
                console.log('Get users response: ');
                if (response.data) {

                    let users = R.map(user => {
                        //@todo buy images when time came
                        if (!user.avatarLocation) {
                            user.avatarLocation = user.gender === 'male' ?
                                'https://thumbs.dreamstime.com/z/default-placeholder-fitness-trainer-t-shirt-half-length-portrait-photo-avatar-gray-color-default-placeholder-fitness-trainer-116470280.jpg' :
                                'https://thumbs.dreamstime.com/z/default-placeholder-fitness-trainer-t-shirt-default-placeholder-fitness-trainer-t-shirt-half-length-portrait-photo-119457655.jpg';
                        }
                        return user;
                    }, response.data);

                    this.setState({ users })
                } else {
                    console.log('Get users: no users');
                }
            }).catch(err => {
                console.log('Show image grid error: ');
                console.log(err);
            });
    }

    render() {
        const { classes } = this.props;
        const { users: cards } = this.state;

        return (
            <div className={classNames(classes.layout, classes.cardGrid)}>
                {/* End hero unit */}
                <Grid container spacing={10}>
                    {cards.map(card => (
                        <Grid item key={card.avatarLocation + '-' + card.id} sm={6} md={4} lg={3}>
                            <Card className={classes.card}>
                                <CardActionArea onClick={this.handleClickCard(card.id)}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={card.avatarLocation}
                                        title={card.title}
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.firstName} {card.lastName}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

ImageGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ImageGrid));
