import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import {ImageGrid, Search} from '.';


const styles = theme => ({
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    }
});

function Main(props) {
    const { classes } = props;

    return (
        <React.Fragment>
            <div className={classes.heroUnit}>
                <div className={classes.heroContent}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                        Bla-Bla-Bla Text
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary" paragraph>
                        Something short and leading about the site.
                    </Typography>
                    <Search />
                </div>
            </div>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                The most rated.
            </Typography>
            <ImageGrid attr={'rated'}/>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Last joined.
            </Typography>
            <ImageGrid attr={'last'}/>
        </React.Fragment>
    );
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);