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
    Typography,
    Box
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import {Chat} from '.';
import {MainContext} from '../context';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

const AVATAR =
    "https://i.pinimg.com/originals/0a/dd/87/0add874e1ea0676c4365b2dd7ddd32e3.jpg";
const muiBaseTheme = createMuiTheme();

const MessagesList = () => {
    const classes = useStyles();

    const { defaultUserAvatar, user } = useContext(MainContext);
    const [partners, setPartners] = useState([]);
    const [dialog, setDialog] = useState([]);

    function handleClickPartner (partnerId) {
        return async event => {
            console.log('MessageList.component.js :42', partnerId);
            event.preventDefault();
            console.log('Open conversation');
            try {
                let response = await axios.get(`/api/messages/conversation?partnerId=${partnerId}`);

                if (response.data) {
                    console.log('MessagesList.component.js :53', response.data);

                    setDialog(response.data);
                } else {
                    console.log('Get conversation: no conversation');
                }
            }catch (e) {
                console.log('Get conversation error: ');
                console.log(e);
            }
        }
    }

    async function getConversationPartners() {

        try {
            let response = await axios.get('/api/messages/conversationsPartners');

            if (response.data) {
                console.log('MessagesList.component.js :80', response.data);

                setPartners(response.data);
            } else {
                console.log('Get conversation partners: no partners');
            }
        }catch (e) {
            console.log('Get conversation partners error: ');
            console.log(e);
        }
    }

    useEffect(() => {
        getConversationPartners();
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
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default MessagesList;