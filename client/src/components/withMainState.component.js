import React from 'react';
import { MainContext } from 'context';

// This function takes a component...
export default function withMainStateComponent(Component) {
    // ...and returns another component...
    return function HydratedComponent(props) {
        console.log('withMainState.component.js :8', Component);
        // ... and renders the wrapped component with the context!
        // Notice that we pass through any additional props as well
        return <MainContext.Consumer>{context => <Component {...props} context={context} />}</MainContext.Consumer>
    }
}