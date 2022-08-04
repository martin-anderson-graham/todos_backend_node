function dummyData() {

  
  let dummyTodos = [
    {'title': 'milk', 'day': '11', 'month': '11',
    'year': '2019', 'completed': 'true', 'description': 'Some Description'},
    
    {'title': 'eggs', 'day': '03', 'month': '01',
    'year': '2018', 'completed': 'true', 'description': 'no way'},
  
    {'title': 'cheese', 'day': '03', 'month': '01',
    'year': '2018', 'completed': 'true', 'description': 'if there is time'},
  
    {'title': 'bacon', 'day': '05', 'month': '03',
    'year': '2020', 'completed': 'false', 'description': 'oh my'},
  
    {'title': 'fish', 'day': '06', 'month': '04',
    'year': '2021', 'completed': 'false', 'description': 'hey'},

    {'title': 'daylight', 'day': '03', 'month': '02',
    'year': '2018', 'completed': 'true', 'description': ''},

    {'title': 'my oh my'},

    {'title': 'where is my car?', 'completed': 'true'}
  ];
  
  dummyTodos.forEach( (todo, index) => {
    setTimeout( () => {
      let json = JSON.stringify(todo);
      fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: json,
      });
    }, 200 * index);
  
  });

}  

function resetDatabase() {
  fetch('http://localhost:3000/api/reset');
}

