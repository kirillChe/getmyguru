import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, InputBase, Tooltip, Divider,
    Dialog, DialogContent, Typography, Switch,
    Box, Grid, Input, MenuItem, Select,
    FormControl, InputLabel, Checkbox, Chip
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import Tune from '@material-ui/icons/Tune';

import axios from 'axios';
import * as R from 'ramda';
import * as moment from 'moment';

let experienceRange = [
    '0-1',
    '2-4',
    '5-10',
    '11+',
];

const styles = theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
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
    const {
        classes,
        setCustomFilter,
        setRawFilters
    } = props;

    const [filtersData, setFiltersData] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [age, setAge] = useState([16, 100]);
    const [genderNoMatter, setGenderNoMatter] = useState(false);
    const [withPhotoOnly, setWithPhotoOnly] = useState(false);
    const [rating, setRating] = useState([1, 10]);
    const [gender, setGender] = useState('male');
    const [languages, setLanguages] = useState([]);
    const [experience, setExperience] = useState([]);
    const [competitiveExperience, setCompetitiveExperience] = useState(false);
    const [education, setEducation] = useState(false);
    const [trainingSystem, setTrainingSystem] = useState(false);
    const [nutritionScheme, setNutritionScheme] = useState(false);

    function handleSubmit() {
        // remove false and empty parameters
        let data = R.reject(v => v === false || R.isEmpty(v), state);

        //check gender
        if (genderNoMatter)
            data = R.omit(['gender'], data);

        setRawFilters(data);
        setCustomFilter(true);
        setShowFilters(!showFilters);
    }

    useEffect(() => {
        async function getFiltersData() {
            try {
                const response = await axios.get('/api/users/filtersData');
                setFiltersData(response.data);
            } catch (e) {
                console.log('Profile.js : cannot get profile: ', e);
                throw e;
            }
        }

        getFiltersData();
    }, []);

    let state = {
        age,
        withPhotoOnly,
        rating,
        gender,
        languages,
        experience,
        competitiveExperience,
        trainingSystem,
        nutritionScheme,
        education
    };

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
                                <div className={classes.textField}>
                                    <Typography>
                                        Age range
                                    </Typography>
                                    <Slider
                                        defaultValue={age}
                                        aria-label="range-slider"
                                        min={16}
                                        max={100}
                                        valueLabelDisplay="auto"
                                        onChangeCommitted={(e, val) => setAge(val)}
                                    />
                                </div>
                                <div className={classes.textField}>
                                    <Typography>
                                        Rating range
                                    </Typography>
                                    <Slider
                                        defaultValue={rating}
                                        aria-label="range-slider"
                                        min={1}
                                        max={10}
                                        valueLabelDisplay="auto"
                                        onChangeCommitted={(e, val) => setRating(val)}
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
                                    </Grid>
                                </Typography>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={genderNoMatter}
                                        onChange={() => setGenderNoMatter(!genderNoMatter)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Any gender
                                </Typography>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={withPhotoOnly}
                                        onChange={() => setWithPhotoOnly(!withPhotoOnly)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Only with photo
                                </Typography>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={competitiveExperience}
                                        onChange={() => setCompetitiveExperience(!competitiveExperience)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Has competitive experience
                                </Typography>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel htmlFor="select-multiple">Language</InputLabel>
                                    <Select
                                        multiple
                                        variant="outlined"
                                        value={languages}
                                        className={classes.textField}
                                        onChange={e => setLanguages(e.target.value)}
                                        input={<Input id="select-multiple" />}
                                        renderValue={selected => (
                                            <div className={classes.chips}>
                                                {selected.map(value => (
                                                    <Chip key={value} label={value} className={classes.chip} />
                                                ))}
                                            </div>
                                        )}
                                    >
                                        {filtersData.languages && filtersData.languages.map(name => (
                                            <MenuItem key={name} value={name} >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="select-multiple">Experience</InputLabel>
                                    <Select
                                        multiple
                                        variant="outlined"
                                        value={experience}
                                        className={classes.textField}
                                        onChange={e => setExperience(e.target.value)}
                                        input={<Input id="select-multiple" />}
                                        renderValue={selected => (
                                            <div className={classes.chips}>
                                                {selected.map(value => (
                                                    <Chip key={value} label={value} className={classes.chip} />
                                                ))}
                                            </div>
                                        )}
                                    >
                                        {experienceRange.map(name => (
                                            <MenuItem key={name} value={name} >
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={nutritionScheme}
                                        onChange={() => setNutritionScheme(!nutritionScheme)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Prepare nutrition scheme
                                </Typography>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={trainingSystem}
                                        onChange={() => setTrainingSystem(!trainingSystem)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Prepare training system
                                </Typography>
                                <Typography>
                                    <Checkbox
                                        color="default"
                                        value={education}
                                        onChange={() => setEducation(!education)}
                                        inputProps={{
                                            'aria-label': 'checkbox with default color',
                                        }}
                                    />
                                    Has specific education
                                </Typography>
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