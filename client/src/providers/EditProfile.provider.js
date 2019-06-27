import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import * as R from 'ramda';

import { MainContext, EditProfileContext } from 'context';

// const ages = R.range(14, 99);

const EditProfile = ({children, history, location}) => {
    const { defaultUserAvatar, user } = useContext(MainContext);
    const [submitError, setSubmitError] = useState(false);
    const profile = location.state;

    const [file, setFile] = useState(null);
    const [avatarLocation, setAvatarLocation] = useState(profile.avatarLocation || defaultUserAvatar[profile.gender]);

    const [state, setState] = React.useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || 'male',
        email: profile.email || '',
        birthDate: profile.birthDate || '',
        description: profile.info.description || '',
        competitiveExperience: profile.info.competitiveExperience || '',
        education: profile.info.education || '',
        experience: profile.info.experience || '',
        nutritionScheme: profile.info.nutritionScheme || false,
        trainingSystem: profile.info.trainingSystem || false,
        country: profile.info.country || '',
        phone: profile.info.phone || '',
        site: profile.info.site || '',
        languages: profile.languages || [],
    });

    // const {
    //     firstName,
    //     lastName,
    //     gender,
    //     email,
    //     birthDate,
    //     description,
    //     competitiveExperience,
    //     education,
    //     experience,
    //     nutritionScheme,
    //     trainingSystem,
    //     country,
    //     phone,
    //     site,
    //     languages,
    // } = state;

    const handleChangeDate = name => date => {
        setState({ ...state, [name]: date });
    };

    const handleChangeTextField = e => {
        let {name, value} = e.target;
        setState({...state, [name]: value})
    };

    const handleChangeSwitch = name => e => {
        setState({ ...state, [name]: e.target.checked ? 'female' : 'male' });
    };

    // const handleChangeSlider = name => (e, value) => {
    //     setState({ ...state, [name]: value });
    // };

    const handleChangeSelect = name => event => {
        setState({ ...state, [name]: event.target.value });
    };

    const handleChangeCheckbox = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };



    // const [values, setValues] = useState({
    //     phone: profile.phone || '',
    //     language: profile.language || 'en',
    //     age: profile.age,
    //     gender: profile.gender || 'male',
    //     firstName: profile.firstName || '',
    //     lastName: profile.lastName || '',
    //     email: profile.email || ''
    // });

    // const [firstName, setFirstName] = useState(profile.firstName || '');
    // const [lastName, setLastName] = useState(profile.lastName || '');
    // const [gender, setGender] = useState(profile.gender || 'male');
    // const [email, setEmail] = useState(profile.email || '');
    // const [birthDate, setBirthDate] = useState(profile.birthDate || '');
    // const [description, setDescription] = useState(profile.info.description || '');
    // const [competitiveExperience, setCompetitiveExperience] = useState(profile.info.competitiveExperience || '');
    // const [education, setEducation] = useState(profile.info.education || '');
    // const [experience, setExperience] = useState(profile.info.experience || '');
    // const [nutritionScheme, setNutritionScheme] = useState(profile.info.nutritionScheme || false);
    // const [trainingSystem, setTrainingSystem] = useState(profile.info.trainingSystem || false);
    // const [country, setCountry] = useState(profile.info.country || '');
    // const [phone, setPhone] = useState(profile.info.phone || '');
    // const [site, setSite] = useState(profile.info.site || '');
    // const [languages, setLanguages] = useState(profile.languages || []);



    // const [file, setFile] = useState(null);
    // const [avatarLocation, setAvatarLocation] = useState(profile.avatarLocation || defaultUserAvatar[profile.gender]);


    // const setStatesValues = {
    //     firstName: setFirstName,
    //     lastName: setLastName,
    //     gender: setGender,
    //     email: setEmail,
    //     birthDate: setBirthDate,
    //     description: setDescription,
    //     competitiveExperience: setCompetitiveExperience,
    //     education: setEducation,
    //     experience: setExperience,
    //     nutritionScheme: setNutritionScheme,
    //     trainingSystem: setTrainingSystem,
    //     country: setCountry,
    //     phone: setPhone,
    //     site: setSite,
    //     languages: setLanguages
    // };

    function validateForm () {
        //@todo add required validator
        return state.firstName.length > 0 &&
            state.lastName.length > 0 &&
            state.email.length > 0;
    }

    // function handleInputChange (e) {
    //     const {name, value} = e.target;
    //     setValues({...values, [name]: value})
    // }

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
        }, state);
        data.append('file', file);

        try {
            let response = await axios.put('/api/users/me', data, config);
            if (response.status === 200) {
                history.push(`/account/profile/${user.id}`);
            } else {
                setSubmitError(true);
            }
        } catch (err) {
            console.log('Update user error: ');
            console.log(err);
            setSubmitError(true);
        }
    }

    const valueState = {
        state,
        handleChangeSwitch,
        // handleChangeSlider,
        handleChangeSelect,
        handleChangeCheckbox,
        handleChangeTextField,
        handleChangeDate,
        validateForm,
        handleAvatarChange,
        handleSubmit,
        avatarLocation,
        submitError,
        profile,
    };

    return (
        <EditProfileContext.Provider value={valueState}>
            {children}
        </EditProfileContext.Provider>
    );
};

EditProfile.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node
};

export default withRouter(EditProfile);