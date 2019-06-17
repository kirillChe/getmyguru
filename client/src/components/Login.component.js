import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    FormControlLabel,
    Checkbox,
    TextField,
    IconButton,
    InputAdornment
} from '@material-ui/core';
import {
    Warning,
    Visibility,
    VisibilityOff
} from '@material-ui/icons';
import useForceUpdate from 'use-force-update';

import { MainContext } from 'context';

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

const Login = (props) => {
    const {classes} = props;
    const forceUpdate = useForceUpdate();
    const { updateUser } = useContext(MainContext);
    const [showPassword, setShowPassword] = useState(false);
    const [wrongCredentials, setWrongCredentials] = useState(false);
    const [remember, setRemember] = useState(false);
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    function validateForm() {
        return values.email.length > 0 && values.password.length > 0;
    }

    function handleChange (event) {
        let {name} = event.target;
        if (name === 'remember') {
            setRemember(event.target.checked);
        } else {
            let {value} = event.target;
            setValues({...values, [name]: value})
        }
    }

    function togglePasswordMask () {
        setShowPassword(!showPassword);
    }

    async function handleSubmit (event) {
        event.preventDefault();
        console.log(`Login Form submitted:`);
        let data = {
            email: values.email,
            password: values.password
        };

        try {
            let response = await axios.post('/auth/login', data);
            console.log('Login response: ');
            console.log(response.data);
            // console.log(response.data);
            if (response.status === 200) {
                // update main context state
                updateUser({
                    loggedIn: true,
                    user: response.data
                });
                //@todo change it, add props to state
                // refresh page
                window.location.reload();
            } else {
                console.log('login error');
                setWrongCredentials(true);
                forceUpdate();
            }
        }catch (e) {
            console.log('login error: ');
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
                <FormControlLabel
                    control={
                        <Checkbox
                            id="remember"
                            name="remember"
                            value="remember"
                            checked={remember}
                            color="primary"
                            onChange={handleChange}
                        />
                    }
                    label="Remember me"
                />
                {wrongCredentials &&
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    className={classes.submit}
                    disabled
                >
                    <Warning/> Credentials not valid
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
                    Login
                </Button>
            </form>
        </React.Fragment>
    );
};

Login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);