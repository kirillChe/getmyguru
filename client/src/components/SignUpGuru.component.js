import React, { Component } from 'react';
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
import {
    Visibility,
    VisibilityOff,
    Warning
} from '@material-ui/icons';

import axios from "axios";
import * as R from "ramda";

const ages = getAges(14, 100);

function getAges (start, end) {
    let i = start;
    let result = [];

    do {
        result.push({
            value: i,
            label: i
        });
        i += 1;
    } while (i <= end);
    return result;
}

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});

class SignUpAdept extends Component {
    state = {
        gender: 'male',
        age: 20,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        userType: 'guru',
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

        console.log(`Sign up guru form submitted:`);
        console.log(data);

        axios
            .post('/api/users', data)
            .then(response => {
                console.log('Sign up guru response: ');
                console.log(response);
                if (response.status === 201) {
                    this.props.dialogClick();
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
            gender,
            age,
            firstName,
            lastName,
            email,
            phone,
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
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="gender"
                        name="gender"
                        value={gender}
                        onChange={this.handleChange}
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
                    select
                    label="Age"
                    value={age}
                    onChange={this.handleChange}
                    SelectProps={{
                        native: true
                    }}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                >
                    {ages.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField>
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
                    id="phone"
                    label="Phone"
                    value={phone}
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
                    <Warning/> Wrong data entered
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