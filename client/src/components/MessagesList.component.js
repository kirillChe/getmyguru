import React, {useEffect, useState, useContext} from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
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
}));

const muiBaseTheme = createMuiTheme();

const MessagesList = () => {
    const classes = useStyles();
    const { user } = useContext(MainContext);
    const [partners, setPartners] = useState([]);
    const [dialog, setDialog] = useState([]);
    const [selectedPartnerId, setSelectedPartnerId] = useState(0);


    useEffect(() => {
        getConversation(selectedPartnerId);
    }, [selectedPartnerId])

    async function handleSubmitInput (text) {
        console.log('handleSubmitInput', text);
        const socket = socketIOClient('192.168.68.123:5000');

        let data = {
            userId: user.id,
            receiver: selectedPartnerId,
            text
        };
        socket.emit('message created', data); // change 'red' to this.state.color
        getConversationPartners();


        // try {
        //     let data = {
        //         receiver: selectedPartnerId,
        //         text
        //     };
        //
        //     let response = await axios.post('/api/messages', data);
        //
        //     if (response.data) {
        //         console.log('MessagesList.component.js :54', response.data);
        //
        //         getConversationPartners();
        //     } else {
        //         console.log('Handle submit: error');
        //     }
        // }catch (e) {
        //     console.log('Get conversation error: ');
        //     console.log(e);
        // }
    }

    function handleClickPartner (partnerId) {
        return async event => {
            event.preventDefault();
            console.log('handleClickPartner');
            setSelectedPartnerId(partnerId);
            getConversation(partnerId);
        }
    }

    async function getConversation(partnerId) {
        console.log('MessageList.component.js :42', partnerId);
        console.log('Open conversation');
        try {
            let response = await axios.get(`/api/messages/conversation?partnerId=${partnerId}`);

            if (response.data) {
                console.log('Get conversation: ', response.data);

                setDialog(response.data);
            } else {
                console.log('Get conversation: no conversation');
            }
        }catch (e) {
            console.log('Get conversation error: ');
            console.log(e);
        }
    }

    async function getConversationPartners() {
        const socket = socketIOClient('192.168.68.123:5000');

        try {
            let response = await axios.get('/api/messages/conversationsPartners');

            if (response.data) {
                console.log('MessagesList.component.js :80', response.data);

                setPartners(response.data);
                let lastPartner;

                if (!selectedPartnerId) {
                    lastPartner = R.head(response.data);
                    // mark partner item as selected
                    setSelectedPartnerId(lastPartner.id);
                }





                // setInterval(this.send(), 1000)
                socket.on('111', (id) => {
                    console.log('_________________HERE: 108________________________', id);
                });

                // set default opened dialog








                //
                // setPartners(response.data);
                // let lastPartner = R.head(response.data);
                // // mark partner item as selected
                // setSelectedPartnerId(lastPartner.id);
                // // set default opened dialog
                // getConversation(lastPartner.id);

            } else {
                console.log('Get conversation partners: no partners');
            }
        }catch (e) {
            console.log('Get conversation partners error: ');
            console.log(e);
        }
    }

    async function initSocketListener() {
        const socket = socketIOClient('192.168.68.123:5000');
        socket.on(`${user.id}-chat`, (id) => {
            console.log('_________________HERE: 108________________________', id);
            getConversationPartners();
        });
    }

    useEffect(() => {
        getConversationPartners();
        initSocketListener();
    }, []);

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
                                        onClick={handleClickPartner(partner.id)}
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
                            onSubmit={handleSubmitInput}
                        />
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default MessagesList;