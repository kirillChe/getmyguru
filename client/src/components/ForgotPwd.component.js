import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ErrorIcon from '@material-ui/icons/Warning';

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

class ForgotPwd extends React.Component {
    state = {
        email: '',
        wrongCredentials: false
    };

    validateForm() {
        return this.state.email.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = {
            email: this.state.email
        };

        console.log(`Forgot pwd Form submitted:`);
        console.log(data);

        axios
            .post('/api/users/resetPassword', data)
            .then(response => {
                console.log('Forgot pwd response: ');
                console.log(response);
                if (response.status === 204) {
                    this.props.dialogClick('showEmailSent')();
                }
            })
            .catch(err => {
                console.log('Forgot pwd error: ');
                console.log(err);
                this.setState({
                    wrongCredentials: true
                });
                this.forceUpdate();
            });
    };

    render() {
        const { classes } = this.props;
        let { wrongCredentials } = this.state;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <TextField
                    id="email"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
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

ForgotPwd.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForgotPwd);