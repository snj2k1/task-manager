// GLOBALS
let todos = [];
let users = [];
const todoList = document.getElementById('todo-list');
const usersList = document.getElementById('user-todo');
const formData = document.querySelector('form');

// Attach Events
document.addEventListener('DOMContentLoaded', previewDataLoad);
formData.addEventListener('submit', getFormData);

// Main Logic
function printUserName(todoUserId){
  const user = users.find(value => value.id === todoUserId);
  return user.name;
}

function printTodos(todo){
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = todo.id;
  li.innerHTML = `<span><i>${todo.title}</i> by <b>${printUserName(todo.userId)}</b></span>`;
  const close = document.createElement('span');
  close.innerHTML = `&times;`
  close.className = 'close';
  close.addEventListener('click',deleteTask);
  const status = document.createElement('input');
  status.type = 'checkbox';
  status.checked = todo.completed;
  status.addEventListener('change',changeStatus);
  li.prepend(status);
  li.append(close);
  todoList.prepend(li);
}

function usersAdd(user){
  const option = document.createElement('option');
  option.value = user.id;
  option.innerHTML = `${user.name}`;
  usersList.append(option);
}

// Event Logic
function previewDataLoad(){
  Promise.all([getTodosList(),getUsersList()]).then(values => {
    [todos, users] = values;
    todos.forEach((value) => printTodos(value));
    users.forEach((value) => usersAdd(value));
  })
}
function getFormData(e){
  e.preventDefault();
  const data = {
    "userId": Number(formData.user.value),
    "title": formData.todo.value,
    "completed": false
  }
  addNewTask(data);
}
function changeStatus(){
  const todoId = Number(this.parentElement.dataset.id);
  const completed = this.checked;
  changeCompletedStatus(todoId,completed);
}
function deleteTask(){
  const todoId = Number(this.parentElement.dataset.id);
  const li = this.parentElement;
  todos = todos.filter((todo) => todo.id !== todoId);
  const close = this.parentElement.querySelector('input');
  close.removeEventListener('change',changeStatus);
  this.removeEventListener('click',deleteTask);
  li.remove();
  deleteTodo(todoId);
}

// Async logic
async function getTodosList(){
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data;
}
async function getUsersList(){
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}
async function addNewTask(todo){
  const response = await fetch('https://jsonplaceholder.typicode.com/todos',{
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const data = await response.json();
  printTodos(data);
}
async function changeCompletedStatus(todoId, completed){
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
    method: 'PATCH',
    body: JSON.stringify({completed}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
}
async function deleteTodo(todoId){
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
    method: 'DELETE',
  });
}
