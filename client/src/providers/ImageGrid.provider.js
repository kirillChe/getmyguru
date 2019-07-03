import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import * as R from 'ramda';
import axios from 'axios';
import { useIntl } from 'hooks';
import { withSnackbar } from 'notistack';

import messages from './ImageGrid.messages';
import {MainContext, ImageGridContext} from 'context';

const ImageGrid = (props) => {
    const {
        children,
        history,
        enqueueSnackbar,
        rawFilters,
        customFilter,
        attr
    } = props;
    const { formatMessage } = useIntl();
    const { defaultUserAvatar, loggedIn } = useContext(MainContext);
    const [users, setUsers] = useState([]);

    function handleClickCard (profileId) {
        return () => {
            if (loggedIn) {
                console.log('Go to profile: ', profileId);
                history.push(`/account/profile/${profileId}`);
            } else {
                console.log('ImageGrid.js :61: user is not logged in');
                enqueueSnackbar(formatMessage(messages.userNotLoggedIn), { variant: 'warning', preventDuplicate: true });
            }
        }
    }

    useEffect(() => {
        async function getGuruProfiles() {
            let params = {};

            if (customFilter) {
                params = {
                    _limit: 20,
                    _order: 'DESC',
                    _sort: 'createdAt',
                    _page: 1,
                    rawFilters
                };
            } else {
                params = {
                    _limit: 4,
                    _order: 'DESC',
                    _sort: attr === 'last' ? 'createdAt' : 'rating',
                    _page: 1
                };
            }

            try {
                let response = await axios.get('/api/users/getGurusPreviews', {params});

                if (response.data) {
                    let users = R.map(user => {
                        if (!user.avatarLocation)
                            user.avatarLocation = defaultUserAvatar[user.gender];

                        return user;
                    }, response.data);

                    setUsers(users);
                } else {
                    console.log('Get users: no users');
                }
            }catch (e) {
                console.log('Show image grid error: ');
                console.log(e);
            }
        }

        getGuruProfiles();
    }, [defaultUserAvatar, attr, customFilter, rawFilters]);

    const state = {
        users,
        handleClickCard
    };

    return (
        <ImageGridContext.Provider value={state}>
            {children}
        </ImageGridContext.Provider>
    );
};

ImageGrid.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node,
    enqueueSnackbar: PropTypes.func.isRequired,
    rawFilters: PropTypes.object,
    customFilter: PropTypes.object,
    attr: PropTypes.string,
};

export default withSnackbar(withRouter(ImageGrid));