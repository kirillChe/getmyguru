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
    return (
        <FormControl className={classes.selectWidth}>
            <InputLabel htmlFor="select-multiple">{label}</InputLabel>
            <Select
                multiple
                variant="outlined"
                value={state}

                onChange={onChange}
                input={<Input id={name} />}
                renderValue={selected => (
                    <div className={classes.chips}>
                        {selected.map(value => (
                            <Chip key={value} label={value} className={classes.chip} />
                        ))}
                    </div>
                )}
            >
                {selectValues.map(name => (
                    <MenuItem key={name} value={name} >
                        {name}
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
    selectValues: PropTypes.array.isRequired,
};

export default withStyles(styles)(MultiSelect);