import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    List,
    Typography,
    Collapse
} from '@material-ui/core';

import axios from 'axios';
import * as R from 'ramda';
import { MessageInput } from 'components';
import SingleComment from './SingleComment';
import {MainContext} from 'context';
import { useIntl } from 'hooks';
import messages from './Comments.messages';


const styles = theme => ({
    textArea: {
        width: '60%',
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: '100%',
    },
    list: {
        width: '60%',
        backgroundColor: theme.palette.background.paper,
    },
    childComment: {
        margin: '0 0 0 2em',
    },
});

const Comments = (props) => {
    const { user } = useContext(MainContext);
    const { formatMessage } = useIntl();
    const {
        classes,
        profileId
    } = props;
    const [comments, setComments] = useState([]);
    const [openComments, setOpenComments] = useState({});



    function handleSubmitInput (receiverId, parentId) {
        return async (text) => {
            if (R.isEmpty(R.trim(text))) {
                //@todo handle it
                console.log('You try to send empty comment!');
                return;
            }
            let data = {
                ownerId: profileId,
                senderId: user.id,
                receiverId: receiverId || profileId,
                parentId: parentId || null,
                text
            };
            try {
                let response = await axios.post('/api/comments', data);

                if (response.data) {
                    getCommentsTree(profileId);

                } else {
                    console.log('Post comment: did not save');
                }
            }catch (e) {
                console.log('Save comment error: ');
                console.log(e);
            }
        }
    }

    function handleClickExpand(commentId) {
        return () => {
            setOpenComments({...openComments, [commentId]: !openComments[commentId]});
        }
    }

    async function getCommentsTree(profileId) {
        try {
            let response = await axios.get(`/api/comments/commentsTree?ownerId=${profileId}`);

            if (response.data) {
                setComments(response.data);

                setOpenComments(R.pipe(
                    R.map(com => ({[com.id]: false})),
                    R.mergeAll
                )(response.data));

            } else {
                console.log('Get comments: no comments');
            }
        }catch (e) {
            console.log('Show comments error: ');
            console.log(e);
        }
    }

    useEffect(() => {
        getCommentsTree(profileId);
    }, [profileId]);

    return (
        <div className={classes.root}>
            <Typography
                variant="h4"
                component="h4"
                gutterBottom
            >
                {formatMessage(messages.commentsTitle)}
            </Typography>
            <List className={classes.list}>
                {comments.map(comment => (
                    <div key={"comment-" + comment.id}>
                        <SingleComment
                            handleSubmitInput={handleSubmitInput(comment.senderId, comment.id)}
                            handleClickExpand={handleClickExpand}
                            comment={comment}
                            profileId={profileId}
                            openComments={openComments}
                        />

                        {comment.children && comment.children.length > 0 &&
                        <Collapse
                            in={openComments[comment.id]}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List>
                                {comment.children.map(childComment => (
                                    <div className={classes.childComment} key={"comment-" + childComment.id}>
                                        <SingleComment
                                            handleSubmitInput={handleSubmitInput(childComment.senderId, comment.id)}
                                            handleClickExpand={handleClickExpand}
                                            comment={childComment}
                                            profileId={profileId}
                                            openComments={openComments}
                                        />
                                    </div>
                                ))}
                            </List>
                        </Collapse>
                        }
                    </div>
                ))}
            </List>
            {profileId !== user.id &&
                <div className={classes.textArea}>
                    <MessageInput
                        onSubmit={handleSubmitInput()}
                        rows={3}
                        rowsMax={8}
                    />
                </div>
            }
        </div>
    );
};

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
    profileId: PropTypes.number.isRequired
};

export default withStyles(styles)(Comments);