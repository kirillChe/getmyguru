import React, { PureComponent } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import {Toolbar} from '../components';
import {Footer} from '../components';

class MainLayout extends PureComponent {
    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <Toolbar/>
                <main>
                    <div>{this.props.children}</div>
                </main>
                <Footer/>
            </React.Fragment>
        );
    }
}

export default MainLayout;