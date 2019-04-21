import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// import cards from './tileData';

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
        paddingTop: '56.25%', // 16:9
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

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */




const cards = [
   {
     img: 'https://material-ui.com/static/images/grid-list/breakfast.jpg',
     title: 'Image',
     author: 'author',
   },
   {
     img: 'https://material-ui.com/static/images/grid-list/burgers.jpg',
     title: 'Image',
     author: 'author',
   },
   {
     img: 'https://material-ui.com/static/images/grid-list/camera.jpg',
     title: 'Image',
     author: 'author',
   },
   {
     img: 'https://material-ui.com/static/images/grid-list/morning.jpg',
     title: 'Image',
     author: 'author',
   }
 ];


function ImageGrid(props) {
    const { classes } = props;

    return (
        <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={40}>
                {cards.map(card => (
                    <Grid item key={card.img} sm={6} md={4} lg={3}>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={card.img}
                                    title={card.title}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Heading
                                    </Typography>
                                    <Typography>
                                        This is a media card. You can use this section to describe the content.
                                    </Typography>
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

ImageGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageGrid);