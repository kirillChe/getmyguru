import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import ErrorIcon from '@material-ui/icons/Warning';

import { MainContext } from '../context';


import axios from "axios";
import * as R from "ramda";

const ages = getAges(14, 100);

function getAges (start, end) {
    let i = start;
    let result = [];

    do {
        result.push({
            value: i,
            label: i
        });
        i += 1;
    } while (i <= end);
    return result;
}

const styles = theme => ({
    form: {
        width: '300px', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
});

class Profile extends Component {

    static contextType = MainContext;

    state = {
        gender: this.context.user.gender || '',
        age: this.context.user.age,
        firstName: this.context.user.firstName || '',
        lastName: this.context.user.lastName || '',
        email: this.context.user.email || '',
        phone: this.context.user.phone || '',
        file: this.context.user.avatarLocation,
        submitError: false
    };

    componentDidMount() {
        console.log('_________________HERE: 69________________________', this.context);
    }

    validateForm() {
        // return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            // for radio buttons use name
            [event.target.id || event.target.name]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let data = R.omit(['showPassword', 'submitError'], this.state);

        console.log(`Sign up guru form submitted:`);
        console.log(data);

        axios
            .post('/api/users', data)
            .then(response => {
                console.log('Sign up guru response: ');
                console.log(response);
                if (response.status === 201) {
                    this.props.dialogClick();
                }
            })
            .catch(err => {
                console.log('Sign up error: ');
                console.log(err);
                this.setState({
                    submitError: true
                });
                this.forceUpdate();
            });
    };

    render() {
        const { classes } = this.props;
        const {
            gender,
            age,
            firstName,
            lastName,
            email,
            phone,
            submitError
        } = this.state;

        console.log('___________________');
        console.log('_______111____________');
        console.log(this.state);
        console.log('___________________');
        console.log('___________________');

        return (
            <div className={classes.container}>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                     <input
                         onChange={this.handleChange}
                         accept="image/*"
                         id="raised-button-file"
                         type="file"
                         name="myFile"
                     />
                     <label htmlFor="raised-button-file">
                         <Button component="span" >
                             Upload
                         </Button>
                     </label>
                    <TextField
                        id="firstName"
                        label="First Name"
                        value={firstName}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        value={lastName}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="gender"
                            name="gender"
                            value={gender}
                            onChange={this.handleChange}
                        >
                            <FormControlLabel
                                value="male"
                                control={<Radio color="primary" />}
                                label="Male"
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="female"
                                control={<Radio color="primary" />}
                                label="Female"
                                labelPlacement="start"
                            />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        id="age"
                        select
                        label="Age"
                        value={age}
                        onChange={this.handleChange}
                        SelectProps={{
                            native: true
                        }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    >
                        {ages.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        id="email"
                        label="Email"
                        value={email}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        id="phone"
                        label="Phone"
                        value={phone}
                        onChange={this.handleChange}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    {submitError &&
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        className={classes.submit}
                        disabled
                    >
                        <ErrorIcon/> Wrong data entered
                    </Button>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={!this.validateForm()}
                    >
                        Save
                    </Button>
                </form>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);



























// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// // import TextField from '@material-ui/core/TextField';
// // import Radio from '@material-ui/core/Radio';
// // import RadioGroup from '@material-ui/core/RadioGroup';
// // import FormControlLabel from '@material-ui/core/FormControlLabel';
// // import FormControl from '@material-ui/core/FormControl';
//
// import {ImageDropzone} from '.';
//
// import axios from "axios";
//
// const styles = theme => ({
//     container: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     textField: {
//         marginLeft: theme.spacing.unit,
//         marginRight: theme.spacing.unit,
//         width: 200,
//     },
//     menu: {
//         width: 200,
//     },
// });
//
// class Filter extends Component {
//     state = {
//         gender: 'male',
//         age: 20,
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         password: '',
//         userType: 'guru',
//         file: null
//     };
//
//     handleChange = event => {
//         console.log('___________________');
//         console.log('___________________');
//         console.log(event.target.files[0]);
//         // console.log(event.target.value);
//         console.log('___________________');
//         console.log('___________________');
//
//         this.setState({
//             // for radio buttons use name
//             file: event.target.files[0]
//         });
//     };
//
//     handleSubmit = e => {
//         e.preventDefault();
//         const data = new FormData();
//         console.log('_________________HERE: 52________________________', this.state.file);
//         const config = {
//             headers: {
//                 'content-type': 'multipart/form-data'
//             }
//         };
//         data.append('myFile', this.state.file);
//         data.append('name', 'some value user types');
//         data.append('description', 'some value user types');
//         console.log('___________________');
//         console.log('___________________');
//         console.log(data);
//         console.log('___________________');
//         console.log('___________________');
//         axios.put('api/users/2', data, config).then((response) => {
//             console.log('_________________HERE: 54________________________');
//             // this.setState({
//             //     imageUrl: response.data.fileUrl
//             // })
//         }).catch(err => {
//             console.log('Upload error: ');
//             console.log(err);
//         });
//
//
//
//         // event.preventDefault();
//         // let data = {
//         //     params: {filter: this.state}
//         // };
//         //
//         // console.log(`Search form submitted:`);
//         // console.log(data);
//         //
//         // axios
//         //     .post('/api/images/upload', data)
//         //     .then(response => {
//         //         console.log('Search response: ');
//         //         console.log(response);
//         //         // if (response.status === 201) {
//         //         //     this.props.dialogClick('showLogin')();
//         //         // }
//         //     })
//         //     .catch(err => {
//         //         console.log('Search error: ');
//         //         console.log(err);
//         //         // this.setState({
//         //         //     submitError: true
//         //         // });
//         //         // this.forceUpdate();
//         //     });
//     };
//
//     render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 {/*<input onChange={this.handleChange} type="text" name="textfield" />*/}
//                 <input
//                     onChange={this.handleChange}
//                     accept="image/*"
//                     id="raised-button-file"
//                     type="file"
//                     name="myFile"
//                 />
//                 {/*<label htmlFor="raised-button-file">*/}
//                 {/*    <Button component="span" >*/}
//                 {/*        Upload*/}
//                 {/*    </Button>*/}
//                 {/*</label>*/}
//                 {/*<ImageDropzone />*/}
//                 <input type="submit" />
//             </form>
//         );
//     }
// }
//
// Filter.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
//
// export default withStyles(styles)(Filter);
//
