let task_sequence_length = 20;

let nodes = [{
        key: "up",
        index: 0,
        code: 'Digit1',
        div_id: 'up-left'
    }, 
    {
        key: "down",
        index: 1,
        code: 'Digit2',
        div_id: 'down-right'
    }, 
    {
        key: "back",
        index: 2,
        code: 'Digit3',
        div_id: 'backward'
    }, 
    {
        key: "forward",
        index: 3,
        code: 'Digit4',
        div_id: 'forward'
    },
]
function get_node_from_event_code(code) {
    return nodes.find(node => node.code === code);
}
function get_div_from_node_index(index){
    return document.getElementById(nodes.find(node => node.index === index).div_id);
}

/*
        0   ↔   1
        ⇅       ⇅
        3   ↔   2 
*/
let transformations = [
    "repeat",
    "horizontal",
    "vertical",
    "diagonal",
]

let node_sequence = [];

function get_transformed_index(transformation, target_node) {
    switch (transformation) {
        case "repeat":
            return target_node.index;
        case "horizontal":
            if (target_node.index === 0) return 1;
            if (target_node.index === 1) return 0;
            if (target_node.index === 2) return 3;
            if (target_node.index === 3) return 2;
            break;
        case "diagonal":
            if (target_node.index === 0) return 2;
            if (target_node.index === 1) return 3;
            if (target_node.index === 2) return 0;
            if (target_node.index === 3) return 1;
            break;
        case "vertical":
            if (target_node.index === 0) return 3;  
            if (target_node.index === 1) return 2;  
            if (target_node.index === 2) return 1;  
            if (target_node.index === 3) return 0;  
            break;
        default:
            break;
    }
}

let repeat_proc = .3;
let horizontal_proc = .6;
let vertical_proc = .8;
let diagonal_proc = 1;

const transformation_map = new Map([
    [repeat_proc,       transformations[0]],
    [horizontal_proc,   transformations[1]],
    [vertical_proc,     transformations[2]],
    [diagonal_proc,     transformations[3]],
]);

function generate_node_sequence() {
    let next_node_index = Math.floor(Math.random() * nodes.length);
    for (let i = 0; i < task_sequence_length; i++) {
        let proc = Math.random();
        let cached_index = next_node_index;
        for (const [probability, target_transformation] of transformation_map) {
            if (proc < probability) {
                next_node_index = get_transformed_index(target_transformation, nodes[next_node_index]);
                node_sequence.push({
                    node: nodes[cached_index],
                    transformation: target_transformation
                });
                break;
            }
        }
    }
}

generate_node_sequence();
console.log(node_sequence);

let task_active = false;
let task_index = 0;

let introduction_div = document.getElementById('rocker-evaluation-introduction');
let task_finish_div = document.getElementById('rocker-evaluation-task-finish');
let task_area_div = document.getElementById('rocker-evaluation-task-area');

let evaluation_mouse_model = document.getElementById('evaluation-mouse-model');

let up_div = document.getElementById('up-left');
let down_div = document.getElementById('down-right');
let forward_div = document.getElementById('forward');
let backward_div = document.getElementById('backward');

let progress_bar = document.getElementById('progress-bar');

let input_sequence = [];
let parsed_output_data = [];

function start_evaluation() {
    introduction_div.style.display = 'none';
    task_area_div.style.display = 'block';
    task_active = true;

    switch (evaluation_mouse_model.value) {
        case 'g502x':
            up_div.innerText = 'Wheel Left Tilt';
            down_div.innerText = 'Wheel Right Tilt';
            break;
        case 'cirilla':
            up_div.innerText = 'Rocker Up';
            down_div.innerText = 'Rocker Down';
            break;
        default:
            break;
    }
    forward_div.innerText = 'Forward Button';
    backward_div.innerText = 'Back Button';
    
    render_target_node();
}

document.addEventListener('keydown', function(event) {
    if (!task_active) return ;
    event.preventDefault();
    
    cache_user_input(event);
    render_target_node();
    calculate_progress_bar_width();
    
    task_index++;
    
    if (task_index >= node_sequence.length){
        finish_evaluation();
    }
});

function render_target_node(){
    up_div.classList.remove('active');
    down_div.classList.remove('active');
    forward_div.classList.remove('active');
    backward_div.classList.remove('active');
    
    get_div_from_node_index(node_sequence[task_index].node.index).classList.toggle('active');
}

function validate_user_input(event) {
    return event.code === node_sequence[task_index].node.code;
}

function cache_user_input(event) {
    input_sequence.push({
        event: event,
        task: node_sequence[task_index],
        success: validate_user_input(event)
    })
}

function calculate_progress_bar_width(){
    progress_bar.style.width = (task_index / (node_sequence.length - 1)) * 100 + '%';
}

function finish_evaluation(){
    task_active = false;
    task_area_div.style.display = 'none';
    task_finish_div.style.display = 'block';

    console.log(input_sequence);
    
    generate_output_data();
    download_output_data();
}

function generate_output_data(){
    for (let i = 1; i < input_sequence.length; i++) {
        let current_task = input_sequence[i];
        let previous_task = input_sequence[i-1];
        parsed_output_data.push({
            user_name: sanitised_string(document.getElementById('user-name').value),
            evaluation_mouse_make: 'logitech',
            evaluation_mouse_model: sanitised_string(evaluation_mouse_model.value),
            
            target_node: current_task.task.node.key,
            actual_node: get_node_from_event_code(current_task.event.code).key,

            node_transformation: previous_task.task.transformation,
            task_index: i-1,
            
            task_success: current_task.success,
            input_duration: current_task.event.timeStamp - previous_task.event.timeStamp,
            
            previous_target_node: previous_task.task.node.key,
            previous_actual_node: get_node_from_event_code(previous_task.event.code).key,
        });
    }
    console.log(parsed_output_data);
}

function download_output_data (){
    const json = {};
    Object.keys(parsed_output_data).forEach(key => {
        json[key] = parsed_output_data[key];
    });
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const placeholder = document.createElement("a");
    placeholder.href = url;
    placeholder.download = Date.now().toString();
    document.body.appendChild(placeholder);
    placeholder.click();
    document.body.removeChild(placeholder);
    URL.revokeObjectURL(url);
}

function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}
