import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Button, TextField, Radio, RadioGroup, Avatar, FormControlLabel, FormControl } from '@material-ui/core';
import {withRouter} from "react-router-dom";
// import TextField from '@material-ui/core/TextField';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Avatar from '@material-ui/core/Avatar';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import IconButton from '@material-ui/core/IconButton';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
// import InputAdornment from '@material-ui/core/InputAdornment';
import ErrorIcon from '@material-ui/icons/Warning';

import { MainContext } from '../context';


import axios from "axios";
// import * as R from "ramda";

const ages = getAges(14, 100);

function getAges (start, end) {
    let i = start;
    let result = [];

    do {
        result.push(i);
        i += 1;
    } while (i <= end);
    return result;
}

const styles = theme => ({
    form: {
        width: '300px', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    },
    input: {
        display: 'none',
    }
});

const getUserAvatar = ctx => ctx.user.avatarLocation || (ctx.user.gender === 'male' ? ctx.defaultUserAvatar.male : ctx.defaultUserAvatar.female);

class EditProfile extends Component {

    static contextType = MainContext;

    state = {
        avatarLocation: getUserAvatar(this.context),
        gender: this.context.user.gender || '',
        age: this.context.user.age,
        firstName: this.context.user.firstName || '',
        lastName: this.context.user.lastName || '',
        email: this.context.user.email || '',
        language: this.context.user.language || 'en',
        phone: this.context.user.phone || '',
        file: null,
        submitError: false
    };

    componentDidMount() {
        console.log('_________________HERE: 69________________________', this.context);
    }

    validateForm() {
        //@todo add required validator
        return true;
        // return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        if (event.target.type === 'file') {
            this.setState({
                // for radio buttons use name
                file: event.target.files[0],
                avatarLocation: URL.createObjectURL(event.target.files[0])
            });
        } else {
            this.setState({
                // for radio buttons use name
                [event.target.id || event.target.name]: event.target.value
            });
        }
    };

    handleSubmit = async event => {
        event.preventDefault();
        const data = new FormData();
        console.log('_________________HERE: 52________________________', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        data.append('file', this.state.file);
        data.append('gender', this.state.gender);
        data.append('age', this.state.age);
        data.append('firstName', this.state.firstName);
        data.append('lastName', this.state.lastName);
        data.append('email', this.state.email);
        data.append('language', this.state.language);
        data.append('phone', this.state.phone);

        try {
            let response = await axios.put('/api/users/me', data, config);
            if (response.status === 200) {
                this.props.history.push(`/profile/${this.context.user.id}`);
            } else {
                this.setState({
                    submitError: true
                });
            }
        } catch (e) {
            console.log('Update user error: ');
            console.log(e);
            this.setState({
                submitError: true
            });
        }
    };

    render() {
        const { classes } = this.props;
        const {
            avatarLocation,
            gender,
            age,
            firstName,
            lastName,
            email,
            language,
            phone,
            submitError
        } = this.state;
        const {allowedLanguages} = this.context;

        return (
            <div className={classes.container}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <Avatar alt="avatar" src={avatarLocation} className={classes.bigAvatar} />
                     <input
                         accept="image/*"
                         className={classes.input}
                         onChange={this.handleChange}
                         id="raised-button-file"
                         type="file"
                         name="myFile"
                     />
                     <label htmlFor="raised-button-file">
                         <Button component="span" >
                             Upload
                         </Button>
                     </label>
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
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        id="language"
                        select
                        label="Language"
                        value={language}
                        onChange={this.handleChange}
                        SelectProps={{
                            native: true
                        }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    >
                        {allowedLanguages.map(option => (
                            <option key={option} value={option}>
                                {option}
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
                    {submitError &&
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        className={classes.submit}
                        disabled
                    >
                        <ErrorIcon/> Wrong data entered
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
                        Save
                    </Button>
                </form>
            </div>
        );
    }
}

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(EditProfile));
