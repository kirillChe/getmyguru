import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    Radio,
    RadioGroup,
    Avatar,
    FormControlLabel,
    FormControl
} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import ErrorIcon from '@material-ui/icons/Warning';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import * as R from 'ramda';

import { MainContext } from '../context';

const ages = R.range(14, 100);

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

const getUserAvatar = (user, defaultUserAvatar) => user.avatarLocation || (user.gender === 'male' ? defaultUserAvatar.male : defaultUserAvatar.female);

const EditProfile = (props) => {
    const {classes} = props;
    const { allowedLanguages, defaultUserAvatar, user } = useContext(MainContext);
    const [submitError, setSubmitError] = useState(false);

    const [values, setValues] = useState({
        phone: user.phone || '',
        language: user.language || 'en',
        age: user.age,
        gender: user.gender || 'male',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
    });

    const [file, setFile] = useState(null);
    const [avatarLocation, setAvatarLocation] = useState(getUserAvatar(user, defaultUserAvatar));

    function validateForm () {
        //@todo add required validator
        return values.firstName.length > 0 &&
            values.lastName.length > 0 &&
            values.email.length > 0;
    }

    function handleInputChange (e) {
        const {name, value} = e.target;
        setValues({...values, [name]: value})
    }

    function handleAvatarChange (e) {
        setFile(e.target.files[0]);
        setAvatarLocation(URL.createObjectURL(e.target.files[0]));
    }

    async function handleSubmit (e) {
        e.preventDefault();
        const data = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        R.forEachObjIndexed((val, key) => {
            data.append(key, val);
        }, values);
        data.append('file', file);

        try {
            let response = await axios.put('/api/users/me', data, config);
            if (response.status === 200) {
                props.history.push(`/account/profile/${user.id}`);
            } else {
                setSubmitError(true);
            }
        } catch (err) {
            console.log('Update user error: ');
            console.log(err);
            setSubmitError(true);
        }
    }

    return (
        <div className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Avatar alt="avatar" src={avatarLocation} className={classes.bigAvatar} />
                <input
                    id="raised-button-file"
                    name="myFile"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className={classes.input}
                />
                <label htmlFor="raised-button-file">
                    <Button component="span" >
                        Upload
                    </Button>
                </label>
                <TextField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="gender"
                        name="gender"
                        value={values.gender}
                        onChange={handleInputChange}
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
                    name="age"
                    select
                    label="Age"
                    value={values.age}
                    onChange={handleInputChange}
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
                    name="language"
                    select
                    label="Language"
                    value={values.language}
                    onChange={handleInputChange}
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
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    id="phone"
                    name="phone"
                    label="Phone"
                    value={values.phone}
                    onChange={handleInputChange}
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
                    disabled={!validateForm()}
                >
                    Save
                </Button>
            </form>
        </div>
    );
};

EditProfile.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(EditProfile));