import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import * as R from 'ramda';

import { MainContext, EditProfileContext } from 'context';


const EditProfile = ({children, history, location}) => {
    const { defaultUserAvatar, user } = useContext(MainContext);
    const [submitError, setSubmitError] = useState(false);
    const profile = location.state;

    //const [file, setFile] = useState(null);
    const [avatarLocation, setAvatarLocation] = useState(profile.avatarLocation || defaultUserAvatar[profile.gender]);

    const defaultState = {
        file: null,
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
    };
    const [state, setState] = React.useState(R.clone(defaultState));

    const handleChangeDate = name => date => {
        setState({ ...state, [name]: date });
    };

    const handleChange = e => {
        let {name, value} = e.target;
        setState({...state, [name]: value})
    };

    const handleChangeSwitch = name => e => {
        setState({ ...state, [name]: e.target.checked ? 'female' : 'male' });
    };

    const handleChangeCheckbox = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    function validateForm () {
        //@todo add required validator
        return state.firstName.length > 0 &&
            state.lastName.length > 0 &&
            state.email.length > 0;
    }

    function handleAvatarChange (e) {
        setState({ ...state, file: e.target.files[0]});
        //setFile(e.target.files[0]);
        setAvatarLocation(URL.createObjectURL(e.target.files[0]));
    }

    async function handleSubmit () {
        const data = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        R.forEachObjIndexed((val, key) => {
            //don't save empty string value
            if ('string' === typeof val && R.not(R.trim(val)))
                val = null;
            data.append(key, val);
        }, state);
        //data.append('file', file);

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
        handleChangeCheckbox,
        handleChange,
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