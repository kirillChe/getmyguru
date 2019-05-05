import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import axios from "axios";

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

class Filter extends Component {
    state = {
        gender: 'male',
        age: 20,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        userType: 'guru'
    };

    handleChange = event => {
        this.setState({
            // for radio buttons use name
            [event.target.id || event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        const data = new FormData();
        console.log('_________________HERE: 52________________________', event.target);
        data.append('file', event.target);
        data.append('name', 'some value user types');
        data.append('description', 'some value user types');
        axios.post('api/images/upload', data).then((response) => {
            console.log('_________________HERE: 54________________________');
            // this.setState({
            //     imageUrl: response.data.fileUrl
            // })
        }).catch(err => {
            console.log('Sign up error: ');
            console.log(err);
        });



        // event.preventDefault();
        // let data = {
        //     params: {filter: this.state}
        // };
        //
        // console.log(`Search form submitted:`);
        // console.log(data);
        //
        // axios
        //     .post('/api/images/upload', data)
        //     .then(response => {
        //         console.log('Search response: ');
        //         console.log(response);
        //         // if (response.status === 201) {
        //         //     this.props.dialogClick('showLogin')();
        //         // }
        //     })
        //     .catch(err => {
        //         console.log('Search error: ');
        //         console.log(err);
        //         // this.setState({
        //         //     submitError: true
        //         // });
        //         // this.forceUpdate();
        //     });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" name="textfield" />
                <input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                />
                {/*<label htmlFor="contained-button-file">*/}
                {/*    <Button variant="contained" component="span" >*/}
                {/*        Upload*/}
                {/*    </Button>*/}
                {/*</label>*/}
                <input type="submit" />
            </form>
        );
    }
}

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);

