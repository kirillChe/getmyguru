import React  from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainLayout } from 'layouts';
import { MainProvider } from 'providers';
import { ProfilePage, MessagesPage, EditProfilePage } from 'pages';
import { Main, ErrorHandler, ErrorBoundary } from 'components';

export default function App() {
    return (
        <Router>
            <ErrorBoundary>
                <MainProvider>
                    <ErrorHandler>
                        <MainLayout>
                            <Route exact path="/" component={Main} />
                            <Route path="/reset_password" component={Main} />
                            <Route exact path="/account/profile/:id" component={ProfilePage} />
                            <Route exact path="/account/profile/:id/edit" component={EditProfilePage} />
                            <Route exact path="/account/messages/:id" component={MessagesPage} />
                        </MainLayout>
                    </ErrorHandler>
                </MainProvider>
            </ErrorBoundary>
        </Router>
    )
}
