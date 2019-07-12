import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import moment from 'moment';
import ReCAPTCHA from 'react-google-recaptcha';

import { MainContext } from 'context';
import {DatePicker, Switch, PasswordField} from 'components/Form';
import { useIntl } from 'hooks';
import messages from './SignUpGuru.messages';

const styles = theme => ({
    root: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

const SignUpGuru = ({classes, handleSubmit, siteKey}) => {
    const { language, countryCode } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const [showPassword, setShowPassword] = useState(false);

    const [state, setState] = React.useState({
        captcha: '',
        gender: 'male',
        birthDate: moment().startOf('day').subtract(30, 'years').calendar(),
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'guru',
        language,
        country: countryCode
    });

    const {
        gender,
        birthDate,
        firstName,
        lastName,
        email,
        password,
    } = state;

    const socialAuthQuery = `language=${language}&country=${countryCode}&userType=${state.userType}`;

    const handleChangeSwitch = name => e => {
        setState({ ...state, [name]: e.target.checked ? 'female' : 'male' });
    };

    const handleChangeDate = name => date => {
        setState({ ...state, [name]: date });
    };

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
            <DatePicker
                maxDate={moment().startOf('day').subtract(16, 'years').calendar()}
                minDate={moment().startOf('day').subtract(99, 'years').calendar()}
                state={birthDate}
                label={formatMessage(messages.birthDate)}
                name={'birthDate'}
                onChange={handleChangeDate('birthDate')}
            />
            <Switch
                firstLabel={formatMessage(messages.male)}
                secondLabel={formatMessage(messages.female)}
                checked={gender === 'female'}
                name={'gender'}
                onChange={handleChangeSwitch('gender')}
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


SignUpGuru.propTypes = {
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired
};

export default withStyles(styles)(SignUpGuru);