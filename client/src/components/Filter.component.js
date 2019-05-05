import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import axios from "axios";
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
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
});

class Filter extends Component {
    state = {
        gender: 'male',
        age: 20,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        userType: 'guru'
    };

    handleChange = event => {
        this.setState({
            // for radio buttons use name
            [event.target.id || event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = {
            params: {filter: this.state}
        };

        console.log(`Search form submitted:`);
        console.log(data);

        axios
            .get('/api/users', data)
            .then(response => {
                console.log('Search response: ');
                console.log(response);
                // if (response.status === 201) {
                //     this.props.dialogClick('showLogin')();
                // }
            })
            .catch(err => {
                console.log('Search error: ');
                console.log(err);
                // this.setState({
                //     submitError: true
                // });
                // this.forceUpdate();
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
            phone
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
                    className={classes.textField}
                />
                <TextField
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
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
                    select
                    label="Age"
                    value={age}
                    onChange={this.handleChange}
                    SelectProps={{
                        native: true
                    }}
                    margin="normal"
                    variant="outlined"
                    className={classes.textField}
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
                    className={classes.textField}
                />
                <TextField
                    id="phone"
                    label="Phone"
                    value={phone}
                    onChange={this.handleChange}
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
            // <form className={classes.container} noValidate autoComplete="off">
            //     <TextField
            //         id="first-name"
            //         label="First Name"
            //         className={classes.textField}
            //         value={this.state.firstName}
            //         onChange={this.handleChange('firstName')}
            //         margin="normal"
            //     />
            //
            //     <TextField
            //         id="last-name"
            //         label="LastName"
            //         className={classes.textField}
            //         value={this.state.lastName}
            //         onChange={this.handleChange('lastName')}
            //         margin="normal"
            //     />
            //
            //     <TextField
            //         id="age"
            //         select
            //         label="Age"
            //         className={classes.textField}
            //         value={this.state.age}
            //         onChange={this.handleChange('age')}
            //         SelectProps={{
            //             MenuProps: {
            //                 className: classes.menu,
            //             },
            //         }}
            //         margin="normal"
            //     >
            //         {ages.map(option => (
            //             <MenuItem key={option.value} value={option.value}>
            //                 {option.label}
            //             </MenuItem>
            //         ))}
            //     </TextField>
            //
            //     <TextField
            //         id="rating"
            //         select
            //         label="Rating"
            //         className={classes.textField}
            //         value={this.state.age}
            //         onChange={this.handleChange('rating')}
            //         // SelectProps={{
            //         //     MenuProps: {
            //         //         className: classes.menu,
            //         //     },
            //         // }}
            //         margin="normal"
            //     >
            //         {/*{ages.map(option => (*/}
            //             {/*<MenuItem key={option.value} value={option.value}>*/}
            //                 {/*{option.label}*/}
            //             {/*</MenuItem>*/}
            //         {/*))}*/}
            //     </TextField>
            //     <Button ype="submit" variant="outlined" color="primary">Search</Button>
            // </form>
        );
    }
}

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);