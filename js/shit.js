function clearDoneTasks() {
  lists.forEach((list) => {
    if (list.id !== activeListId) return;
    list.todos.forEach((todo) => {
      if (!todo.done) return;
      const todoElement = getElementByObj(todo);
      // Note:

      element = todoElement;
      const nextElement = element.nextElementSibling;
      if (nextElement) {
        const elementStyles = getComputedStyle(element);
        const nextElementStyles = getComputedStyle(nextElement);
        const occupiedSpace =
          convertPxToNumber(elementStyles.marginTop) +
          convertPxToNumber(elementStyles.height) +
          convertPxToNumber(nextElementStyles.marginTop);

        console.log(convertPxToNumber(elementStyles.marginTop));
        console.log(convertPxToNumber(elementStyles.height));
        console.log(convertPxToNumber(nextElementStyles.marginTop));

        element.style.transition = "none";
        element.style.marginTop = occupiedSpace + "px";
        setTimeout(() => {
          clearMarginTopAndTransition(element.dataset.id);
        }, 0);
      }

      // Note:
      // removeElementInAnimation(todoElement);
    });

    // list.todos = list.todos.filter((todo) => !todo.done);
    // save();
  });
}

function clearMarginTopAndTransition(id) {
  const element = getElementByObj({ id });
  console.log(element);
  element.style.transition = "";
  element.style.marginTop = "";
}

function getElementByObj(obj) {
  return document.querySelector(`[data-id="${obj.id}"]`);
}

function convertPxToNumber(pxString) {
  return Number(pxString.slice(0, -2));
}

function removeElementInAnimation(element) {
  // there are Note:prerequisite css for this
  const nextElement = element.nextElementSibling;
  if (nextElement) {
    const elementStyles = getComputedStyle(element);
    const nextElementStyles = getComputedStyle(nextElement);
    const occupiedSpace =
      convertPxToNumber(elementStyles.marginTop) +
      convertPxToNumber(elementStyles.height) +
      convertPxToNumber(nextElementStyles.marginTop);

    console.log(convertPxToNumber(elementStyles.marginTop));
    console.log(convertPxToNumber(elementStyles.height));
    console.log(convertPxToNumber(nextElementStyles.marginTop));
    element.style.transition = "none";
    element.style.marginTop = occupiedSpace + "px";
    setTimeout(() => {
      element.style.transition = "";
      element.style.marginTop = "";
    }, 0);
  }
  // element.remove();
}
