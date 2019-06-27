import React from 'react';
import PropTypes from 'prop-types';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';

const CustomDatePicker = ({maxDate, minDate, state, label, name, onChange, format = "dd/MM/yyyy"}) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                id={name}
                name={name}
                disableFuture
                openTo="year"
                format={format}
                label={label}
                views={["year", "month", "date"]}
                maxDate={maxDate}
                minDate={minDate}
                value={state}
                onChange={onChange}
            />
        </MuiPickersUtilsProvider>
    );
};

CustomDatePicker.propTypes = {
    maxDate: PropTypes.string.isRequired,
    minDate: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CustomDatePicker;