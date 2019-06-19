import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogContent,
    Slide,
    Link
} from '@material-ui/core';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import * as R from 'ramda';

import {Login, SignUp, ForgotPwd, ProfileMenu, SetNewPwd} from '../components';
import { MainContext } from '../context';


class Transition extends React.Component {
    render() {
        let props = this.props;
        return <Slide direction="down" {...props} />;
    }
}

const styles = theme => ({
    dialog: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(500 + theme.spacing(3) * 2)]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    content: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    signup: {
        marginTop: theme.spacing(3),
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

const getPathComponents = path => R.split('/', path);

class ToolbarLayout extends Component {
    static contextType = MainContext;

    constructor(props) {
        super(props);

        let pathComponents = getPathComponents(window.location.pathname);

        this.state = {
            showSetNewPwd: pathComponents && pathComponents[1] === 'reset_password',
            showEmailSent: false,
            showLogin: false,
            showSignUp: false,
            showForgotPwd: false,
            token: pathComponents && pathComponents[2]
        };

        this.handleClick = this.handleClick.bind(this);
    };

    handleClose = function (state) {
        return () => {
            this.setState({[state]: false});
        }
    };

    handleClick = function (state) {
        return (e) => {
            //hook for calling from another component
            if (e)
                e.preventDefault();
            let states = {
                showSetNewPwd: false,
                showEmailSent: false,
                showLogin: false,
                showSignUp: false,
                showForgotPwd: false
            };
            states[state] = true;
            this.setState(states);
        }
    };

    render() {
        let context = this.context;
        const { classes } = this.props;

        return (
            <AppBar position="sticky" color="default" className={classes.root}>
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Icon" href="/">
                        <FitnessIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" className={classes.grow} >
                        COMPANY
                    </Typography>
                    {context.loggedIn ? (
                        <ProfileMenu />
                    ) : (
                        <div>
                            <Button color="inherit" className='btn-link' onClick={this.handleClick('showLogin')}>
                                Login
                            </Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClick('showSignUp')}>
                                Sign Up
                            </Button>
                        </div>
                    )}
                    {/* Email sent dialog start */}
                    <Dialog
                        open={this.state.showEmailSent}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showEmailSent')}
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Email sent!
                            </Typography>
                            <div className={classes.signup}>
                                <Typography>
                                    A reset password link has been sent to you via email. Go to the mail and click the link to enter a new password.
                                </Typography>
                            </div>
                        </DialogContent>
                    </Dialog>
                     {/*Email sent dialog end*/}
                     {/*Sign up dialog start*/}
                    <Dialog
                        open={this.state.showSignUp}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showSignUp')}
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Sign Up
                            </Typography>
                            <SignUp dialogClick={this.handleClick('showLogin')} />
                            <div className={classes.signup}>
                                <Typography>
                                    Already have an account?
                                    <Link
                                        href=""
                                        className={classes.link}
                                        onClick={this.handleClick('showLogin')}
                                    >
                                        Log in
                                    </Link>
                                </Typography>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* Sign up dialog end */}
                    {/* Set new pwd dialog start */}
                    <Dialog
                        open={this.state.showSetNewPwd}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showSetNewPwd')}
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Set new password
                            </Typography>
                            <SetNewPwd token={this.state.token} dialogClick={this.handleClick('showLogin')} />
                        </DialogContent>
                    </Dialog>
                    {/* Set new pwd dialog end */}
                    {/* Login dialog start */}
                    <Dialog
                        open={this.state.showLogin}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showLogin')}
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Login
                            </Typography>
                            <Login loggedIn={context.loggedIn}/>
                            <div className={classes.signup}>
                                <Link
                                    href=""
                                    className={classes.link}
                                    onClick={this.handleClick('showForgotPwd')}>
                                    Forgot password?
                                </Link>
                                <br/>
                                <Typography>
                                    Do not have an account yet?
                                    <Link
                                        href=""
                                        className={classes.link}
                                        onClick={this.handleClick('showSignUp')}
                                    >
                                        Sign Up
                                    </Link>
                                </Typography>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* Login dialog end */}
                    {/* Forgot password start */}
                    <Dialog
                        open={this.state.showForgotPwd}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showForgotPwd')}
                        aria-labelledby="responsive-dialog-title"
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Forgot password
                            </Typography>
                            <ForgotPwd dialogClick={this.handleClick} />
                            <div className={classes.signup}>
                                <Typography>
                                    Do you remember it?
                                    <Link
                                        href=""
                                        className={classes.link}
                                        onClick={this.handleClick('showLogin')}
                                    >
                                        Log In
                                    </Link>
                                </Typography>
                            </div>
                        </DialogContent>
                    </Dialog>
                     {/*Forgot password end*/}
                </Toolbar>
            </AppBar>
        );
    }
}


ToolbarLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToolbarLayout);