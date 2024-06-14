let task_elements = document.getElementById('task-elements');

let canvas = document.getElementById('quantised-scroll-canvas');
let context = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();

let canvas_size = 600;
let dpr = 1;

const maximum_task_index = 11;
const minimum_task_index = 1;

const number_of_targets = 11;
const target_visual_size = 30;

let target_index = random_index();
let active_element_index = random_index();

let active_target_color = "#fb7474";
let visible_inactive_target_color = "#F2F2F2";

scale_canvas();
function scale_canvas() {
    canvas.style.width = `${canvas_size}px`;
    canvas.style.height = `${canvas_size}px`;
    canvas.width = Math.floor(canvas_size * dpr);
    canvas.height = Math.floor(canvas_size * dpr);
    context.scale(dpr, dpr);
    rect = canvas.getBoundingClientRect();
}
function generate_scroll_targets(){
    for (let i = 0; i < number_of_targets; i++) {
        const angle = (i / number_of_targets) * 2 * Math.PI;
        let target = {
            x: get_center().x + (canvas_size * .5) * Math.cos(angle),
            y: get_center().y + (canvas_size * .5) * Math.sin(angle),
            size: target_visual_size,
            index: i,
            color: red};
        targets.push(target);}
}


































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
// System Events#677ac1
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
