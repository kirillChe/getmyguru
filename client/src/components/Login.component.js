import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ErrorIcon from '@material-ui/icons/Warning';

import axios from "axios";

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
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
        wrongCredentials: false
    };

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
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
                    console.log('_________________HERE: 67________________________');
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
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email or Nickname</InputLabel>
                    <Input
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
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