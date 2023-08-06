const LOCAL_LISTS_KEY = "todo-lists";
const LOCAL_ACTIVE_LIST_ID_KEY = "active-todo-list-id";

const listsWrapper = document.querySelector("[data-lists-wrapper]");
const todoTemplate = document.querySelector("[data-todo-template]");
const todosWrapper = document.querySelector("[data-todos-wrapper]");

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
      listElement.classList.add("active-list");
      renderTodos(list);
    }
  });
}

function renderTodos(list) {
  list.todos.forEach((todo) => {
    todosWrapper.append(createTodoElement(todo));
  });
}

function render() {
  renderLists();
}

const lists = JSON.parse(localStorage.getItem(LOCAL_LISTS_KEY)) || [
  createList("My List"),
];
const activeListId =
  localStorage.getItem(LOCAL_ACTIVE_LIST_ID_KEY) || lists[0].id;

save();
render();
