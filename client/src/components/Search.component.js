import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Popover,
    Paper,
    InputBase,
    Tooltip,
    Divider
} from '@material-ui/core';
import Tune from '@material-ui/icons/Tune';

import {Filter} from '.';

const styles = theme => ({
    typography: {
        margin: theme.spacing(2),
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
        // margin: theme.spacing.unit
    }
});

const Search = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const {classes} = props;

    function handleClick (event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose () {
        setAnchorEl(null);
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={1}>
                <InputBase className={classes.input} placeholder="Search placeholder" />
                <Divider className={classes.divider} />
                <Tooltip title="Filters">
                    <Button
                        aria-owns={Boolean(anchorEl) ? 'simple-popper' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        className={classes.searchButton}
                        color="primary"
                    >
                        <Tune />
                    </Button>
                </Tooltip>
            </Paper>
            <Popover
                elevation={1}
                className={classes.root}
                id="simple-popper"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
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
};

Search.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Search);