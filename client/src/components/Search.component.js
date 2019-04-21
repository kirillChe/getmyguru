import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import Tune from '@material-ui/icons/Tune';
import Divider from '@material-ui/core/Divider';

import {Filter} from '.';

const styles = theme => ({
    typography: {
        margin: theme.spacing.unit * 2,
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    searchButton: {
        margin: theme.spacing.unit
    }
});

class Search extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        console.log('Search.component.js :47', event);
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <React.Fragment>
                <Paper className={classes.root} elevation={1}>
                    <InputBase className={classes.input} placeholder="Search placeholder" />
                    <Divider className={classes.divider} />
                    <Tooltip title="Filters">
                        <Button
                            aria-owns={open ? 'simple-popper' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            className={classes.searchButton}
                            color="primary"
                        >
                            <Tune />
                        </Button>
                    </Tooltip>
                </Paper>
                <Popover
                    id="simple-popper"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Filter />
                    {/*<Typography className={classes.typography}>The content of the Popover.</Typography>*/}
                </Popover>
            </React.Fragment>
        );
    }
}

Search.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);