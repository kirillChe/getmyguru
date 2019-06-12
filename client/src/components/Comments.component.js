import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    TextField,
    Button,
    Typography,
    Collapse,
    IconButton,
    Link
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import axios from 'axios';
import * as R from 'ramda';
import * as moment from 'moment';
import {MainContext} from '../context';
import {MessageInput} from ".";


const styles = theme => ({
    textArea: {
        width: '60%',
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: '100%',
    },
    commentText: {
        'margin-top': '6px',
        'margin-bottom': '6px',
    },
    list: {
        width: '60%',
        backgroundColor: theme.palette.background.paper,
    },
    comment: {
        margin: '0 0 0 2em',
    },
});

const Comments = (props) => {
    const { classes } = props;
    const { defaultUserAvatar, user } = useContext(MainContext);
    const [comments, setComments] = useState([]);
    const profileId = R.split('/', window.location.pathname)[3];

    const [openComments, setOpenComments] = React.useState({});

    function handleSubmitInput (receiverId, parentId) {
        return async (text) => {
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

    function handleClick(commentId) {
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
                Comments
            </Typography>
            <List className={classes.list}>
                {comments.map(comment => (
                    <div key={"comment-" + comment.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar
                                    alt={comment.userName}
                                    src={comment.userAvatarLocation || defaultUserAvatar[comment.userGender]}
                                />
                            </ListItemAvatar>
                            <div className={classes.commentText}>
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
                                    <Link href="" color="primary" >
                                        reply
                                    </Link>
                                }
                            </div>
                            {comment.children && comment.children.length > 0 &&
                                <IconButton aria-label="Expand" onClick={handleClick(comment.id)}>
                                    {openComments[comment.id] ? <ExpandLess/> : <ExpandMore/>}
                                </IconButton>
                            }
                        </ListItem>

                        {comment.children && comment.children.length > 0 &&
                            <Collapse
                                in={openComments[comment.id]}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List>
                                    {comment.children.map(childComment => (
                                        <div className={classes.comment} key={"comment-" + childComment.id}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={childComment.userName}
                                                        src={childComment.userAvatarLocation || defaultUserAvatar[childComment.userGender]}
                                                    />
                                                </ListItemAvatar>
                                                <div className={classes.commentText}>
                                                    <Link href={`/account/profile/${childComment.userId}`} color="inherit">
                                                        {childComment.userName}
                                                    </Link>
                                                    <Typography variant={"subtitle2"} align={"right"}>
                                                        {moment(childComment.date).format('LLLL')}
                                                    </Typography>
                                                    <Typography variant={"body2"}>
                                                        {childComment.text}
                                                    </Typography>
                                                    {(
                                                        (profileId === user.id && childComment.userId !== user.id) ||
                                                        (comment.userId === user.id && childComment.userId !== user.id)
                                                    ) &&
                                                        <Link href="" color="primary" >
                                                            reply
                                                        </Link>
                                                    }
                                                </div>
                                            </ListItem>
                                        </div>
                                    ))}
                                </List>
                            </Collapse>
                        }
                    </div>
                ))}
            </List>
            <form className={classes.textArea}>
                {/*<div className="field">*/}
                {/*    <TextField*/}
                {/*        id="reply"*/}
                {/*        name="reply"*/}
                {/*        variant="outlined"*/}
                {/*        multiline={true}*/}
                {/*        rows="5"*/}
                {/*        rowsMax="7"*/}
                {/*        fullWidth={true}*/}
                {/*    />*/}
                {/*</div>*/}
                <MessageInput
                    onSubmit={handleSubmitInput()}
                />
                {/*<Button variant="contained" color="primary" className={classes.button}>*/}
                {/*    Add Reply*/}
                {/*</Button>*/}
            </form>
        </div>
    );
};

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comments);