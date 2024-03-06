let task_elements = document.getElementById('task-elements');

const maximum_task_index = 11;
const minimum_task_index = 1;
let target_index = random_index();
let active_element_index = random_index();

// Generate Evaluation Section
for (let i = minimum_task_index; i <= maximum_task_index; i++) {
    let element = construct_element_with_id("p", `task-element-${i}`, 'section-indicator');
    element.innerHTML = `${i}`;
    task_elements.appendChild(element);
}
function construct_element_with_id(tag, id, class_name){
    let element = document.createElement(tag);
    element.id = id;
    element.className = class_name;
    return element;
}
// Manage Section
manage_active_element();
function manage_active_element(){
    for (let i = minimum_task_index; i <= maximum_task_index; i++) {
        let indicator = document.getElementById(`task-element-${i}`);
        if (active_element_index === target_index && i === target_index) {
            indicator.classList.add('correct');
            indicator.classList.remove('inactive', 'active');
        } else if (i === active_element_index) {
            indicator.classList.add('active');
            indicator.classList.remove('inactive', 'correct');
        }else if (i === target_index) {
            indicator.classList.add('target');
            indicator.classList.remove('inactive', 'correct');
        } else {
            indicator.classList.add('inactive');
            indicator.classList.remove('active', 'correct');
        }
    }
}
// System Events
document.addEventListener('wheel', scroll);
function scroll(event){
    let scroll_delta = event.deltaY;
    let scrolling_up = scroll_delta > 0;
    active_element_index = scrolling_up 
        ? active_element_index + 1
        : active_element_index - 1;
    wrap_index();
    manage_active_element();
}
function wrap_index(){
    active_element_index = active_element_index > maximum_task_index 
        ? minimum_task_index 
        : active_element_index;
    active_element_index = active_element_index < minimum_task_index
        ? maximum_task_index
        : active_element_index;
}
// Task Selection
function random_index() {
    return Math.floor(Math.random() * (maximum_task_index - minimum_task_index + 1) + minimum_task_index);
}
function initial_active_index() {
    let index = random_index();
    if (index !== target_index){
        return index;
    } else{
        return initial_active_index();
    }
}
