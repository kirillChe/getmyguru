import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
// import PeaIcon from '@material-ui/icons/AttachFile';
import EmojiIcon from '@material-ui/icons/InsertEmoticon';
import Send from '@material-ui/icons/Send';
import {
    InputAdornment,
    ClickAwayListener,
    Grid,
    Input
} from '@material-ui/core';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { useIntl } from 'hooks';
import messages from './MessageInput.messages';

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    icon: {
        width: 24,
        height: 24,
        cursor: 'pointer',
        color: '#B7B6BC',
        '&:hover': {
            opacity: 0.8,
        },
    },
    inputRoot: {
        borderRadius: 5,
        backgroundColor: '#F2F2F4',
        padding: '5px 10px',
        '& input': {
            fontSize: 14,
            paddingLeft: 10,
        },
    },
    fileInput: {
        display: 'none',
    },
}));

const noop = () => false;

const MessageInput = ({ onChange, onSubmit, onUpload, rows, rowsMax }) => {
    const { formatMessage } = useIntl();
    const classes = useStyles();
    const [inputValue, onInputChange] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);

    const handleChange = e => {
        const { value: v } = e.target;
        onInputChange(v);
        onChange(v);
    };
    const toggleEmoji = () => setShowEmoji(!showEmoji);
    const handleSubmit = async () => {
        try {
            await onSubmit(inputValue);
            onInputChange('');

        }catch (e) {
            console.log('MessageInput.component.js :67', e);
        }
    };
    const onEmojiSelect = e => {
        handleChange({
            target: {
                value: inputValue + e.native,
            },
        });
    };

    return (
        <Grid
            container
            spacing={1}
            alignItems="center"
            classes={{ container: classes.root }}
        >
            {showEmoji && (
                <ClickAwayListener onClickAway={toggleEmoji}>
                    <Grid item xs={12}>
                        <Picker
                            set="emojione"
                            style={{
                                bottom: 50,
                                width: '100%',
                                left: 0,
                            }}
                            showPreview={false}
                            showSkinTones={false}
                            onSelect={onEmojiSelect}
                        />
                    </Grid>
                </ClickAwayListener>
            )}
            {/*<Grid item>*/}
            {/*    <label htmlFor="pea-message-input-upload">*/}
            {/*        <input*/}
            {/*            className={classes.fileInput}*/}
            {/*            id="pea-message-input-upload"*/}
            {/*            type="file"*/}
            {/*            accept="image/*"*/}
            {/*            onChange={onUpload}*/}
            {/*        />*/}
            {/*        <PeaIcon className={classes.icon} />*/}
            {/*    </label>*/}
            {/*</Grid>*/}
            <Grid item classes={{ item: classes.flex }} container>
                <Input
                    multiline={true}
                    rows={rows}
                    rowsMax={rowsMax}
                    fullWidth
                    disableUnderline
                    classes={{ root: classes.inputRoot }}
                    margin="none"
                    variant="outlined"
                    onChange={handleChange}
                    value={inputValue}
                    placeholder={formatMessage(messages.inputPlaceholder)}
                    endAdornment={
                        <InputAdornment position="end">
                            <EmojiIcon className={classes.icon} onClick={toggleEmoji} />
                        </InputAdornment>
                    }
                />
            </Grid>
            <Grid item>
                <Send
                    className={classes.icon}
                    onClick={handleSubmit}
                />
            </Grid>
        </Grid>
    );
};

MessageInput.propTypes = {
    onChange: PropTypes.func,
    onUpload: PropTypes.func,
    onSubmit: PropTypes.func,
};
MessageInput.defaultProps = {
    onChange: noop,
    onUpload: noop,
    onSubmit: noop,
};
MessageInput.metadata = {
    name: 'Pea Message input',
};
MessageInput.getTheme = () => ({
    'Mui{Component}': {
        // this object will be injected to 'overrides' section
        root: {},
        // ...
    },
});

export default MessageInput;