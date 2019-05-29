import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Tabs,
    Tab,
    Typography
} from '@material-ui/core';

import {SignUpGuru, SignUpAdept} from '.';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        width: '90%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#1890ff',
    },
    tabRoot: {
        textTransform: 'initial',
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#1890ff',
        },
    },
});

const SignUp = (props) => {
    const { classes } = props;
    const [value, setValue] = useState(0);

    function handleChange (event, value) {
        console.log('SignUp.component.js :53', value);
        setValue(value);
    }

    return (
        <div className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
            >
                <Tab
                    disableRipple
                    classes={{ root: classes.tabRoot }}
                    label="Client"
                />
                <Tab
                    disableRipple
                    classes={{ root: classes.tabRoot }}
                    label="Trainer"
                />
            </Tabs>
            {value === 0 && <SignUpAdept dialogClick={props.dialogClick} />}
            {value === 1 && <SignUpGuru dialogClick={props.dialogClick} />}

        </div>
    );
};

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);