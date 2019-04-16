import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
});

const ages = [
    {
        value: 20,
        label: '20',
    },
    {
        value: 21,
        label: '21',
    },
    {
        value: 22,
        label: '22',
    },
    {
        value: 23,
        label: '23',
    },
    {
        value: 24,
        label: '24',
    },
    {
        value: 25,
        label: '25',
    },
    {
        value: 26,
        label: '26',
    }
];

class Filter extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        age: '',
        multiline: 'Controlled',
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    render() {
        const { classes } = this.props;

        return (
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="first-name"
                    label="First Name"
                    className={classes.textField}
                    value={this.state.firstName}
                    onChange={this.handleChange('firstName')}
                    margin="normal"
                />

                <TextField
                    id="last-name"
                    label="LastName"
                    className={classes.textField}
                    value={this.state.lastName}
                    onChange={this.handleChange('lastName')}
                    margin="normal"
                />

                <TextField
                    id="age"
                    select
                    label="Age"
                    className={classes.textField}
                    value={this.state.age}
                    onChange={this.handleChange('age')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin="normal"
                >
                    {ages.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    id="rating"
                    select
                    label="Rating"
                    className={classes.textField}
                    value={this.state.age}
                    onChange={this.handleChange('rating')}
                    // SelectProps={{
                    //     MenuProps: {
                    //         className: classes.menu,
                    //     },
                    // }}
                    margin="normal"
                >
                    {/*{ages.map(option => (*/}
                        {/*<MenuItem key={option.value} value={option.value}>*/}
                            {/*{option.label}*/}
                        {/*</MenuItem>*/}
                    {/*))}*/}
                </TextField>
                <Button ype="submit" variant="outlined" color="primary">Search</Button>
            </form>
        );
    }
}

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);