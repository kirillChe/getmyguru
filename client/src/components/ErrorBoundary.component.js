import React, { PureComponent } from 'react';
// import * as Sentry from '@sentry/browser'
import PropTypes from 'prop-types';
import { Error } from 'pages';
import {MainLayout} from 'layouts';

export default class ErrorBoundaryComponent extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    state = { error: null, eventId: null };

    componentDidCatch(error, errorInfo) {
        console.log('_________________HERE: 15________________________');
        console.log('CatchErrors.component.js :15', error, errorInfo);
        this.setState({ error });

        // Sentry.withScope(scope => {
        //     scope.setExtras(errorInfo)
        //     const eventId = Sentry.captureException(error)
        //     this.setState({ eventId })
        // })
    }

    render() {
        console.log('_____ErrorBoundary________');
        console.log(this.state);
        console.log(this.props.children);
        console.log('___________________');
        if (this.state.error) {
            console.log('_________________HERE: 34________________________');
            // render fallback UI
            return (
                <MainLayout>
                    <Error />
                </MainLayout>
            )
        }
        // when there's not an error, render children untouched
        return this.props.children
    }
}
