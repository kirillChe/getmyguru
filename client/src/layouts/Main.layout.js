import React, { PureComponent } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import {ToolbarLayout, FooterLayout} from './';
import { MainContext } from '../context';

const styles = theme => ({
    progress: {
        position: 'fixed',
        top: '50%',
        left: '50%'
    }
});

class MainLayout extends PureComponent {

    static contextType = MainContext;

    render() {
        let {children} = this.props;
        const { classes } = this.props;
        let context = this.context;
        let content;

        if (context.loading) {
            content = <CircularProgress className={classes.progress} />;
        } else {
            content = <React.Fragment>
                <ToolbarLayout />
                <main>
                    <div>{children}</div>
                </main>
                <FooterLayout/>
            </React.Fragment>;
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}

export default withStyles(styles)(MainLayout);