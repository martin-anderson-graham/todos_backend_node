export class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;

    this.view.init(this.computeTodoObj('All Todos', false));

    this.view.bindDeleteTodo(this.deleteTodo);
    this.view.bindMarkAsCompletedButton(this.updateTodo);
    this.view.bindSidebarClick(this.computeTodoObj);
    this.view.bindSubmitTodo(this.submitNewTodo, this.updateTodo);
    this.view.bindToggleTodoClick(this.toggleTodoStatus, this.getTodoInfo);
  }

  addDueDateProperty(todoObj) {
    if (todoObj.month && todoObj.year) {
      todoObj.due_date = todoObj.month + '/' + todoObj.year.slice(-2);
    } else {
      todoObj.due_date = 'No Due Date';
    }
  }

  computeTodoObj = async (section, completed) => {
    const todos = await this.getAllTodos();
    todos.forEach(todo => this.addDueDateProperty(todo));

    const current_section = this.processCurrentSection(todos, section, completed);
    const selected = current_section.todos;

    return {
      todos,
      selected,
      current_section
    }
  }

  deleteTodo = async (id, currentViewObj) => {
    await this.model.deleteTodo(id);
    this.redrawPage(currentViewObj);
  }

  getAllTodos = () => {
    return this.model.getAllTodos();
  }

  getTodoInfo = async (id) => {
    return this.model.getTodo(id);
  }

  processCurrentSection(todos, section, completed = false) {
    let result = { title: section };

    if (section === 'All Todos') {
      result.todos = todos;
    } else if (section === 'Completed') {
      result.todos = todos.filter(todo => todo.completed);
    } else if (completed) {
      result.todos = todos.filter(todo => (todo.completed && todo.due_date === section));
    } else {
      result.todos = todos.filter(todo => todo.due_date === section);
    }

    result.data = result.todos.length;
    return result;
  }

  redrawPage = async ({ due_date, completed }) => {
    let todoObj = await this.computeTodoObj(due_date, completed);
    this.view.renderSidebar(todoObj);
    this.view.renderItems(todoObj);
  }

  submitNewTodo = async (dataObj, currentViewObj) => {
    let json = JSON.stringify(dataObj);
    await this.model.submitNewTodo(json);
    this.redrawPage(currentViewObj);
  }

  toggleTodoStatus = async (id, { due_date = 'All Todos', completed = false } = {}) => {
    await this.model.toggleTodoStatus(id);
    this.redrawPage({ due_date, completed })
  }

  updateTodo = async (id, data, currentViewObj) => {
    let json = JSON.stringify(data);
    await this.model.updateTodo(id, json);
    this.redrawPage(currentViewObj);
  }


}