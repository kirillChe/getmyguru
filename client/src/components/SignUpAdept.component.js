import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

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
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
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
        userType: 'adept',
        showPassword: false
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
        let data = R.omit(['showPassword'], this.state);

        console.log(`Login Form submitted:`);
        console.log(data);

        axios
            .post('/api/users', data)
            .then(res => console.log(res.data));
    };

    render() {
        const { classes } = this.props;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <TextField
                    id="firstName"
                    label="First Name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="lastName"
                    label="Last Name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="gender"
                        name="gender"
                        value={this.state.gender}
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
                    value={this.state.age}
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
                    value={this.state.email}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="phone"
                    label="Phone"
                    value={this.state.phone}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="password"
                    label="Password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
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
                                    {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
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