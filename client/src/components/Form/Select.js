import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import * as R from 'ramda';

const Select = ({name, state, label, onChange, selectValues}) => {
    selectValues = R.toPairs(selectValues);
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
            {selectValues.map(([key, value]) => (
                <option key={key} value={key}>
                    {value}
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
    selectValues: PropTypes.object.isRequired,
};

export default Select;