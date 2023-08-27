const LOCAL_LISTS_KEY = "todo-lists";
const LOCAL_ACTIVE_LIST_ID_KEY = "active-todo-list-id";
const LOCAL_THEME_KEY = "todo-lists-theme";
const htmlElement = document.querySelector("html");
const main = document.querySelector(".main");
const listsWrapper = document.querySelector("[data-lists-wrapper]");
const todoTemplate = document.querySelector("[data-todo-template]");
const todosWrapper = document.querySelector("[data-todos-wrapper]");
const listForm = document.querySelector("[data-list-form]");
const listInput = document.querySelector("[data-list-input]");
const todoForm = document.querySelector("[data-todo-form]");
const todoInput = document.querySelector("[data-todo-input]");
const navActiveListSpan = document.querySelector("[data-nav-active-list-span]");
const activeListHeading = document.querySelector("[data-active-list-heading]");
const editActiveListButton = document.querySelector(
  "[data-edit-active-list-button]"
);
const clearDoneButton = document.querySelector("[data-clear-done-button]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const todosBox = document.querySelector("[data-todos-box]");
const navButton = document.querySelector("[data-nav-button]");
const themeButton = document.querySelector("[data-theme-button]");
const themeButtonWrapper = document.querySelector(
  "[data-theme-button-wrapper]"
);
const dataScrollListContent = document.querySelector(
  "[data-scroll-list-content]"
);
const scrollIntoViewOptions = { behavior: "smooth", block: "nearest" };

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
  handleTodoDeleteButton(todoElement);
  handleTodoCheckbox({ todo, todoElement });
  handleTodoEditButton({ todo, todoElement });
  return todoElement;
}

function toggleNoTodos(list) {
  todosWrapper.classList.toggle("no-todos-wrapper", list.todos.length === 0);
}

function toggleNoLists() {
  listsWrapper.classList.toggle("no-lists-wrapper", lists.length === 0);
}

function renderLists() {
  listsWrapper.innerHTML = "";
  lists.forEach((list) => {
    const listElement = createListElement(list);
    listsWrapper.append(listElement);
  });
  toggleNoLists();
}

function renderActiveList() {
  const activeList = getActiveList();
  const noActiveList = typeof activeList !== "object";
  todosBox.classList.toggle("no-active-list-box", noActiveList);
  if (noActiveList) return;
  [...listsWrapper.children].forEach((listElement) => {
    const isActiveList = activeList.id === listElement.dataset.id;
    listElement.classList.toggle("active-list", isActiveList);
  });
  const listElement = getElementByObj({ id: activeListId });
  activeListHeading.textContent = activeList.name;
  navActiveListSpan.textContent = activeList.name;
  renderTodos(activeList);
  setTimeout(() => {
    listElement.scrollIntoView(scrollIntoViewOptions);
  }, 0);
  main.classList.remove("show-lists");
}

function renderTodos(list) {
  todosWrapper.innerHTML = "";
  list.todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todosWrapper.append(todoElement);
  });
  toggleNoTodos(list);
}

function handleTodoDeleteButton(todoElement) {
  let todoId = todoElement.dataset.id;
  let deleteButton = todoElement.querySelector(`[data-todo-button="delete"]`);
  deleteButton.addEventListener("click", () => {
    removeElementInAnimation(todoElement);
    const list = getActiveList();
    list.todos = list.todos.filter((todo) => todo.id !== todoId);
    save();
    toggleNoTodos(list);
  });
}

function handleTodoCheckbox({ todo, todoElement }) {
  let checkbox = todoElement.querySelector(`[data-todo-button="checkbox"]`);
  let contentElement = todoElement.querySelector(`[data-todo-content]`);
  checkbox.addEventListener("click", () => {
    if (contentElement.contentEditable === "true") {
      saveEditingTodo(contentElement, todo);
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
      focusEditableDivAtEnd(contentElement);
    } else {
      saveEditingTodo(contentElement, todo);
    }
  });
}

function saveEditingTodo(contentElement, todo) {
  contentElement.contentEditable = "false";
  todo.content = contentElement.textContent;
  contentElement.textContent = todo.content;
  save();
}

function render() {
  renderLists();
  renderActiveList();
}

function submitListForm(e) {
  e.preventDefault();
  if (listInput.value === null || listInput.value.trim() === "") return;
  const list = createList(listInput.value);
  lists.push(list);
  listsWrapper.append(createListElement(list));
  activeListId = list.id;
  listInput.value = "";
  toggleNoLists();
  renderActiveList();
  save();
}

function submitTodoForm(e) {
  e.preventDefault();
  if (todoInput.value === null || todoInput.value.trim() === "") return;
  const todo = createTodo(todoInput.value);
  getActiveList().todos.push(todo);
  todosWrapper.append(createTodoElement(todo));
  toggleNoTodos(getActiveList());
  todoInput.value = "";
  save();
  setTimeout(() => {
    dataScrollListContent.scrollTop =
      dataScrollListContent.scrollHeight -
      dataScrollListContent.offsetHeight -
      todosWrapper.nextElementSibling.offsetHeight;
  }, 0);
}

function changeActiveList(e) {
  if (e.target.dataset.id) {
    activeListId = e.target.dataset.id;
    save();
    renderActiveList();
  }
}

function clearDoneTasks() {
  const list = getActiveList();
  list.todos.forEach((todo) => {
    if (!todo.done) return;
    const todoElement = getElementByObj(todo);
    removeElementInAnimation(todoElement);
  });
  list.todos = list.todos.filter((todo) => !todo.done);
  toggleNoTodos(list);
  save();
}

function getElementByObj(obj) {
  return document.querySelector(`[data-id="${obj.id}"]`);
}

function purgeNumber(str) {
  const reg = /[^\d\.]/g;
  return parseInt(str.replace(reg, ""));
}

function removeElementInAnimation(element) {
  // there are prerequisite css for this
  const elementStyles = getComputedStyle(element);
  let nextElement = element.nextElementSibling;
  if (!nextElement) {
    nextElement = element.parentElement.nextElementSibling;
  }
  if ((nextElement, element.parentElement.children.length !== 1)) {
    const nextElementStyles = getComputedStyle(nextElement);
    const occupiedSpace =
      purgeNumber(elementStyles.marginTop) +
      purgeNumber(elementStyles.height) +
      purgeNumber(nextElementStyles.marginTop);
    nextElement.style.transition = "none";
    nextElement.style.marginTop = occupiedSpace + "px";
    setTimeout(() => {
      nextElement.style.transition = "";
      nextElement.style.marginTop = "";
    }, 0);
  }
  element.remove();
}

function getActiveList() {
  return lists.filter((list) => list.id === activeListId)[0];
}

function deleteActiveList() {
  lists.forEach((list, listIndex) => {
    if (list.id !== activeListId) return;
    removeElementInAnimation(getElementByObj(list));
    lists.splice(listIndex, 1);
  });
  save();
  toggleNoLists();
  renderActiveList();
}

function focusEditableDivAtEnd(editableDiv) {
  // from chat gpt
  const textContent = editableDiv.textContent;
  editableDiv.textContent = " ";
  editableDiv.focus();
  editableDiv.textContent = textContent;

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(editableDiv);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function setTheme(theme) {
  htmlElement.dataset.theme = theme;
  themeButton.dataset.themeButton = theme;
}

function saveCurrentTheme() {
  localStorage.setItem(LOCAL_THEME_KEY, htmlElement.dataset.theme);
}

function switchTheme() {
  const currentTheme = htmlElement.dataset.theme;
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  createThemeCircle(newTheme);
}

function createThemeCircle(newTheme) {
  themeButton.dataset.themeButton = newTheme;
  const themeCircle = document.createElement("div");
  themeCircle.classList.add("theme-circle");
  themeButtonWrapper.append(themeCircle);
  themeCircle.style.setProperty("--theme-circle-bg", `var(--bg-${newTheme})`);
  const { x, y } = themeCircle.getBoundingClientRect();
  const newThemeCircleSize = Math.hypot(x, window.innerHeight - y) + 2;
  themeCircle.style.setProperty("--size", `${2 * newThemeCircleSize}px`);
  themeCircle.addEventListener("transitionend", ({ propertyName }) => {
    if (propertyName === "opacity") {
      themeCircle.remove();
    } else if (propertyName === "width") {
      setTheme(newTheme);
      saveCurrentTheme();
      themeCircle.style.setProperty("--opacity", "0");
    }
  });
}

function saveEditingList() {
  activeListHeading.contentEditable = "false";
  const activeList = getActiveList();
  activeList.name = activeListHeading.textContent;
  activeListHeading.textContent = activeList.name;
  getElementByObj(activeList).textContent = activeList.name;
  navActiveListSpan.textContent = activeList.name;
  renderActiveList();
  save();
}

// execution
const lists = JSON.parse(localStorage.getItem(LOCAL_LISTS_KEY)) || [
  createList("My List"),
];
let activeListId =
  localStorage.getItem(LOCAL_ACTIVE_LIST_ID_KEY) || lists[0].id;

const headingObserver = new IntersectionObserver((entries) => {
  navActiveListSpan.classList.toggle(
    "nav-active-list-span-transparent",
    entries[0].isIntersecting
  );
});

save();
render();
listForm.addEventListener("submit", submitListForm);
todoForm.addEventListener("submit", submitTodoForm);
listsWrapper.addEventListener("click", changeActiveList);
clearDoneButton.addEventListener("click", clearDoneTasks);
deleteListButton.addEventListener("click", deleteActiveList);
navButton.addEventListener("click", () => {
  main.classList.toggle("show-lists");
});
headingObserver.observe(activeListHeading);
editActiveListButton.addEventListener("click", () => {
  let editingList = activeListHeading.contentEditable === "true";
  if (editingList) {
    saveEditingList();
  } else {
    activeListHeading.contentEditable = "true";
    focusEditableDivAtEnd(activeListHeading);
  }
  save();
});

// theme
const localTheme = localStorage.getItem(LOCAL_THEME_KEY);
if (localTheme) {
  setTheme(localTheme);
} else {
  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  isDarkTheme.matches ? setTheme("dark") : setTheme("light");
}
themeButton.addEventListener("click", switchTheme);
