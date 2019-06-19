import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Paper,
    InputBase,
    Tooltip,
    Divider,
    Dialog,
    DialogContent,
    TextField,
    Typography,
    Switch,
    Box,
    Grid,
    Input,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import Tune from '@material-ui/icons/Tune';

import axios from 'axios';

let languages = [
    'ru',
    'en'
];

const styles = theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    textField: {
        width: 200,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    },
    dialog: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(650 + theme.spacing(3) * 2)]: {
            width: 650,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    content: {
        marginTop: theme.spacing(2),
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
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

const Search = (props) => {
    const [showFilters, setShowFilters] = useState(false);
    const {classes} = props;

    const [ageRange, setAgeRange] = useState([16, 100]);
    const [genderNoMatter, setGenderNoMatter] = useState(false);
    const [ratingRange, setRatingRange] = useState([1, 10]);
    const [gender, setGender] = useState('male');
    const [language, setLanguage] = useState([]);
    const [values, setValues] = useState({
        age: 20,
        email: '',
        phone: '',
        password: '',
        userType: 'guru'
    });

    function handleChange (e) {
        let {name, value} = e.target;
        setValues({...values, [name]: value})
    }

    function clickGenderNoMatter (e) {
        let { value} = e.target;
        setGenderNoMatter(Boolean(value));
    }

    async function handleSubmit () {
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
            <Paper className={classes.root} elevation={1}>
                <InputBase className={classes.input} placeholder="Search placeholder" />
                <Divider className={classes.divider} />
                <Tooltip title="Filters">
                    <Button
                        onClick={() => setShowFilters(true)}
                        className={classes.searchButton}
                        color="primary"
                    >
                        <Tune />
                    </Button>
                </Tooltip>
            </Paper>
            <Dialog
                open={showFilters}
                onClose={() => setShowFilters(false)}
                aria-labelledby="responsive-dialog-title"
                className={classes.dialog}
            >
                <DialogContent className={classes.content}>
                    <Box mb="20px">
                        <Grid
                            container
                            spacing={5}
                            wrap={'nowrap'}
                            justify={'space-around'}
                        >
                            <Grid item>
                                {/*<TextField*/}
                                {/*    id="firstName"*/}
                                {/*    name="firstName"*/}
                                {/*    label="First Name"*/}
                                {/*    value={values.firstName}*/}
                                {/*    onChange={handleChange}*/}
                                {/*    margin="normal"*/}
                                {/*    variant="outlined"*/}
                                {/*    className={classes.textField}*/}
                                {/*/>*/}
                                {/*<TextField*/}
                                {/*    id="lastName"*/}
                                {/*    name="lastName"*/}
                                {/*    label="Last Name"*/}
                                {/*    value={values.lastName}*/}
                                {/*    onChange={handleChange}*/}
                                {/*    margin="normal"*/}
                                {/*    variant="outlined"*/}
                                {/*    className={classes.textField}*/}
                                {/*/>*/}
                                <div className={classes.textField}>
                                    <Typography>
                                        Age range
                                    </Typography>
                                    <Slider
                                        defaultValue={ageRange}
                                        aria-label="range-slider"
                                        min={16}
                                        max={100}
                                        valueLabelDisplay="auto"
                                        onChangeCommitted={(e, val) => setAgeRange(val)}
                                    />
                                </div>
                                <div className={classes.textField}>
                                    <Typography>
                                        Rating range
                                    </Typography>
                                    <Slider
                                        defaultValue={ratingRange}
                                        aria-label="range-slider"
                                        min={1}
                                        max={10}
                                        valueLabelDisplay="auto"
                                        onChangeCommitted={(e, val) => setRatingRange(val)}
                                    />
                                </div>
                                <Typography component="div">
                                    <Grid component="label" container alignItems="center" spacing={1}>
                                        <Grid item>Male</Grid>
                                        <Grid item>
                                            <GenderSwitch
                                                disabled={genderNoMatter}
                                                checked={gender === 'female'}
                                                onChange={e => setGender(e.target.checked ? 'female' : 'male')}
                                                name="gender"
                                            />
                                        </Grid>
                                        <Grid item>Female</Grid>
                                        <Grid item>
                                            <Checkbox
                                                color="default"
                                                value={genderNoMatter}
                                                onChange={clickGenderNoMatter}
                                                inputProps={{
                                                    'aria-label': 'checkbox with default color',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="select-multiple">Language</InputLabel>
                                    <Select
                                        multiple
                                        variant="outlined"
                                        value={language}
                                        className={classes.textField}
                                        onChange={e => setLanguage(e.target.value)}
                                        input={<Input id="select-multiple" />}
                                    >
                                        {languages.map(name => (
                                            <MenuItem key={name} value={name} >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="primary"
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

Search.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Search);