import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Error } from 'pages';

export default class ErrorBoundaryComponent extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    state = { error: null, eventId: null };

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
    }

    render() {
        if (this.state.error) {
            // render fallback UI
            return (<Error />)
        }
        return this.props.children
    }
}
