import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// import withMobileDialog from '@material-ui/core/withMobileDialog';
import Slide from '@material-ui/core/Slide';
import Link from '@material-ui/core/Link';

import {Login, SignUp, ForgotPwd, ProfileMenu, SetNewPwd} from '.';
import * as R from 'ramda';


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

const styles = theme => ({
    dialog: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
            width: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    content: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    signup: {
        marginTop: theme.spacing.unit * 3,
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

class ButtonAppBar extends React.Component {
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
        const { classes, loggedIn, updateUser } = this.props;

        return (
            <AppBar position="sticky" color="default" className={classes.root}>
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Icon">
                        <FitnessIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        COMPANY
                    </Typography>
                    {loggedIn ? (
                        <ProfileMenu updateUser={updateUser} />
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
                        aria-labelledby="responsive-dialog-title"
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
                    {/* Email sent dialog end */}
                    {/* Sign up dialog start */}
                    <Dialog
                        open={this.state.showSignUp}
                        TransitionComponent={Transition}
                        onClose={this.handleClose('showSignUp')}
                        aria-labelledby="responsive-dialog-title"
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
                        aria-labelledby="responsive-dialog-title"
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
                        aria-labelledby="responsive-dialog-title"
                        className={classes.dialog}
                    >
                        <DialogContent className={classes.content}>
                            <Typography variant="h5">
                                Login
                            </Typography>
                            <Login updateUser={updateUser} loggedIn={loggedIn}/>
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
                    {/* Forgot password end */}
                </Toolbar>
            </AppBar>
        );
    }
}


ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);