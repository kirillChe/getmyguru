import React, { PureComponent } from "react";
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import axios from 'axios';

import { MainContext } from '../context';


class MainProvider extends PureComponent {

    static propTypes = {
        children: PropTypes.node,
        history: PropTypes.object
    };

    updateUser = (state) => {
        this.setState(state);
        console.log('Main.provider.js :18', this.state.user, state);
    };

    async getUserData() {
        let {data: user} = await axios.get('/auth/isLoggedIn');
        console.log('Get User: There is a user saved in the server session: ', user);
        if (!user) {
            this.setState({
                loggedIn: false,
                loading: false,
                user: {}
            });
        }
        else if (!this.state.loggedIn) {
            this.setState({
                loggedIn: true,
                loading: false,
                user
            })
        }
    }

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
    }

    state = {
        loggedIn: false,
        user: {},
        updateUser: this.updateUser,
        loading: true
    };

    render() {
        let {children} = this.props;
        return (
            <MainContext.Provider value={this.state}>{children}</MainContext.Provider>
        );
    }
}

export default withRouter(MainProvider);
