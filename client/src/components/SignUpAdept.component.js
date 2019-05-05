import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import ErrorIcon from '@material-ui/icons/Warning';

import axios from "axios";
import * as R from "ramda";

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    }
});

class SignUpAdept extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'adept',
        showPassword: false,
        submitError: false
    };

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            // for radio buttons use name
            [event.target.id || event.target.name]: event.target.value
        });
    };

    togglePasswordMask = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = R.omit(['showPassword', 'submitError'], this.state);

        console.log(`Sign up adept form submitted:`);
        console.log(data);

        axios
            .post('/api/users', data)
            .then(response => {
                console.log('Sign up adept response: ');
                console.log(response);
                if (response.status === 201) {
                    this.props.dialogClick('showLogin')();
                }
            })
            .catch(err => {
                console.log('Sign up error: ');
                console.log(err);
                this.setState({
                    submitError: true
                });
                this.forceUpdate();
            });
    };

    render() {
        const { classes } = this.props;
        const {
            firstName,
            lastName,
            email,
            password,
            showPassword,
            submitError
        } = this.state;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <TextField
                    id="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.togglePasswordMask}
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
                    <ErrorIcon/> Wrong data entered
                </Button>
                }
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!this.validateForm()}
                >
                    Sign Up
                </Button>
            </form>
        );
    }
}

SignUpAdept.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpAdept);