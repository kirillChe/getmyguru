import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    IconButton,
    InputAdornment
} from '@material-ui/core';
import {
    Visibility,
    VisibilityOff
} from '@material-ui/icons';
import useForceUpdate from 'use-force-update';
import axios from 'axios';
import { useIntl } from 'hooks';
import messages from './SetNewPwd.messages';

const styles = theme => ({
    form: {
        width: '90%', // Fix IE 11 issue.
        // marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});


const SetNewPwd = ({classes, enqueueSnackbar, dialogClick, token}) => {
    const { formatMessage } = useIntl();
    const forceUpdate = useForceUpdate();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    function validateForm() {
        return password.length > 0;
    }

    function handleChange (event) {
        setPassword(event.target.value);
    }

    function togglePasswordMask () {
        setShowPassword(!showPassword);
    }

    async function handleSubmit (event) {
        event.preventDefault();
        let data = {
            token: token,
            newPassword: password
        };

        console.log(`Set new pwd submitted:`);
        console.log(data);

        try {
            let response = await axios.post('/api/users/setNewPassword', data);
            console.log('Set new pwd response: ');
            console.log(response);
            if (response.status === 204) {
                dialogClick();
            } else {
                console.log('Set new pwd error');
                enqueueSnackbar(formatMessage(messages.setNewPwdError), { variant: 'error' });
                forceUpdate();
            }
        }catch (e) {
            enqueueSnackbar(formatMessage(messages.setNewPwdError), { variant: 'error' });
            console.log('Set new pwd error: ', e);
            forceUpdate();
        }
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    id="password"
                    name="password"
                    label={formatMessage(messages.password)}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={togglePasswordMask}
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!validateForm()}
                >
                    {formatMessage(messages.reset)}
                </Button>
            </form>
        </React.Fragment>
    );
};

SetNewPwd.propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(SetNewPwd);