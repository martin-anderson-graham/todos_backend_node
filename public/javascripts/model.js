export class Model {
  constructor() { }

  async deleteTodo(id) {
    let req = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'DELETE'
    });

  }

  //returns a promise that resolves the parsed JSON of all todos
  async getAllTodos() {
    let req = await fetch('http://localhost:3000/api/todos');
    return await req.json();
  }

  async getTodo(id) {
    let req = await fetch(`http://localhost:3000/api/todos/${id}`);
    return req.json();
  }

  async submitNewTodo(json) {
    let req = await fetch('http://localhost:3000/api/todos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: json
      });
  }

  async toggleTodoStatus(id) {
    let todo = await this.getTodo(id);
    let req = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !todo.completed })
    });
  }

  async updateTodo(id, json) {
    let req = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json
    })
  }


}