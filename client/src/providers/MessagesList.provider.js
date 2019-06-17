import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { MessagesContext, MainContext } from 'context';

import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from "socket.io-client";
const socket = socketIOClient('/');


class MessagesList extends Component{
    static contextType = MainContext;

    static propTypes = {
        children: PropTypes.node,
        history: ReactRouterPropTypes.history.isRequired
    };


    handleSubmitInput = text => {
        let data = {
            senderId: this.context.user.id,
            receiverId: this.state.selectedPartnerId,
            text
        };
        socket.on('MESSAGE_SAVED', () => {
            this.getConversationPartners();
        });
        socket.emit('NEW_MESSAGE', data);
    };

    handleClickPartner = partnerId => {
        return () => {
            this.setState({selectedPartnerId: partnerId});
            this.getConversation(partnerId);
        }
    };

    async getConversation(partnerId) {
        try {
            let response = await axios.get(`/api/messages/conversation?partnerId=${partnerId || this.state.selectedPartnerId}`);

            if (response.data) {
                this.setState({dialog: response.data});
            } else {
                console.log('Get conversation: no conversation');
            }
        }catch (e) {
            console.log('Get conversation error: ');
            console.log(e);
        }
    }

    async getConversationPartners() {
        try {
            let response = await axios.get('/api/messages/conversationsPartners');
            console.log('_________________HERE: 59________________________', response.data);

            if (response.data) {
                this.setState({partners: response.data});

                if (!this.state.selectedPartnerId) {
                    let lastPartner = R.head(response.data);
                    let partnerId = lastPartner.id;
                    // mark partner item as selected
                    this.setState({selectedPartnerId: partnerId});
                }
                this.getConversation();

            } else {
                console.log('Get conversation partners: no partners');
            }
        }catch (e) {
            console.log('Get conversation partners error: ');
            console.log(e);
        }
    }

    initSocketListener() {
        socket.emit('room', this.context.user.id);
        socket.on('GOT_NEW_MESSAGE', () => {
            this.getConversationPartners();
        });
    }

    componentDidMount() {
        this.getConversationPartners();
        this.initSocketListener();
    }

    state = {
        partners: [],
        dialog: [],
        selectedPartnerId: 0,
        handleSubmitInput: this.handleSubmitInput,
        handleClickPartner: this.handleClickPartner
    };

    render() {
        let {children} = this.props;
        return <MessagesContext.Provider value={this.state}>{children}</MessagesContext.Provider>
    }
}

export default withRouter(MessagesList);