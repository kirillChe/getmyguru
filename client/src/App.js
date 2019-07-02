import React  from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainLayout } from 'layouts';
import { MainProvider } from 'providers';
import { Profile, Messages, EditProfile } from 'pages';
import { Main } from 'components/Main';
import { ErrorHandler, ErrorBoundary } from 'components';

export default function App() {
    return (
        <Router>
            <ErrorBoundary>
                <MainProvider>
                    <ErrorHandler>
                        <MainLayout>
                            <Route exact path="/" component={Main} />
                            <Route path="/reset_password" component={Main} />
                            <Route exact path="/account/profile/:id" component={Profile} />
                            <Route exact path="/account/profile/:id/edit" component={EditProfile} />
                            <Route exact path="/account/messages/:id" component={Messages} />
                        </MainLayout>
                    </ErrorHandler>
                </MainProvider>
            </ErrorBoundary>
        </Router>
    )
}
