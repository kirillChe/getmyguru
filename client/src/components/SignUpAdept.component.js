import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import ReCAPTCHA from 'react-google-recaptcha';

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

const SignUpAdept = ({classes, handleSubmit, siteKey}) => {
    const { language, countryCode } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const [showPassword, setShowPassword] = useState(false);

    const [state, setState] = React.useState({
        captcha: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'adept',
        language,
        country: countryCode
    });

    const {
        firstName,
        lastName,
        email,
        password
    } = state;

    const socialAuthQuery = `language=${language}&country=${countryCode}&userType=${state.userType}`;

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

    function handleCaptchaResponseChange(response) {
        setState({...state, captcha: response});
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
            <ReCAPTCHA
                sitekey={siteKey}
                onChange={handleCaptchaResponseChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!validateForm()}
                onClick={handleSubmit(state)}
            >
                {formatMessage(messages.signUp)}
            </Button>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={`/auth/facebook?${socialAuthQuery}`}
            >
                {'FACEBOOK'}
            </Button>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={`/auth/google?${socialAuthQuery}`}
            >
                {'GOOGLE'}
            </Button>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                href={`/auth/vk?${socialAuthQuery}`}
            >
                {'Vkontakte'}
            </Button>
        </div>
    );
};


SignUpAdept.propTypes = {
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired
};

export default withStyles(styles)(SignUpAdept);