import React  from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MainLayout } from 'layouts';
import { MainProvider } from 'providers';
import { ErrorBoundary } from 'components';
import Routes from './Routes';


export default function App() {
    return (
        <Router>
            <ErrorBoundary>
                <MainProvider>
                    <MainLayout>
                        <Routes />
                    </MainLayout>
                </MainProvider>
            </ErrorBoundary>
        </Router>
    )
}