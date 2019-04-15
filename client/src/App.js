import React/*, { Component }*/ from "react";
import { BrowserRouter as Router, Route/*, Link*/ } from "react-router-dom";

import { MainLayout } from './layouts';
import { Dashboard } from "./components";

// import CreateTodo from "./components/create-todo.component";
// import EditTodo from "./components/edit-todo.component";

// import "bootstrap/dist/css/bootstrap.min.css";


// import logo from "./logo.svg";


function App() {
    return (
      <Router>
          <MainLayout>
            <Route exact path="/" component={Dashboard} />
            {/*<Route path="/create" component={CreateTodo} />*/}

          </MainLayout>
      </Router>
    );
}

export default App;
