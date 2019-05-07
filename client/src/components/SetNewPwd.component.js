import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Warning';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

import axios from 'axios';

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
        password: '',
        wrongCredentials: false,
        showPassword: false
    };

    validateForm() {
        return this.state.password.length > 0;
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    togglePasswordMask = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = {
            token: this.props.token,
            newPassword: this.state.password
        };

        console.log(`Set new pwd submitted:`);
        console.log(data);

        axios
            .post('/api/users/setNewPassword', data)
            .then(response => {
                console.log('Set new pwd response: ');
                console.log(response);
                if (response.status === 204) {
                    this.props.dialogClick();
                }
            })
            .catch(err => {
                console.log('Set new pwd error: ');
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
                    Reset
                </Button>
            </form>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);