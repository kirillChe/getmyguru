import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Box,
    Button,
    TextField,
    Avatar,
    Grid,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Warning';
import moment from 'moment';
import { MainContext } from 'context';

import {Checkbox, MultiSelect, Switch, DatePicker, Select} from 'components/Form';

//must be an object
const experienceRange = [
    '0-1',
    '2-4',
    '5-10',
    '11+',
].reduce((res, val) => { res[val] = val; return res; }, {});

const languagesRange = {
    en: 'English',
    ru: 'Russian',
    es: 'Spanish',
    il: 'Hebrew',
};


const styles = theme => ({
    submit: {
        marginTop: theme.spacing(3),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bigAvatar: {
        margin: 30,
        width: 200,
        height: 200,
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        display: 'none',
    },
});

const EditProfile = (props) => {
    const { countriesList } = useContext(MainContext);
    const {
        classes,
        state,
        handleChangeSwitch,
        handleChangeCheckbox,
        handleChange,
        handleChangeDate,
        validateForm,
        handleAvatarChange,
        handleSubmit,
        avatarLocation,
        submitError,
        profile,
    } = props;

    const {
        firstName,
        lastName,
        gender,
        email,
        birthDate,
        description,
        competitiveExperience,
        education,
        experience,
        nutritionScheme,
        trainingSystem,
        country,
        phone,
        site,
        languages,
    } = state;

    return (
        <div className={classes.container}>
            <Box component="main" maxWidth={935} margin="auto" padding="60px 20px 0">
                <Grid
                    container
                    spacing={5}
                    wrap={'nowrap'}
                    alignContent={'space-around'}
                    alignItems={'center'}
                    justify={'space-around'}
                >
                    <Grid item xs={6}>
                        <div className={classes.flexCenter}>
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
                                <Button component="span" variant={'outlined'} color={'primary'}>
                                    Upload
                                </Button>
                            </label>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            multiline={true}
                            rows={5}
                            rowsMax={7}
                            id="description"
                            name="description"
                            label="Description"
                            value={description}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={5}
                    wrap={'nowrap'}
                    justify={'space-around'}
                >
                    <Grid item xs={6}>
                        <div className={classes.flexCenter}>
                            <DatePicker
                                maxDate={moment().startOf('day').subtract(16, 'years').calendar()}
                                minDate={moment().startOf('day').subtract(99, 'years').calendar()}
                                state={birthDate}
                                label={'Date of birth'}
                                name={'birthDate'}
                                onChange={handleChangeDate('birthDate')}
                            />
                            <Switch
                                firstLabel={'Male'}
                                secondLabel={'Female'}
                                checked={gender === 'female'}
                                name={'gender'}
                                onChange={handleChangeSwitch('gender')}
                            />
                        </div>
                        <TextField
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={firstName}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={lastName}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <MultiSelect
                            selectValues={languagesRange}
                            label={'Languages'}
                            onChange={handleChange}
                            name={'languages'}
                            state={languages}
                        />
                        <Select
                            selectValues={countriesList}
                            label={'Country'}
                            onChange={handleChange}
                            name={'country'}
                            state={country}
                        />
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            value={email}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            id="phone"
                            name="phone"
                            label="Phone"
                            value={phone}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="site"
                            name="site"
                            label="Site"
                            value={site}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <Select
                            selectValues={experienceRange}
                            label={'Experience'}
                            onChange={handleChange}
                            name={'experience'}
                            state={experience}
                        />
                        <TextField
                            multiline={true}
                            rows={3}
                            rowsMax={5}
                            id="competitiveExperience"
                            name="competitiveExperience"
                            label="Competitive Experience"
                            value={competitiveExperience}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            multiline={true}
                            rows={3}
                            rowsMax={5}
                            id="education"
                            name="education"
                            label="Education"
                            value={education}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        <Checkbox
                            name="nutritionScheme"
                            state={nutritionScheme}
                            onChange={handleChangeCheckbox('nutritionScheme')}
                            label={'Prepare nutrition scheme'}
                        />
                        <Checkbox
                            name="trainingSystem"
                            state={trainingSystem}
                            onChange={handleChangeCheckbox('trainingSystem')}
                            label={'Prepare training system'}
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
                            onClick={handleSubmit}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={!validateForm()}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    handleChangeSwitch: PropTypes.func.isRequired,
    handleChangeCheckbox: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleChangeDate: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    handleAvatarChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    avatarLocation: PropTypes.string.isRequired,
    submitError: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditProfile);