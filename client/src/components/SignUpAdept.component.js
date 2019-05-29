import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff, Warning } from '@material-ui/icons';
import useForceUpdate from 'use-force-update';

import axios from 'axios';

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});

const SignUpAdept = (props) => {
    const {classes} = props;
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'adept'
    });

    function validateForm() {
        return values.email.length > 0 && values.password.length > 0;
    }

    function handleChange (e) {
        const {name, value} = e.target;
        setValues({...values, [name]: value})
    }

    function togglePasswordMask () {
        setShowPassword(!showPassword);
    }

    async function handleSubmit (event) {
        event.preventDefault();

        console.log(`Sign up adept form submitted:`);
        console.log(values);

        try {
            let response = await axios.post('/api/users', values);
            console.log('Sign up adept response: ');
            console.log(response);
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
        <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Toggle password visibility"
                                onClick={togglePasswordMask}
                            >
                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
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
            >
                Sign Up
            </Button>
        </form>
    );
};


SignUpAdept.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpAdept);