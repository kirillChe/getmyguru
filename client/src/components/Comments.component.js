import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
    Button,
    Typography,
    Collapse,
    IconButton
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import axios from 'axios';
import * as R from 'ramda';
// import * as moment from 'moment';
import {MainContext} from '../context';


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
        width: '50%',
        backgroundColor: theme.palette.background.paper,
    },
    comment: {
        margin: '0 0 0 2em',
    },
});

const Comments = (props) => {
    const { classes } = props;
    const { defaultUserAvatar } = useContext(MainContext);
    const [comments, setComments] = useState([]);
    const profileId = R.split('/', window.location.pathname)[3];

    const [openComments, setOpenComments] = React.useState({});

    function handleClick(commentId) {
        return () => {
            console.log('Comments.component.js :44', commentId);
            setOpenComments({...openComments, [commentId]: !openComments[commentId]});
        }
    }

    async function getCommentsTree(profileId) {
        try {
            let response = await axios.get(`/api/comments/commentsTree?ownerId=${profileId}`);

            if (response.data) {
                setComments(response.data);
                setOpenComments(R.map(com => ({[com.id]: false}), response.data));
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
                                <Avatar alt="Remy Sharp" src={comment.userAvatarLocation || defaultUserAvatar[comment.userGender]} />
                            </ListItemAvatar>
                            {/*<ListItemText*/}
                            {/*    primary={comment.userName}*/}
                            {/*    secondary={comment.text}*/}
                            {/*/>*/}
                            <div className={classes.commentText}>
                                {/*<Typography>*/}
                                {/*    {comment.userName} {moment(comment.date).format('LLLL')}*/}
                                {/*    {comment.text}*/}
                                {/*</Typography>*/}

                            </div>
                            <IconButton aria-label="Expand" onClick={handleClick(comment.id)}>
                                {openComments[comment.id] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>

                        {comment.children && comment.children.length > 0 &&
                        <Collapse in={openComments[comment.id]} timeout="auto" unmountOnExit>
                            <List className={classes.root}>
                                {comment.children.map(childComment => (
                                    <div className={classes.comment} key={"comment-" + childComment.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp"
                                                        src={childComment.userAvatarLocation || defaultUserAvatar[childComment.userGender]}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={childComment.userName}
                                                secondary={childComment.text}
                                            />

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
                <div className="field">
                    <TextField
                        id="reply"
                        name="reply"
                        variant="outlined"
                        multiline={true}
                        rows="5"
                        rowsMax="7"
                        fullWidth={true}
                    />
                </div>
                <Button variant="contained" color="primary" className={classes.button}>
                    Add Reply
                </Button>
            </form>
        </div>
    );
};

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Comments);