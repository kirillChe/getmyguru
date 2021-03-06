import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import useForceUpdate from 'use-force-update';
import { withSnackbar } from 'notistack';

import axios from 'axios';

import { useIntl } from 'hooks';
import messages from './ForgotPwd.messages';

const styles = theme => ({
    form: {
        width: '90%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

const ForgotPwd = (props) => {
    const { formatMessage } = useIntl();
    const forceUpdate = useForceUpdate();
    const [email, setEmail] = useState('');
    const { classes, enqueueSnackbar } = props;

    function validateForm() {
        return email.length > 0;
    }

    function handleChange (event) {
        setEmail(event.target.value);
    }

    async function handleSubmit (event) {
        event.preventDefault();
        console.log(`Forgot pwd Form submitted:`);

        try {
            let response = await axios.post('/api/users/resetPassword', {email});
            console.log('Forgot pwd response: ');
            console.log(response);

            if (response.status === 204) {
                props.dialogClick('showEmailSent')();
            } else {
                console.log('Forgot pwd error: ');
                enqueueSnackbar(formatMessage(messages.resetPwdError), { variant: 'error', preventDuplicate: true });

                forceUpdate();
            }

        }catch (e) {
            console.log('Forgot pwd error: ', e);
            enqueueSnackbar(formatMessage(messages.resetPwdError), { variant: 'error', preventDuplicate: true });

            forceUpdate();
        }
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="email"
                    label={formatMessage(messages.email)}
                    value={email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!validateForm()}
                >
                    {formatMessage(messages.resetButton)}
                </Button>
            </form>
        </React.Fragment>
    );
};

ForgotPwd.propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(ForgotPwd));