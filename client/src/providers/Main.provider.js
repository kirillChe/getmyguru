import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import * as R from 'ramda';
import countries from 'i18n-iso-countries';
import { IntlProvider, addLocaleData } from 'react-intl';
import ru from 'react-intl/locale-data/ru';

import { IntlContextProvider } from 'providers';
import { MainContext } from 'context';
import { Error } from 'pages';
import translations from 'i18n/locales';

addLocaleData([...ru]);

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/ru.json"));


class MainProvider extends PureComponent {

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

    updateMainState = (state) => {
        this.setState(state);
    };

    changeUserLanguage = async () => {
        let newLang = this.state.language === 'en' ? 'ru' : 'en';
        if (this.state.loggedIn) {
            try {
                let response = await axios.put('/api/users/changeLanguage', {language: newLang});

                if (response.status === 204) {
                    this.setState({
                        language: newLang
                    });
                }
            } catch (e) {
                console.log('Cannot change user language', e);
            }
        } else {
            this.setState({language: newLang});
        }
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
        changeUserLanguage: this.changeUserLanguage,
        showLogin: false,
        countryCode: '',
        language: 'en',
        countriesList: [],
        loggedIn: false,
        user: {},
        error: '',
        updateMainState: this.updateMainState,
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
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                hideIconVariant={true}
                maxSnack={3}
            >
                <IntlProvider locale={language} key={language} messages={messages}>
                    <IntlContextProvider>
                        <MainContext.Provider value={this.state}>{children}</MainContext.Provider>
                    </IntlContextProvider>
                </IntlProvider>
            </SnackbarProvider>
        ) : null
    }
}

export default withRouter(MainProvider);