import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import * as R from 'ramda';

import { MainContext, EditProfileContext } from 'context';

const ages = R.range(14, 100);

const EditProfile = ({children, history}) => {
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
    const [avatarLocation, setAvatarLocation] = useState(defaultUserAvatar[user.gender]);

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

    const state = {
        allowedLanguages,
        submitError,
        values,
        avatarLocation,
        validateForm,
        handleInputChange,
        handleAvatarChange,
        handleSubmit,
        ages
    };

    return (
        <EditProfileContext.Provider value={state}>
            {children}
        </EditProfileContext.Provider>
    );
};

EditProfile.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node
};

export default withRouter(EditProfile);