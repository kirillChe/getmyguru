import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

const SuperSwitch = withStyles({
    switchBase: {
        '&$checked': {
            color: 'white',
            '& + $track': {
                backgroundColor: '#f44336',
                opacity: 1,
            },
        },
    },
    track: {
        backgroundColor: '#3f51b5',
        opacity: 1,
    },
    checked: {},
})(Switch);

const CustomSwitch = ({firstLabel, secondLabel, disabled = false, checked, name, onChange}) => {
    return (
        <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>{firstLabel}</Grid>
            <Grid item>
                <SuperSwitch
                    disabled={disabled}
                    checked={checked}
                    onChange={onChange}
                    name={name}
                    id={name}
                />
            </Grid>
            <Grid item>{secondLabel}</Grid>
        </Grid>
    );
};

CustomSwitch.propTypes = {
    firstLabel: PropTypes.string.isRequired,
    secondLabel: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CustomSwitch;