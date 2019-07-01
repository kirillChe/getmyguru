import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import useForceUpdate from 'use-force-update';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import {useDropzone} from 'react-dropzone';

import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from "socket.io-client";

import { ProfileContext, MainContext } from 'context';


const Profile = ({children, history}) => {
    const forceUpdate = useForceUpdate();
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [profile, setProfile] = useState({});
    const [profileImages, setProfileImages] = useState([]);
    const [avatarLocation, setAvatarLocation] = useState('');
    const { defaultUserAvatar, user } = useContext(MainContext);
    // "/account/profile/{profileId}"
    const profileId = R.split('/', window.location.pathname)[3];

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: async acceptedFiles => {
            console.log('upload images', acceptedFiles);
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const data = new FormData();

            acceptedFiles.map(file => {
                data.append('File[]', file);
            });
            try {
                let response = await axios.post('/api/files/upload/me', data, config);
                if (response && response.status === 200)
                    getUserImages();
            }catch (e) {
                console.log('Upload images error: ');
                console.log(e);
            }
        }
    });
    function removeImage (imageId) {
        return async () => {
            try {
                let response = await axios.delete(`/api/files/${imageId}`);
                if (response && response.status === 204)
                    getUserImages();
            }catch (e) {
                console.log('Remove image error: ');
                console.log(e);
            }
        }
    }

    function handleClickEdit () {
        console.log('Go to edit profile');
        history.push({
            pathname: `/account/profile/${user.id}/edit`,
            state: R.merge(profile, {avatarLocation})
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

    async function getUserImages () {
        try {
            const response = await axios.get(`/api/files/userImages/${profileId}`);
            if (response.status === 200) {
                setProfileImages(response.data);
            }
        } catch (e) {
            console.log('Profile.js : cannot get use images: ', e);
            throw e;
        }
    }

    async function getProfile(id) {
        try {
            const response = await axios.get(`/api/users/userProfile/${id}`);
            setProfile(response.data);
            setAvatarLocation(response.data.avatarLocation || defaultUserAvatar[response.data.gender || 'male']);
        } catch (e) {
            console.log('Profile.js : cannot get profile: ', e);
            throw e;
        }
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
        getProfile(profileId);
        getUserImages();
    }, [profileId, defaultUserAvatar]);

    const state = {
        showMessageInput,
        setShowMessageInput,
        tabIndex,
        setTabIndex,
        profile,
        avatarLocation,
        profileImages,
        handleClickEdit,
        handleSubmitInput,
        submitRateUser,
        getRootProps,
        getInputProps,
        removeImage
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