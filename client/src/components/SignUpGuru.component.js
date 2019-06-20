import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    IconButton,
    InputAdornment
} from '@material-ui/core';
import { Visibility, VisibilityOff, Warning } from '@material-ui/icons';
import useForceUpdate from 'use-force-update';

import axios from 'axios';
import * as R from 'ramda';

const ages = R.range(14, 100);

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});

const SignUpGuru = (props) => {
    const {classes} = props;
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [values, setValues] = useState({
        gender: 'male',
        age: 20,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        userType: 'guru'
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
            <FormControl component="fieldset">
                <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="male"
                        control={<Radio color="primary" />}
                        label="Male"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        value="female"
                        control={<Radio color="primary" />}
                        label="Female"
                        labelPlacement="start"
                    />
                </RadioGroup>
            </FormControl>
            <TextField
                id="age"
                name="age"
                select
                label="Age"
                value={values.age}
                onChange={handleChange}
                SelectProps={{
                    native: true
                }}
                margin="normal"
                variant="outlined"
                fullWidth
            >
                {ages.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </TextField>
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
                id="phone"
                name="phone"
                label="Phone"
                value={values.phone}
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


SignUpGuru.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpGuru);