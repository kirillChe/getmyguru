import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Chip,
    InputLabel,
    Select,
    FormControl,
    MenuItem,
    Input
} from '@material-ui/core';
import * as R from 'ramda';

const styles = () => ({
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    selectWidth: {
        width: '100%'
    }
});


const MultiSelect = ({classes, name, state, label, onChange, selectValues}) => {
    let formattedSelectValues = R.toPairs(selectValues);
    return (
        <FormControl className={classes.selectWidth}>
            <InputLabel htmlFor="select-multiple">{label}</InputLabel>
            <Select
                multiple
                variant="outlined"
                value={state}
                name={name}
                onChange={onChange}
                input={<Input id={name} />}
                renderValue={selected => (
                    <div className={classes.chips}>
                        {selected.map(value => (
                            <Chip key={value} label={selectValues[value]} className={classes.chip} />
                        ))}
                    </div>
                )}
            >
                {formattedSelectValues.map(([key, value]) => (
                    <MenuItem key={key} value={key} >
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

MultiSelect.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectValues: PropTypes.object.isRequired,
};

export default withStyles(styles)(MultiSelect);