import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

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

class ForgotPwd extends React.Component {
    state = {
        email: ''
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

        console.log(`Login Form submitted:`);
        console.log(data);

        axios
            .post('/oauth/', data)
            .then(res => console.log(res.data));
    };

    render() {
        const { classes } = this.props;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" name="email" autoComplete="email" autoFocus />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
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