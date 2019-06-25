import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    IconButton,
    InputAdornment,
    Typography,
    Switch,
    Grid
} from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';
import { Visibility, VisibilityOff, Warning } from '@material-ui/icons';
import useForceUpdate from 'use-force-update';

import axios from 'axios';
import moment from 'moment';
import { MainContext } from 'context';

const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    }
});

const GenderSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: 'white',
            '& + $track': {
                backgroundColor: '#f44336',
                opacity: 1,
            },
        },
    },
    track: {
        backgroundColor: '#3f51b5',
        opacity: 1,
    },
    checked: {},
})(Switch);

const SignUpGuru = (props) => {
    const { countriesList } = useContext(MainContext);
    const {classes} = props;
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const [values, setValues] = useState({
        country: '',
        gender: 'male',
        selectedDate: moment().startOf('day').subtract(30, 'years').calendar(),
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: 'guru'
    });

    function validateForm() {
        return values.email.length > 0 && values.password.length > 0;
    }

    function handleChange (name, value) {
        return e => {
            if (!name || !value) {
                name = e.target.name;
                value = e.target.value;
            }
            setValues({...values, [name]: value})
        };
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
                id="country"
                name="country"
                select
                value={values.country}
                onChange={handleChange}
                SelectProps={{
                    native: true
                }}
                margin="normal"
                variant="outlined"
                fullWidth
            >
                {countriesList.map(option => (
                    <option key={option[0]} value={option[0]}>
                        {option[1]}
                    </option>
                ))}
            </TextField>
            <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                value={values.firstName}
                onChange={handleChange()}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                value={values.lastName}
                onChange={handleChange()}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    disableFuture
                    openTo="year"
                    format="dd/MM/yyyy"
                    label="Date of birth"
                    views={["year", "month", "date"]}
                    maxDate={moment().startOf('day').subtract(16, 'years').calendar()}
                    minDate={moment().startOf('day').subtract(99, 'years').calendar()}
                    value={values.selectedDate}
                    onChange={date => handleChange('selectedDate', date)()}
                />
            </MuiPickersUtilsProvider>
            <Typography component="div">
                <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>Male</Grid>
                    <Grid item>
                        <GenderSwitch
                            checked={values.gender === 'female'}
                            onChange={e => handleChange('gender', e.target.checked ? 'female' : 'male')()}
                            name="gender"
                        />
                    </Grid>
                    <Grid item>Female</Grid>
                </Grid>
            </Typography>
            <TextField
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange()}
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
                onChange={handleChange()}
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