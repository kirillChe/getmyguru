import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    progress: {
        position: 'fixed',
        top: '50%',
        left: '50%'
    }
});

const SpinnerComponent = ({classes}) => {
    return <CircularProgress className={classes.progress} />
};

export default withStyles(styles)(SpinnerComponent);