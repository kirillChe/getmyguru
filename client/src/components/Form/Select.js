import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const Select = ({name, state, label, onChange, selectValues}) => {
    return (
        <TextField
            id={name}
            name={name}
            select
            label={label}
            value={state}
            onChange={onChange}
            SelectProps={{
                native: true
            }}
            margin="normal"
            variant="outlined"
            fullWidth
        >
            {selectValues.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </TextField>
    );
};

Select.propTypes = {
    name: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectValues: PropTypes.array.isRequired,
};

export default Select;