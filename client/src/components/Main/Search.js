import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, Paper, InputBase,
    Tooltip, Divider, Dialog,
    DialogContent, Box, Grid,
} from '@material-ui/core';
import {Tune, Search as SearchIcon} from '@material-ui/icons';

import axios from 'axios';
import * as R from 'ramda';

import { MainContext } from 'context';
import {Checkbox, Slider, MultiSelect, Switch} from 'components/Form';
import { useIntl } from 'hooks';
import messages from './Search.messages';

const experienceRange = [
    '0-1',
    '2-4',
    '5-10',
    '11+',
].reduce((res, val) => { res[val] = val; return res; }, {});

const defaultStates = {
    withPhotoOnly: false,
    genderNoMatter: false,
    competitiveExperience: false,
    education: false,
    trainingSystem: false,
    nutritionScheme: false,
    age: [16, 99],
    rating: [1, 10],
    gender: 'male',
    country: [],
    languages: [],
    experience: []
};

const styles = theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
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
        [theme.breakpoints.up(700 + theme.spacing(3) * 2)]: {
            width: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    content: {
        marginTop: theme.spacing(2),
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
});

const Search = (props) => {
    const { countriesList } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const {
        classes,
        setCustomFilter,
        setRawFilters
    } = props;

    const [baseSearch, setBaseSearch] = useState('');
    const [filtersData, setFiltersData] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [state, setState] = React.useState(R.clone(defaultStates));

    //@todo find list of languages per lang
    filtersData.languagesRange = {
        en: 'English',
        ru: 'Russian',
        es: 'Spanish',
        il: 'Hebrew',
    };
    //convert array with codes to object with human readable values
    let getReadableValues = (donorObj, arr) => {
        let result = {};
        R.forEach(v => {
            result[v] = donorObj[v];
        }, arr);
        return result;
    };
    const {
        withPhotoOnly,
        genderNoMatter,
        competitiveExperience,
        education,
        trainingSystem,
        nutritionScheme,
        age,
        rating,
        gender,
        languages,
        experience,
        country
    } = state;

    const handleChangeSwitch = name => e => {
        setState({ ...state, [name]: e.target.checked ? 'female' : 'male' });
    };

    const handleChangeSlider = name => (e, value) => {
        setState({ ...state, [name]: value });
    };

    const handleChange = e => {
        let {name, value} = e.target;
        setState({...state, [name]: value})
    };

    const handleChangeCheckbox = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

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

    function clearFilters() {
        setState(R.clone(defaultStates));
    }

    function handleBaseSearch() {
        let data = baseSearch.match(/\b(\w+)\b/g);
        if (data && data.length > 0) {
            setRawFilters({baseSearch: data});
            setCustomFilter(true);
        } else {
            clearFilters();
            setCustomFilter(false);
        }
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

    return (
        <React.Fragment>
            <Paper className={classes.root} elevation={1}>
                <InputBase
                    className={classes.input}
                    placeholder={formatMessage(messages.searchPlaceholder)}
                    value={baseSearch}
                    onChange={e => setBaseSearch(e.target.value)}
                    onKeyPress={e => e.key === 'Enter'? handleBaseSearch() : null}
                />
                <Divider className={classes.divider} />
                <Tooltip title={formatMessage(messages.searchTooltip)}>
                    <Button
                        onClick={handleBaseSearch}
                        className={classes.searchButton}
                        color="primary"
                    >
                        <SearchIcon />
                    </Button>
                </Tooltip>
                <Divider className={classes.divider} />
                <Tooltip title={formatMessage(messages.filtersTooltip)}>
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
                            <Grid item xs={6}>
                                <Slider
                                    label={formatMessage(messages.ageRange)}
                                    name={'age'}
                                    state={age}
                                    min={16}
                                    max={99}
                                    onChange={handleChangeSlider('age')}
                                />
                                <Slider
                                    label={formatMessage(messages.ratingRange)}
                                    name={'rating'}
                                    state={rating}
                                    min={1}
                                    max={10}
                                    onChange={handleChangeSlider('rating')}
                                />
                                <Switch
                                    disabled={genderNoMatter}
                                    firstLabel={formatMessage(messages.male)}
                                    secondLabel={formatMessage(messages.female)}
                                    checked={gender === 'female'}
                                    name={'gender'}
                                    onChange={handleChangeSwitch('gender')}
                                />
                                <Checkbox
                                    name="genderNoMatter"
                                    state={genderNoMatter}
                                    onChange={handleChangeCheckbox('genderNoMatter')}
                                    label={formatMessage(messages.anyGender)}
                                />
                                <Checkbox
                                    name="withPhotoOnly"
                                    state={withPhotoOnly}
                                    onChange={handleChangeCheckbox('withPhotoOnly')}
                                    label={formatMessage(messages.withPhotoOnly)}
                                />
                                <MultiSelect
                                    name={'country'}
                                    state={country}
                                    label={formatMessage(messages.country)}
                                    onChange={handleChange}
                                    selectValues={getReadableValues(countriesList, filtersData.countriesRange || [])}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <MultiSelect
                                    name={'languages'}
                                    state={languages}
                                    label={formatMessage(messages.language)}
                                    onChange={handleChange}
                                    selectValues={filtersData.languagesRange}
                                />
                                <MultiSelect
                                    name={'experience'}
                                    state={experience}
                                    label={formatMessage(messages.experience)}
                                    onChange={handleChange}
                                    selectValues={experienceRange}
                                />
                                <Checkbox
                                    name="nutritionScheme"
                                    state={nutritionScheme}
                                    onChange={handleChangeCheckbox('nutritionScheme')}
                                    label={formatMessage(messages.prepareNutritionScheme)}
                                />
                                <Checkbox
                                    name="trainingSystem"
                                    state={trainingSystem}
                                    onChange={handleChangeCheckbox('trainingSystem')}
                                    label={formatMessage(messages.prepareTrainingSystem)}
                                />
                                <Checkbox
                                    name="competitiveExperience"
                                    state={competitiveExperience}
                                    onChange={handleChangeCheckbox('competitiveExperience')}
                                    label={formatMessage(messages.competitiveExperience)}
                                />
                                <Checkbox
                                    name="education"
                                    state={education}
                                    onChange={handleChangeCheckbox('education')}
                                    label={formatMessage(messages.education)}
                                />
                                <Button
                                    onClick={clearFilters}
                                    variant="outlined"
                                    color="primary"
                                >
                                    {formatMessage(messages.clearFilters)}
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    color="primary"
                                >
                                    {formatMessage(messages.searchButton)}
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