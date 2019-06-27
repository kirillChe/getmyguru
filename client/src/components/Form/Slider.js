import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const CustomSlider = ({name, state, label, onChange, min, max}) => {
    return (
        <div>
            <Typography>
                {label}
            </Typography>
            <Slider
                id={name}
                name={name}
                value={state}
                min={min}
                max={max}
                valueLabelDisplay="auto"
                onChangeCommitted={onChange}
            />
        </div>
    );
};

CustomSlider.propTypes = {
    name: PropTypes.string.isRequired,
    state: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
};

export default CustomSlider;