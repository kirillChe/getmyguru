import React, { Component } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import * as R from 'ramda';
import axios from 'axios';

const styles = theme => ({
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
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
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1300 + theme.spacing.unit * 3 * 2)]: {
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

        this.getMostPopularUsers = this.getMostPopularUsers.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.getMostPopularUsers()
    }

    getMostPopularUsers() {
        console.log('_________________HERE: 83________________________');
        //@todo provide limit
        axios.get('/api/users/mostPopular')
            .then(response => {
                console.log('Get users response: ');
                console.log(response.data);
                if (response.data) {
                    console.log('Get Users: ', response.data);

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
                    console.log('Get users: no user');
                    // this.setState({
                    //     loggedIn: false,
                    //     email: null
                    // })
                }
            }).catch(err => {
                console.log('Sign up error: ');
                console.log(err);
                this.setState({
                    submitError: true
                });
                this.forceUpdate();
            });
    }

    render() {
        const { classes } = this.props;
        const { users: cards } = this.state;
        console.log('ImageGrid.component.js :106', cards);

        return (
            <div className={classNames(classes.layout, classes.cardGrid)}>
                {/* End hero unit */}
                <Grid container spacing={40}>
                    {cards.map(card => (
                        <Grid item key={card.avatarLocation} sm={6} md={4} lg={3}>
                            <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={card.avatarLocation}
                                        title={card.title}
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.firstName} {card.lastName}
                                        </Typography>
                                        {/*<Typography>*/}
                                        {/*    This is a media card. You can use this section to describe the content.*/}
                                        {/*</Typography>*/}
                                    </CardContent>
                                </CardActionArea>
                                {/*<CardActions>*/}
                                {/*<Button size="small" color="primary">*/}
                                {/*View*/}
                                {/*</Button>*/}
                                {/*<Button size="small" color="primary">*/}
                                {/*Edit*/}
                                {/*</Button>*/}
                                {/*</CardActions>*/}
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

export default withStyles(styles)(ImageGrid);
