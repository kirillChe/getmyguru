import React, { useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import {ToolbarLayout, FooterLayout} from './';
import { MainContext } from '../context';

const styles = () => ({
    progress: {
        position: 'fixed',
        top: '50%',
        left: '50%'
    }
});

const MainLayout = (props) => {
    const { loading } = useContext(MainContext);
    let { children, classes } = props;
    let content;

    if (loading) {
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
    );
};

export default withStyles(styles)(MainLayout);