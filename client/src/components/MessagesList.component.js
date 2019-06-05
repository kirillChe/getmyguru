import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    List,
    Grid,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Box
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import {Chat, MessageInput} from '.';
import axios from 'axios';
import * as R from 'ramda';
import socketIOClient from "socket.io-client";
import {MainContext} from "../context";

const socket = socketIOClient('192.168.68.123:5000');
const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    messageInputDivider: {
        marginTop: 20,
        marginBottom: 20
    }
});

const muiBaseTheme = createMuiTheme();


class MessagesList extends Component{
    static contextType = MainContext;

    state = {
        partners: [],
        dialog: [],
        selectedPartnerId: 0
    };

    handleSubmitInput = text => {
        let data = {
            userId: this.context.user.id,
            receiver: this.state.selectedPartnerId,
            text
        };
        socket.on(`${this.context.user.id}_MESSAGE_SAVED`, userId => {
            this.getConversationPartners();
        });
        socket.emit('NEW_MESSAGE', data);
    };

    handleClickPartner (partnerId) {
        return event => {
            // event.preventDefault();
            this.setState({selectedPartnerId: partnerId});
            this.getConversation(partnerId);
        }
    }

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
        // const socket = socketIOClient('192.168.68.123:5000');
        socket.on(`${this.context.user.id}_GOT_NEW_MESSAGE`, (userId) => {
            this.getConversationPartners();
        });
    }

    componentDidMount() {
        this.getConversationPartners();
        this.initSocketListener();
    }

    render() {
        const { classes } = this.props;
        let {partners, dialog, selectedPartnerId} = this.state;
        return (
            <React.Fragment>
                <Box component="main" maxWidth={935} margin="auto" padding="60px 20px 0">
                    <Grid container>
                        <Grid item xs={4}>
                            <List className={classes.root}>
                                {partners.map(partner => (
                                    <div key={"partner-" + partner.id}>
                                        <ListItem
                                            selected={selectedPartnerId === partner.id}
                                            button
                                            alignItems="flex-start"
                                            onClick={this.handleClickPartner(partner.id)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={partner.avatarLocation} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={partner.fullName}
                                                secondary={partner.message}
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </div>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={8}>
                            <ThemeProvider theme={muiBaseTheme}>
                                <div>
                                    {dialog.map(d => {
                                        return (
                                            <Chat
                                                uniqKey={"dialog-"+d.id}
                                                key={"dialog-"+d.id}
                                                side={d.right ? "right" : "left"}
                                                messages={[d.text]}
                                            />
                                        )})}
                                </div>
                            </ThemeProvider>
                            <Divider className={classes.messageInputDivider} variant="fullWidth" />
                            <MessageInput
                                onSubmit={this.handleSubmitInput}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </React.Fragment>
        )
    }
}

MessagesList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessagesList);