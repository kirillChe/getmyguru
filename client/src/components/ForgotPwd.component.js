import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Warning';
import useForceUpdate from 'use-force-update';

import axios from 'axios';

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
    const forceUpdate = useForceUpdate();
    const [wrongCredentials, setWrongCredentials] = useState(false);
    const [email, setEmail] = useState('');
    const { classes } = props;

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

                setWrongCredentials(true);
                forceUpdate();
            }

        }catch (e) {
            console.log('Forgot pwd error: ');
            console.log(e);

            setWrongCredentials(true);
            forceUpdate();
        }
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                {wrongCredentials &&
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    className={classes.submit}
                    disabled
                >
                    <ErrorIcon/> Credentials not valid
                </Button>
                }
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!validateForm()}
                >
                    Reset
                </Button>
            </form>
        </React.Fragment>
    );
};

ForgotPwd.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ForgotPwd);