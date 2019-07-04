import React, { useContext } from 'react';
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

import {ImageGridContext} from 'context';

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


const ImageGrid = ({classes}) => {
    const { users, handleClickCard } = useContext(ImageGridContext);

    return (
        <div className={classNames(classes.layout, classes.cardGrid)}>
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageGrid);