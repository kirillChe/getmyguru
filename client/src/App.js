import React  from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainLayout } from './layouts';
import { MainProvider } from './providers';
import { Main, Profile, EditProfile, MessagesList } from './components';

export default function App() {
    return (
        <Router>
            <MainProvider>
                <MainLayout>
                    <Route exact path="/" component={Main} />
                    <Route path="/reset_password" component={Main} />
                    <Route exact path="/account/profile/:id" component={Profile} />
                    <Route exact path="/account/profile/:id/edit" component={EditProfile} />
                    <Route exact path="/account/messages/:id" component={MessagesList} />
                </MainLayout>
            </MainProvider>
        </Router>
    )
}
