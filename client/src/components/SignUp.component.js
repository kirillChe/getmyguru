import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Tabs,
    Tab,
    Typography
} from '@material-ui/core';
import useForceUpdate from 'use-force-update';
import { withSnackbar } from 'notistack';
import axios from 'axios';

import {SignUpGuru, SignUpAdept} from '.';
import messages from "./SignUpAdept.messages";
import {useIntl} from "../hooks";
const siteKey = '6LdsOK0UAAAAAOMe-7qd0Qx5Tn14l1HFeUGTv5yf';

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

const SignUp = ({classes, dialogClick, enqueueSnackbar}) => {
    const [tabIndex, setTabIndex] = useState(0);
    const forceUpdate = useForceUpdate();
    const { formatMessage } = useIntl();

    function handleSubmit (state) {
        return async () => {
            console.log(`Sign up form submitted:`);
            try {
                let response = await axios.post('/api/users', state);
                if (response.status === 201) {
                    dialogClick();
                } else {
                    console.log('Sign up error');
                    enqueueSnackbar(formatMessage(messages.signUpError), {variant: 'error'});
                    forceUpdate();
                }
            } catch (e) {
                console.log('Sign up error: ', e);
                enqueueSnackbar(formatMessage(messages.signUpError), {variant: 'error'});
                forceUpdate();
            }
        }
    }

    return (
        <div className={classes.root}>
            <Tabs
                value={tabIndex}
                onChange={(event, value) => {
                    setTabIndex(value);
                }}
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
            {tabIndex === 0 && <SignUpAdept handleSubmit={handleSubmit} siteKey={siteKey} />}
            {tabIndex === 1 && <SignUpGuru handleSubmit={handleSubmit} siteKey={siteKey} />}

        </div>
    );
};

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withSnackbar(SignUp));