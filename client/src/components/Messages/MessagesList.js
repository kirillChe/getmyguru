import React from 'react';
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
    Box,
    Typography
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Chat from './Chat';
import {MessageInput} from 'components';
import { useIntl } from 'hooks';
import messages from './MessagesList.messages';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    messageInputDivider: {
        marginTop: 20,
        marginBottom: 20
    }
});

const muiBaseTheme = createMuiTheme();


const Messages = props => {
    const { formatMessage } = useIntl();
    const {
        classes,
        partners,
        dialog,
        selectedPartnerId,
        handleSubmitInput,
        handleClickPartner
    } = props;

    return (
        <React.Fragment>
            <Box component="main" maxWidth={935} margin="auto" padding="60px 20px 0">
                <Typography
                    variant="h4"
                    component="h4"
                    gutterBottom
                    align="center"
                >
                    {formatMessage(messages.title)}
                </Typography>
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
                                            <Avatar alt="avatar" src={partner.avatarLocation} />
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
                            rows={4}
                            rowsMax={8}
                            onSubmit={handleSubmitInput}
                        />
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    )
};

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
    partners: PropTypes.array.isRequired,
    dialog: PropTypes.array.isRequired,
    selectedPartnerId: PropTypes.number.isRequired,
    handleSubmitInput: PropTypes.func.isRequired,
    handleClickPartner: PropTypes.func.isRequired
};

export default withStyles(styles)(Messages);