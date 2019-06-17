import { PureComponent } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class ErrorHandler extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    componentDidMount() {
        axios.interceptors.response.use(
            response => response,
            error => {
                const status = error.response && error.response.status;

                // if (status === 401) {
                //     // Redirect to the login page
                //     // document.location = '/auth/login'
                // } else {
                    console.log('_________________HERE: 20________________________', error);
                    throw error;
                // }
            }
        )
    }

    render() {
        return this.props.children;
    }
}

export default ErrorHandler;
