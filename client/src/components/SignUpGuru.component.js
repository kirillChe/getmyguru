import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField
} from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import useForceUpdate from 'use-force-update';

import axios from 'axios';
import moment from 'moment';
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

const SignUpGuru = (props) => {
    const { language: userLanguage, countryCode } = useContext(MainContext);
    const {classes} = props;
    const { formatMessage } = useIntl();
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [state, setState] = React.useState({
        gender: 'male',
        birthDate: moment().startOf('day').subtract(30, 'years').calendar(),
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'guru',
        language: userLanguage,
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

    async function handleSubmit () {
        console.log(`Sign up guru form submitted:`);
        try {
            let response = await axios.post('/api/users', state);
            console.log('Sign up guru response: ');
            if (response.status === 201) {
                props.dialogClick();
            } else {
                console.log('Sign up error: ');
                setSubmitError(true);
                forceUpdate();
            }
        }catch (e) {
            console.log('Sign up error: ');
            console.log(e);
            setSubmitError(true);
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
            {submitError &&
            <Button
                fullWidth
                variant="outlined"
                color="secondary"
                className={classes.submit}
                disabled
            >
                <Warning/> {formatMessage(messages.wrongData)}
            </Button>
            }
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
        </div>
    );
};


SignUpGuru.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpGuru);