export class View {
  constructor() {
    const allTodosTemplateHTML = document.querySelector('#all_todos_template').innerHTML;
    Handlebars.registerPartial('all_todos_template', allTodosTemplateHTML);
    this.allTodosTemplate = Handlebars.compile(allTodosTemplateHTML);

    const allListTemplateHTML = document.querySelector('#all_list_template').innerHTML;
    Handlebars.registerPartial('all_list_template', allListTemplateHTML);
    this.allListTemplate = Handlebars.compile(allListTemplateHTML);

    const completedTodosTemplateHTML = document.querySelector('#completed_todos_template').innerHTML;
    Handlebars.registerPartial('completed_todos_template', completedTodosTemplateHTML);
    this.completedTodosTemplate = Handlebars.compile(completedTodosTemplateHTML);

    const completedListTemplateHTML = document.querySelector('#completed_list_template').innerHTML;
    Handlebars.registerPartial('completed_list_template', completedListTemplateHTML);
    this.completedListTemplate = Handlebars.compile(completedListTemplateHTML);

    const titleTemplateHTML = document.querySelector('#title_template').innerHTML;
    Handlebars.registerPartial('title_template', titleTemplateHTML);
    this.titleTemplate = Handlebars.compile(titleTemplateHTML);

    const itemPartialTemplateHTML = document.querySelector('#item_partial').innerHTML;
    Handlebars.registerPartial('item_partial', itemPartialTemplateHTML);

    const listTemplateHTML = document.querySelector('#list_template').innerHTML;
    Handlebars.registerPartial('list_template', listTemplateHTML);
    this.listTemplate = Handlebars.compile(listTemplateHTML);

    const mainTemplateHTML = document.querySelector("#main_template").innerHTML;
    this.mainTemplate = Handlebars.compile(mainTemplateHTML);

    document.querySelector('body').innerHTML = this.mainTemplate({});

    this.current_due_date = 'All Todos';
    this.current_completed = false;

    //showing the modal
    document.querySelector('#items > main > label').addEventListener('click', (event) => {
      let form = document.querySelector('#form_modal > form');
      form.dataset.existingTodo = false;
      form.removeAttribute('data-id');
      this.toggleTodoModal();
    });

    //hiding the modal when clicking outside of the form.
    document.querySelector('#modal_layer').addEventListener('click', (event) => {
      if (event.currentTarget.style.display) {
        if (event.target === event.currentTarget) {
          this.toggleTodoModal();
        }
      }
    });

    //hiding the modal when pressing escape
    document.addEventListener('keyup', (event) => {
      if (event.key === `Escape` && document.querySelector("#modal_layer").style.display) {
        this.toggleTodoModal();
      }
    });
  }

  bindDeleteTodo(handler) {
    document.querySelector('#items').addEventListener('click', (event) => {
      if (event.target.classList.contains('delete') ||
        event.target.parentElement.classList.contains('delete')) {
        event.preventDefault();

        let currentEle = event.target;
        if (event.target.tagName === 'IMG') {
          currentEle = currentEle.parentElement;
        }

        handler(currentEle.parentElement.dataset.id, { due_date: this.current_due_date, completed: this.current_completed });

      }
    })
  }

  bindMarkAsCompletedButton(handler) {
    document.querySelector('button[name="complete"]').addEventListener('click', (event) => {
      event.preventDefault();
      let form = document.querySelector('#form_modal > form');
      if (form.dataset.existingTodo !== 'true') {
        alert('Cannot mark as complete as item has not been created yet!');
      } else {
        handler(form.dataset.id,
          { completed: form.dataset.completed !== 'true' },
          { due_date: this.current_due_date, completed: this.current_completed });
          this.toggleTodoModal();
          form.reset();
      }
    })
  }

  bindSidebarClick(getTodosFunction) {
    document.querySelector('#sidebar').addEventListener('click', async (event) => {
      let currentEle = event.target;
      let sidebarDiv = document.querySelector("#sidebar");


      while (currentEle !== sidebarDiv) {
        if (currentEle.tagName === 'DL') {
          const completed = document.querySelector('#completed_items').contains(currentEle);

          if (currentEle.parentElement.tagName === 'HEADER') {
            currentEle = currentEle.parentElement;
          }

          this.current_due_date = currentEle.dataset.title;
          this.current_completed = completed;

          const todoObj = await getTodosFunction(currentEle.dataset.title, completed)

          this.renderItems(todoObj);
          this.renderSidebar(todoObj);
          break;
        } else {
          currentEle = currentEle.parentElement;
        }
      }
    });
  }

  bindSubmitTodo(newTodoHandler, editTodoHandler) {
    document.querySelector('#form_modal > form').addEventListener('submit', (event) => {
      event.preventDefault();
      let form = event.currentTarget;
      let data = new FormData(form);
      let dataObj = {};
      data.forEach((value, key) => {
        if (key === 'due_day') {
          if (value !== 'Day') {
            dataObj.day = value;
          } 
        } else if (key === 'due_month') {
          if (value !== 'Month') {
            dataObj.month = value;
          }
        } else if (key === 'due_year') {
          if (value !== 'Year') {
            dataObj.year = value;
          }
        } else {
          dataObj[key] = value;
        }
      })

      if (!dataObj.title || dataObj.title.length < 3) {
        alert('You must enter a title at least 3 characters long.');
        return;
      } else {
        if (form.dataset.id) {
          editTodoHandler(form.dataset.id, dataObj, { due_date: this.current_due_date, completed: this.current_completed });
        } else {
          this.current_due_date = 'All Todos';
          this.current_completed = false;
          newTodoHandler(dataObj, { due_date: this.current_due_date, completed: this.current_completed });
        }

        this.toggleTodoModal();
        form.reset();

      }


    })
  }

  bindToggleTodoClick(toggleHandler, getTodoInfoHandler) {
    document.querySelector('#items').addEventListener('click', async (event) => {
      
      if (event.target.tagName === 'LABEL') {
        event.preventDefault();

        //to avoid the hamburger menu label
        if (event.target.getAttribute('for') === 'sidebar_toggle') return;
        
        let form = document.querySelector('#form_modal > form');
        form.dataset.existingTodo = true;
        let id = event.target.parentElement.parentElement.dataset.id;
        let data = await getTodoInfoHandler(id);

        form.querySelector('#title').value = data.title || null;
        form.querySelector('#due_day').value = data.day || 'Day';
        form.querySelector('#due_month').value = data.month || 'Month';
        form.querySelector('#due_year').value = data.year || 'Year';
        form.querySelector('textarea[name="description"]').textContent = data.description || null;
        form.dataset.id = id;
        form.dataset.completed = data.completed;

        this.toggleTodoModal();


      } else if (event.target.classList.contains('list_item') ||
        event.target.parentElement.classList.contains('list_item')) {
        let id = event.target.parentElement.dataset.id;
        if (event.target.parentElement.classList.contains('list_item')) {
          id = event.target.parentElement.parentElement.dataset.id
        }
        toggleHandler(id, { due_date: this.current_due_date, completed: this.current_completed });
      }
    })
  }



  //returns an array of objects of the form { due_date: 'xx/xx', todos: []}
  getDueDateArray(todoArr) {
    let result = [];

    todoArr.forEach(todo => {
      if (!result.some(obj => obj.due_date === todo.due_date)) {
        result.push({
          due_date: todo.due_date,
          todos: [todo]
        });
      } else {
        result.find(obj => obj.due_date === todo.due_date).todos.push(todo);
      }
    });

    //sort todos in each object
    result.forEach(obj => {
      obj.todos.sort(this.sortOnDueDates);
    })
    //sort outer array so due dates are in order
    result.sort(this.sortOnDueDates);

    return result;
  }

  async init(todosDataPromise) {
    let todosData = await todosDataPromise;
    this.renderSidebar(todosData);
    this.renderItems(todosData);
    document.querySelector('#all_header').classList.add('active');
  }

  renderItems({ current_section, selected }) {
    document.querySelector('#items > header').innerHTML = this.titleTemplate({ current_section })
    selected.sort(this.sortOnDueDates);
    document.querySelector('#items > main > table > tbody').innerHTML = this.listTemplate({ selected });
  }

  renderSidebar({ todos }) {

    const done = todos.filter(todo => todo.completed);
    const todos_by_date = this.getDueDateArray(todos);
    const done_todos_by_date = this.getDueDateArray(done);
    document.querySelector('#all_todos').innerHTML = this.allTodosTemplate({ todos })
    document.querySelector('#all_lists').innerHTML = this.allListTemplate({ todos_by_date })
    document.querySelector('#completed_todos').innerHTML = this.completedTodosTemplate({ done })
    document.querySelector('#completed_lists').innerHTML = this.completedListTemplate({ done_todos_by_date });


    let div = document.querySelector('#all');
    if (this.current_completed) {
      div = document.querySelector('#completed_items');
    }

    if (this.current_due_date === 'All Todos') {
      div.querySelector(`[data-title="All Todos"]`).classList.add('active');
    } else if (this.current_due_date === 'Completed') {
      div.querySelector(`[data-title="Completed"]`).classList.add('active');
    } else {
      div.querySelector(`[data-title="${this.current_due_date}"]`)?.classList.add('active');
    }
  }

  // sorting function that first sorts years ascending, then month
  sortOnDueDates(first, second) {
    if (first.hasOwnProperty('completed') && second.hasOwnProperty('completed')) {
      if (first.completed && !second.completed) return 1;
      if (!first.completed && second.completed) return -1;
    }


    if (first.due_date === 'No Due Date') {
      return -1;
    } else if (second.due_date === 'No Due Date') {
      return 1;
    }
    const firstYear = first.due_date.slice(-2);
    const secondYear = second.due_date.slice(-2);
    if (firstYear < secondYear) {
      return -1;
    } else if (firstYear > secondYear) {
      return 1;
    } else {
      const firstMonth = first.due_date.slice(0, 2);
      const secondMonth = second.due_date.slice(0, 2);
      if (firstMonth < secondMonth) {
        return -1;
      } else if (firstMonth > secondMonth) {
        return 1;
      }
    }
    return 0;
  }

  toggleTodoModal() {
    const modalLayer = document.querySelector('#modal_layer');
    const modalForm = document.querySelector('#form_modal');
    let form = document.querySelector('#form_modal > form');

    if (!modalLayer.style.display) {
      if (form.dataset.existingTodo === 'false') {
        form.reset();
        form.querySelector('#title').value = null;
        form.querySelector('textarea[name="description"]').textContent = null;
      }

      modalLayer.style.display = 'block';
      modalForm.style = 'display:block; top: 200px;';
    } else {
      modalLayer.removeAttribute('style');
      modalForm.removeAttribute('style');
      form.removeAttribute('data-completed');
    }
  }


}