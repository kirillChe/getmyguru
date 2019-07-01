import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MainContext } from 'context';

import axios from 'axios';
import * as R from 'ramda';
import countries from 'i18n-iso-countries';

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));


class Main extends PureComponent {

    static propTypes = {
        children: PropTypes.node,
        history: PropTypes.object
    };

    getBrowserLanguage = () => R.slice(0,2, navigator.language);

    // getCountriesList = lang => Object.entries(countries.getNames(lang));
    getCountriesList = lang => countries.getNames(lang);

    updateUser = (state) => {
        this.setState(state);
        console.log('Main.js :18', this.state.user, state);
    };

    getUserCountry = async () => {
        try {
            let response = await axios.get('https://ipinfo.io/');
            this.setState({
                countryCode: response.data.country
            });
        } catch (e) {
            console.log('Cannot get user country code', e);
        }
    };

    getUserData = async () => {
        let response = await axios.get('/auth/isLoggedIn');
        console.log('Get User: There is a user saved in the server session: ', response && response.data);

        if (response.status === 200 && response.data) {
            if (!this.state.loggedIn) {
                this.setState({
                    language: response.data.language,
                    countriesList: this.getCountriesList(response.data.language),
                    loggedIn: true,
                    loading: false,
                    user: response.data
                })
            }
        } else {
            this.setState({
                loggedIn: true,
                loading: false,
                user: {}
            });
        }
    };

    async componentDidMount() {
        try {
            await this.getUserData();
        } catch (error) {
            console.log('Get user: no user: ', error);
            this.setState({
                loggedIn: false,
                loading: false,
                user: {}
            });
        }
        if (!this.state.loggedIn)
            await this.getUserCountry();
    }

    state = {
        countryCode: '',
        language: this.getBrowserLanguage(),
        countriesList: this.getCountriesList(this.getBrowserLanguage()),
        loggedIn: false,
        user: {},
        updateUser: this.updateUser,
        loading: true,
        allowedLanguages: ['en', 'ru'],
        //@todo buy images when time came
        defaultUserAvatar: {
            male: 'https://thumbs.dreamstime.com/z/default-placeholder-fitness-trainer-t-shirt-half-length-portrait-photo-avatar-gray-color-default-placeholder-fitness-trainer-116470280.jpg',
            female: 'https://thumbs.dreamstime.com/z/default-placeholder-fitness-trainer-t-shirt-default-placeholder-fitness-trainer-t-shirt-half-length-portrait-photo-119457655.jpg'
        }
    };

    render() {
        let {children} = this.props;
        return (
            <MainContext.Provider value={this.state}>{children}</MainContext.Provider>
        );
    }
}

export default withRouter(Main);