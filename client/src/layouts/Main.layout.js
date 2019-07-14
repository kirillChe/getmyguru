import React, { useContext } from 'react';

import {ToolbarLayout, FooterLayout} from './';
import { MainContext } from 'context';
import { Spinner } from 'components';

const MainLayout = ({ children }) => {
    const { loading } = useContext(MainContext);

    return (
        <div>
            {loading ?
                <Spinner /> :
                <React.Fragment>
                    <ToolbarLayout />
                    <main>
                        <div>{children}</div>
                    </main>
                    <FooterLayout/>
                </React.Fragment>
            }
        </div>
    );
};

export default MainLayout;