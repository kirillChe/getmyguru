import React  from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainLayout } from './layouts';
import { MainProvider } from './providers';
import { Main, Profile } from './components';

function App() {
    return (
        <Router>
            <MainProvider>
                <MainLayout>
                    <Route exact path="/" component={Main} />
                    <Route path="/reset_password" component={Main} />
                    <Route exact path="/profile" component={Profile} />
                </MainLayout>
            </MainProvider>
        </Router>
    )
}

export default App;
