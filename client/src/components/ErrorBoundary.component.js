import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Error } from 'pages';
import {MainLayout} from 'layouts';

export default class ErrorBoundaryComponent extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    state = { error: null, eventId: null };

    componentDidCatch(error, errorInfo) {
        console.log('_________________HERE: 15________________________', error);
        this.setState({ error });
    }

    render() {
        if (this.state.error) {
            // render fallback UI
            return (
                <MainLayout>
                    <Error />
                </MainLayout>
            )
        }
        return this.props.children
    }
}
