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
import { MainContext } from 'context';
import { PasswordField} from 'components/Form';

const styles = theme => ({
    root: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

const SignUpAdept = (props) => {
    const { language: userLanguage } = useContext(MainContext);
    const {classes} = props;
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [state, setState] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'adept',
        language: userLanguage,
    });

    const {
        firstName,
        lastName,
        email,
        password,
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
                label="First Name"
                value={firstName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                value={lastName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="email"
                name="email"
                label="Email"
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
                label={'Password'}
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
                <Warning/> Wrong data entered
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
                Sign Up
            </Button>
        </div>
    );
};


SignUpAdept.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpAdept);