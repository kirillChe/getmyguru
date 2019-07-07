import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { MessagesContext, MainContext } from 'context';
import { injectIntl, intlShape } from 'react-intl';

import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from 'socket.io-client';
import messages from './MessagesList.messages';
const socket = socketIOClient('/');


class MessagesList extends Component{
    static contextType = MainContext;

    handleSubmitInput = text => {
        if (R.isEmpty(R.trim(text))) {
            //@todo handle it
            console.log('You try to send empty message!');
            return;
        }
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

    getConversation = async partnerId => {
        try {
            let response = await axios.get(`/api/messages/conversation?partnerId=${partnerId || this.state.selectedPartnerId}`);

            if (response.data) {
                this.setState({dialog: response.data});
            } else {
                console.log('Get conversation: no conversation');
                this.props.enqueueSnackbar(this.props.intl.formatMessage(messages.getConversationError), { variant: 'error' });
            }
        }catch (e) {
            console.log('Get conversation error: ', e);
            this.props.enqueueSnackbar(this.props.intl.formatMessage(messages.getConversationError), { variant: 'error' });
        }
    };

    async getConversationPartners() {
        try {
            let response = await axios.get('/api/messages/conversationsPartners');

            if (response.status === 200 && response.data && response.data.length > 0) {
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
            this.props.enqueueSnackbar(this.props.intl.formatMessage(messages.getConversationPartnersError), { variant: 'error' });
            console.log('Get conversation partners error: ', e);
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

MessagesList.propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    children: PropTypes.node,
    intl: intlShape,
};

export default withRouter(injectIntl(MessagesList));