import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import useForceUpdate from 'use-force-update';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from "socket.io-client";

import { ProfileContext, MainContext } from 'context';


const Profile = ({children, history}) => {
    const forceUpdate = useForceUpdate();
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [profile, setProfile] = useState({});
    const [avatarLocation, setAvatarLocation] = useState('');
    const { defaultUserAvatar, user } = useContext(MainContext);
    // "/account/profile/{profileId}"
    const profileId = R.split('/', window.location.pathname)[3];

    function handleClickEdit () {
        // event.preventDefault();
        console.log('Go to edit profile');
        history.push({
            pathname: `/account/profile/${user.id}/edit`,
            state: profile
        });
    }

    function handleSubmitInput (text) {
        const socket = socketIOClient('/');
        let data = {
            senderId: user.id,
            receiverId: profileId,
            text
        };
        socket.emit('NEW_MESSAGE', data);
        setShowMessageInput(false);
    }

    function submitRateUser(value) {
        return async() => {
            try {
                let data = {
                    userId: profileId,
                    raterId: user.id,
                    value
                };
                const response = await axios.post('/api/ratings', data);
                //@todo appear message that it is ok
                console.log('___________________');
                console.log(response.data);
                console.log('___________________');
                forceUpdate();

            } catch (e) {
                console.log('Profile.js : cannot rate user: ', e);
                throw e;
            }
        }
    }

    useEffect(() => {
        async function getProfile(id) {
            try {
                const response = await axios.get(`/api/users/userProfile/${id}`);
                setProfile(response.data);
                setAvatarLocation(response.data.avatarLocation || defaultUserAvatar[response.data.gender]);
            } catch (e) {
                console.log('Profile.js : cannot get profile: ', e);
                throw e;
            }
        }

        getProfile(profileId);
    }, [profileId, defaultUserAvatar]);

    const state = {
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        handleClickEdit,
        handleSubmitInput,
        submitRateUser,
    };

    return (
        <ProfileContext.Provider value={state}>
            {children}
        </ProfileContext.Provider>);
};

Profile.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node
};

export default withRouter(Profile);