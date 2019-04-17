import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FitnessIcon from '@material-ui/icons/FitnessCenter';

import {Login} from './';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

function ButtonAppBar(props) {
    const { classes } = props;
    return (
        <AppBar position="sticky" color="default" className={classes.root}>
            <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Icon">
                    <FitnessIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    COMPANY
                </Typography>
                <Login />
                <Button variant="outlined" color="primary">Sign Up</Button>
            </Toolbar>
        </AppBar>
    );
}

// ButtonAppBar.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ButtonAppBar);