import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const PasswordField = ({name, value, label, togglePasswordMask, onChange, showPassword}) => {
    return (
        <TextField
            id={name}
            name={name}
            label={label}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={togglePasswordMask}
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
};

PasswordField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    showPassword: PropTypes.bool.isRequired,
    togglePasswordMask: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default PasswordField;