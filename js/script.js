const LOCAL_LISTS_KEY = "todo-lists";
const LOCAL_ACTIVE_LIST_ID_KEY = "active-todo-list-id";

const listsWrapper = document.querySelector("[data-lists-wrapper]");
const todoTemplate = document.querySelector("[data-todo-template]");
const todosWrapper = document.querySelector("[data-todos-wrapper]");
const listForm = document.querySelector("[data-list-form]");
const listInput = document.querySelector("[data-list-input]");
const todoForm = document.querySelector("[data-todo-form]");
const todoInput = document.querySelector("[data-todo-input]");

function save() {
  localStorage.setItem(LOCAL_LISTS_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_ACTIVE_LIST_ID_KEY, activeListId);
}

function createList(listName) {
  const list = {};
  list.id = `list-${Date.now().toString()}`;
  list.name = listName;
  list.todos = [];
  return list;
}

function createTodo(todoContent) {
  const todo = {};
  todo.id = `todo-${Date.now().toString()}`;
  todo.content = todoContent;
  todo.done = false;
  return todo;
}

function createListElement(list) {
  const listElement = document.createElement("li");
  listElement.classList.add("list");
  listElement.tabIndex = 0;
  listElement.dataset.id = list.id;
  listElement.textContent = list.name;
  return listElement;
}

function createTodoElement(todo) {
  const todoElement = todoTemplate.content.cloneNode(true).children[0];
  todoElement.dataset.done = todo.done;
  todoElement.dataset.id = todo.id;
  todoElement.querySelector("[data-todo-content]").textContent = todo.content;
  return todoElement;
}

function renderLists() {
  listsWrapper.innerHTML = "";
  lists.forEach((list) => {
    const listElement = createListElement(list);
    listsWrapper.append(listElement);
    if (list.id === activeListId) {
      setTimeout(() => {
        listElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 0);
      listElement.classList.add("active-list");
      renderTodos(list);
    }
  });
}

function renderTodos(list) {
  todosWrapper.innerHTML = "";
  list.todos.forEach((todo, todoIndex) => {
    const todoElement = createTodoElement(todo);
    todosWrapper.append(todoElement);
    handleTodoDeleteButton({ list, todoElement });
    handleTodoCheckbox({ todo, todoElement });
    handleTodoEditButton({ todo, todoElement });
  });
  if (list.todos.length === 0) {
    todosWrapper.append("No Todos Here");
  }
}

function handleTodoDeleteButton({ list, todoElement }) {
  let todoId = todoElement.dataset.id;
  let deleteButton = todoElement.querySelector(`[data-todo-button="delete"]`);
  deleteButton.addEventListener("click", () => {
    let nextTodo = todoElement.nextElementSibling;
    if (nextTodo) {
      let todoElementStyles = getComputedStyle(todoElement);
      let occupiedSpace =
        parseInt(todoElementStyles.height) +
        2 * parseInt(todoElementStyles.marginTop);
      nextTodo.style.marginTop = occupiedSpace + "px";
      nextTodo.style.transition = "none";
      setTimeout(() => {
        nextTodo.style.transition = "";
        nextTodo.style.marginTop = "";
      }, 0);
    }
    todoElement.remove();
    list.todos.forEach((todo, todoIndex) => {
      if (todo.id === todoId) {
        list.todos.splice(todoIndex, 1);
      }
    });
    save();
  });
}

function handleTodoCheckbox({ todo, todoElement }) {
  let checkbox = todoElement.querySelector(`[data-todo-button="checkbox"]`);
  let contentElement = todoElement.querySelector(`[data-todo-content]`);
  checkbox.addEventListener("click", () => {
    if (contentElement.contentEditable === "true") {
      contentElement.contentEditable = "false";
      todo.content = contentElement.textContent;
      contentElement.textContent = todo.content;
    }
    todo.done = !todo.done;
    todoElement.dataset.done = todo.done;
    save();
  });
}

function handleTodoEditButton({ todo, todoElement }) {
  let editButton = todoElement.querySelector(`[data-todo-button="edit"]`);
  let contentElement = todoElement.querySelector(`[data-todo-content]`);
  editButton.addEventListener("click", () => {
    if (contentElement.contentEditable === "false") {
      contentElement.contentEditable = "true";
      contentElement.focus();
    } else {
      contentElement.contentEditable = "false";
      todo.content = contentElement.textContent;
      contentElement.textContent = todo.content;
    }
    save();
  });
}

function render() {
  renderLists();
}

function saveAndRender() {
  save();
  render();
}

function submitListForm(e) {
  e.preventDefault();
  if (listInput.value === "" || listInput.value === null) return;
  const list = createList(listInput.value);
  lists.push(list);
  activeListId = list.id;
  listInput.value = "";
  saveAndRender();
}

function submitTodoForm(e) {
  e.preventDefault();
  if (todoInput.value === "" || todoInput.value === null) return;
  const todo = createTodo(todoInput.value);
  lists.forEach((list) => {
    if (list.id === activeListId) {
      list.todos.push(todo);
    }
  });
  todoInput.value = "";
  saveAndRender();
  document
    .querySelector(`[data-id="${todo.id}"`)
    .scrollIntoView({ behavior: "smooth" });
}

function changeActiveList(e) {
  if (e.target.dataset.id) {
    activeListId = e.target.dataset.id;
  }
  saveAndRender();
}

const lists = JSON.parse(localStorage.getItem(LOCAL_LISTS_KEY)) || [
  createList("My List"),
];
let activeListId =
  localStorage.getItem(LOCAL_ACTIVE_LIST_ID_KEY) || lists[0].id;

saveAndRender();
listForm.addEventListener("submit", submitListForm);
todoForm.addEventListener("submit", submitTodoForm);
listsWrapper.addEventListener("click", changeActiveList);
