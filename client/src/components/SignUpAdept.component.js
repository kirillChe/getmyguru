import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import useForceUpdate from 'use-force-update';
import { withSnackbar } from 'notistack';

import axios from 'axios';
import { MainContext } from 'context';
import { PasswordField} from 'components/Form';
import { useIntl } from 'hooks';
import messages from './SignUpAdept.messages';

const styles = theme => ({
    root: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

const SignUpAdept = ({classes, dialogClick, enqueueSnackbar}) => {
    const { language: userLanguage, countryCode } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);

    const [state, setState] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'adept',
        language: userLanguage,
        country: countryCode
    });

    const {
        firstName,
        lastName,
        email,
        password
    } = state;

    function handleChange (e) {
        let name = e.target.name;
        let value = e.target.value;

        setState({...state, [name]: value})
    }

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function togglePasswordMask () {
        setShowPassword(!showPassword);
    }

    async function handleSubmit () {
        console.log(`Sign up adept form submitted:`);
        try {
            let response = await axios.post('/api/users', state);
            console.log('Sign up adept response: ');
            if (response.status === 201) {
                dialogClick();
            } else {
                console.log('Sign up adept error');
                enqueueSnackbar(formatMessage(messages.signUpError), { variant: 'error' });
                forceUpdate();
            }
        }catch (e) {
            console.log('Sign up adept error: ', e);
            enqueueSnackbar(formatMessage(messages.signUpError), { variant: 'error' });
            forceUpdate();
        }
    }

    return (
        <div className={classes.root}>
            <TextField
                id="firstName"
                name="firstName"
                label={formatMessage(messages.firstName)}
                value={firstName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="lastName"
                name="lastName"
                label={formatMessage(messages.lastName)}
                value={lastName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="email"
                name="email"
                label={formatMessage(messages.email)}
                value={email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <PasswordField
                showPassword={showPassword}
                name={'password'}
                value={password}
                label={formatMessage(messages.password)}
                togglePasswordMask={togglePasswordMask}
                onChange={handleChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!validateForm()}
                onClick={handleSubmit}
            >
                {formatMessage(messages.signUp)}
            </Button>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={'/auth/facebook'}
            >
                {'FACEBOOK'}
            </Button>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={'/auth/google'}
            >
                {'GOOGLE'}
            </Button>
        </div>
    );
};


SignUpAdept.propTypes = {
    classes: PropTypes.object.isRequired,
    dialogClick: PropTypes.func.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
};

export default withStyles(styles)(withSnackbar(SignUpAdept));