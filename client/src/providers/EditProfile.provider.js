import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import * as R from 'ramda';
import moment from 'moment';
import { withSnackbar } from 'notistack';

import { useIntl } from 'hooks';
import { MainContext, EditProfileContext } from 'context';
import messages from "./EditProfile.messages";


const EditProfile = ({children, history, location, enqueueSnackbar}) => {
    const { formatMessage } = useIntl();
    const { defaultUserAvatar, user } = useContext(MainContext);
    const profile = location.state;

    const [file, setFile] = useState(null);
    const [avatarLocation, setAvatarLocation] = useState(profile.avatarLocation || defaultUserAvatar[profile.gender]);

    const defaultState = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || 'male',
        email: profile.email || '',
        birthDate: moment(profile.birthDate).isValid() ? moment(profile.birthDate) : null,
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
        setFile(e.target.files[0]);
        setAvatarLocation(URL.createObjectURL(e.target.files[0]));
    }

    async function handleSubmit () {
        const data = new FormData();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        let userData = R.map(prop => {
            return ('string' === typeof prop && R.not(R.trim(prop))) ? null : prop;
        }, state);
        data.append('userData', JSON.stringify(userData));
        data.append('file', file);

        try {
            let response = await axios.put('/api/users/me', data, config);
            if (response.status === 201) {
                enqueueSnackbar(formatMessage(messages.profileUpdated), { variant: 'success' });
                history.push(`/account/profile/${user.id}`);
            } else {
                enqueueSnackbar(formatMessage(messages.profileUpdateError), { variant: 'error' });
            }
        } catch (e) {
            console.log('Update user error: ', e);
            enqueueSnackbar(formatMessage(messages.profileUpdateError), { variant: 'error' });
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
    };

    return (
        <EditProfileContext.Provider value={valueState}>
            {children}
        </EditProfileContext.Provider>
    );
};

EditProfile.propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node,
    enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withRouter(EditProfile));