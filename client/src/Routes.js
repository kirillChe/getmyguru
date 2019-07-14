import React, { useContext }  from 'react';
import {Main} from "./components/Main";

import { Switch, Route } from 'react-router-dom';
import {EditProfile, Forbidden, Messages, NotFound, Profile} from "./pages";
import {MainContext} from "./context";


const PrivateRoute = ({component: Component, ...rest}) => {
    const { loggedIn } = useContext(MainContext);

    return (
        <Route
            {...rest}
            render={props => loggedIn ? (<Component {...props} />) : (<Forbidden />)}
        />
    );

};

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/reset_password" component={Main} />
            <Route path="/confirm" component={Main} />
            <PrivateRoute exact path="/account/profile/:id" component={Profile} />
            <PrivateRoute exact path="/account/profile/:id/edit" component={EditProfile} />
            <PrivateRoute exact path="/account/messages/:id" component={Messages} />
            <Route component={NotFound} />
        </Switch>
    )
}