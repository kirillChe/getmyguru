import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const CheckBox = ({name, state, label, onChange, color = 'default', place = 'end', error = false}) => {
    return (
        <FormControl required error={error} component="fieldset">
            <FormControlLabel
            id={name}
            name={name}
            value={name}
            control={<Checkbox checked={state} onChange={onChange} color={color} />}
            label={label}
            labelPlacement={place}
            />
            {error &&
                <FormHelperText>Some checkbox error</FormHelperText>
            }
        </FormControl>
    );
};

CheckBox.propTypes = {
    name: PropTypes.string.isRequired,
    state: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CheckBox;