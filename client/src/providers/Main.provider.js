import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as R from 'ramda';
import { IntlProvider } from 'react-intl';
import countries from 'i18n-iso-countries';

import { IntlContextProvider } from 'providers';
import { MainContext } from 'context';
import { Error } from 'pages';

import translations from '../i18n/locales'

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));


class Main extends PureComponent {

    static propTypes = {
        children: PropTypes.node,
        history: PropTypes.object
    };

    getCountriesList = () => {
        const {language} = this.state;
        if (language) {
            let countriesList = countries.getNames(language);
            this.setState({countriesList});
        }
    };

    getBrowserLanguage = () => {
        let lang = R.slice(0,2, navigator.language);
        this.setState(
            {
                language: lang
            },
            () => this.getCountriesList()
        );
    };

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

        //@TODO CHANGE RETURNED USER DATA (There is no countryCode)
        if (response.status === 200 && response.data) {
            this.setState(
                {
                    language: response.data.language,
                    loggedIn: true,
                    loading: false,
                    user: response.data
                },
                () => this.getCountriesList()
            );
        }
    };

    async componentDidMount() {
        try {
            await this.getUserData();
        } catch (error) {
            console.log('Get user: no user: ', error);
        }
        if (!this.state.loggedIn) {
            this.setState(
                {
                    loggedIn: false,
                    loading: false,
                    user: {}
                },
                async() => {
                    await this.getUserCountry();
                    await this.getBrowserLanguage();
                }
            );
        }
    }

    state = {
        countryCode: '',
        language: 'en',
        countriesList: [],
        loggedIn: false,
        user: {},
        error: '',
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
        const { countriesList, error, language } = this.state;
        const {children} = this.props;

        if (error)
            return <Error />;

        const messages = translations[language];

        return R.not(R.isEmpty(countriesList)) ? (
            <IntlProvider locale={language} key={language} messages={messages}>
                <IntlContextProvider>
                    <MainContext.Provider value={this.state}>{children}</MainContext.Provider>
                </IntlContextProvider>
            </IntlProvider>
        ) : null
    }
}

export default withRouter(Main);