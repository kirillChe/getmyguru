import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';

import { MainLayout } from './layouts';
import { Main, Profile } from "./components";


class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            email: null
        };

        this.getUser = this.getUser.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
        this.getUser()
    }

    updateUser (userObject) {
        this.setState(userObject)
    }

    getUser() {
        axios.get('/auth/isLoggedIn').then(response => {
            console.log('Get user response: ');
            console.log(response.data);
            if (response.data.user) {
                console.log('Get User: There is a user saved in the server session: ');

                if (!this.state.loggedIn) {
                    this.setState({
                        loggedIn: true,
                        email: response.data.user.email
                    })
                }
            } else {
                console.log('Get user: no user');
                this.setState({
                    loggedIn: false,
                    email: null
                })
            }
        })
    }

    render() {
        return (
            <Router>
                <MainLayout updateUser={this.updateUser} loggedIn={this.state.loggedIn}>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/profile" component={Profile} />
                    {/*<Route path="/create" component={CreateTodo} />*/}

                </MainLayout>
            </Router>
        );
    }
}




// import CreateTodo from "./components/create-todo.component";
// import EditTodo from "./components/edit-todo.component";

// import "bootstrap/dist/css/bootstrap.min.css";


// import logo from "./logo.svg";

// function App() {
//     return (
//       <Router>
//           <MainLayout>
//             <Route exact path="/" component={Main} />
//             {/*<Route path="/create" component={CreateTodo} />*/}
//
//           </MainLayout>
//       </Router>
//     );
// }

export default App;
