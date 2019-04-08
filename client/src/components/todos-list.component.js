import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Todo = props => (
  <tr>
    <td>{props.todo.firstName}</td>
    <td>{props.todo.lastName}</td>
    <td>{props.todo.type}</td>
    <td>
      <Link to={"/edit/" + props.todo._id}>Edit</Link>
    </td>
  </tr>
);

export default class TodosList extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };
  }

  componentDidMount() {
    axios
      .get("/api/users")
      .then(response => {
        console.log(response.data);
        this.setState({ todos: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  todoList() {
    return this.state.todos.map(function(currentTodo, i) {
      return <Todo todo={currentTodo} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h3>Todos List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.todoList()}</tbody>
        </table>
      </div>
    );
  }
}
