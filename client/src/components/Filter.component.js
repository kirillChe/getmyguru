import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';

import axios from 'axios';
import * as R from 'ramda';

const ages = R.range(14, 100);

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
});

const Filter = (props) => {
    const {classes} = props;

    const [values, setValues] = useState({
        gender: 'male',
        age: 20,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        userType: 'guru'
    });

    function handleChange (e) {
        const {name, value} = e.target;
        setValues({...values, [name]: value})
    }

    async function handleSubmit (e) {
        e.preventDefault();
        let data = {
            params: {filter: values}
        };

        console.log(`Search form submitted:`);
        console.log(data);
        
        try {
            let response = await axios.get('/api/users', data);
            console.log('Search response: ');
            console.log(response);
        }catch (err) {
            console.log('Search error: ');
            console.log(err);
        }
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                />
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="male"
                            control={<Radio color="primary"/>}
                            label="Male"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="female"
                            control={<Radio color="primary"/>}
                            label="Female"
                            labelPlacement="start"
                        />
                    </RadioGroup>
                </FormControl>
                <TextField
                    id="age"
                    name="age"
                    select
                    label="Age"
                    value={values.age}
                    onChange={handleChange}
                    SelectProps={{
                        native: true
                    }}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                >
                    {ages.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </TextField>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                />
                <TextField
                    id="phone"
                    name="phone"
                    label="Phone"
                    value={values.phone}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Search
                </Button>
            </form>
        </React.Fragment>
    );
};

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);