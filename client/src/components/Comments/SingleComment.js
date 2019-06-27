import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    Link
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import * as moment from 'moment';
import { MessageInput } from 'components';
import {MainContext} from 'context';

const styles = () => ({
    text: {
        'margin-top': '6px',
        'margin-bottom': '6px',
    },
});

const SingleComment = (props) => {
    const { user, defaultUserAvatar } = useContext(MainContext);
    const {
        classes,
        handleClickExpand,
        handleSubmitInput,
        comment,
        profileId,
        openComments
    } = props;

    const [showInput, setShowInput] = useState(false);

    function handleClickReply(e) {
        e.preventDefault();
        setShowInput(!showInput);
    }

    return (
        <div>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar
                        alt={comment.userName}
                        src={comment.userAvatarLocation || defaultUserAvatar[comment.userGender]}
                    />
                </ListItemAvatar>
                <div className={classes.text}>
                    <Link href={`/account/profile/${comment.userId}`} color="inherit" >
                        {comment.userName}
                    </Link>
                    <Typography variant={"subtitle2"} align={"right"}>
                        {moment(comment.date).format('LLLL')}
                    </Typography>
                    <Typography variant={"body2"}>
                        {comment.text}
                    </Typography>
                    {profileId === user.id && comment.userId !== user.id &&
                        <Link href="" color="primary" onClick={handleClickReply} >
                            reply
                        </Link>
                    }
                </div>
                {comment.children && comment.children.length > 0 &&
                    <IconButton aria-label="Expand" onClick={handleClickExpand(comment.id)}>
                        {openComments[comment.id] ? <ExpandLess/> : <ExpandMore/>}
                    </IconButton>
                }
            </ListItem>
            {showInput &&
                <MessageInput
                    onSubmit={handleSubmitInput}
                    rows={1}
                    rowsMax={8}
                />
            }
        </div>
    );
};

SingleComment.propTypes = {
    classes: PropTypes.object.isRequired,
    handleClickExpand: PropTypes.func.isRequired,
    handleSubmitInput: PropTypes.func.isRequired,
    profileId: PropTypes.number.isRequired,
    openComments: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired
};

export default withStyles(styles)(SingleComment);