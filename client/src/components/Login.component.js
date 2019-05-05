import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ErrorIcon from '@material-ui/icons/Warning';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

import axios from "axios";

const styles = theme => ({
    form: {
        width: '90%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class Login extends Component {
    state = {
        email: '',
        password: '',
        remember: '',
        wrongCredentials: false,
        showPassword: false
    };

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = name => event => {
        if (name === 'remember') {
            this.setState({ [name]: event.target.checked });
        } else {
            this.setState({ [name]: event.target.value });
        }
    };

    togglePasswordMask = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = {
            email: this.state.email,
            password: this.state.password
        };

        console.log(`Login Form submitted:`);
        console.log(data);

        axios
            .post('/auth/login', data)
            .then(response => {
                console.log('Login response: ');
                console.log(response);
                // console.log(response.data);
                if (response.status === 200) {
                    // update App.js state
                    this.props.updateUser({
                        loggedIn: true,
                        email: response.data.email
                    });
                    //@todo change it, add props to state
                    // refresh page
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log('login error: ');
                console.log(err);
                this.setState({
                    wrongCredentials: true
                });
                this.forceUpdate();
            });
    };

    render() {
        const { classes } = this.props;
        let {wrongCredentials} = this.state;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <TextField
                    id="email"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="password"
                    label="Password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
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
                                    {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            id="remember"
                            value="remember"
                            checked={this.state.remember}
                            color="primary"
                            onChange={this.handleChange('remember')}
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
                        <ErrorIcon/> Credentials not valid
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
                    Login
                </Button>
            </form>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);