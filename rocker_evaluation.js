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

let uid = Date.now().toString();
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

let cycle_count = 5;
let transformation_sequence = [
    "repeat",
    "horizontal",
    "repeat",
    "vertical",
    "repeat",
    "horizontal",
    "repeat",
    "diagonal",
    "repeat",
    "vertical",
    "repeat",
    "diagonal",
    "repeat",
    "vertical"
    
]

function generate_node_sequence(){
    let next_node_index = 0;
    for (let i = 0; i < cycle_count; i++) {
        for (let j = 0; j < transformation_sequence.length; j++) {
            let cached_index = next_node_index;
            let transformation = transformation_sequence[j];
            next_node_index = get_transformed_index(transformation, nodes[next_node_index]);
            node_sequence.push({
                node: nodes[cached_index],
                transformation: transformation,
                cycle_index: i
            });
        }
    }
}

generate_node_sequence();

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
            up_div.innerText = 'Wheel Left Tilt';       // Digit1
            down_div.innerText = 'Wheel Right Tilt';    // Digit2
            break;
        case 'cirilla':
            up_div.innerText = 'Rocker Up';             // Digit1
            down_div.innerText = 'Rocker Down';         // Digit2
            break;
        default:
            break;
    }
    forward_div.innerText = 'Forward Button';           // Digit4
    backward_div.innerText = 'Back Button';             // Digit3
    
    render_target_node();
}

document.addEventListener('keydown', function(event) {
    if (!task_active) return;

    event.preventDefault();
    
    cache_user_input(event);
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
    let cached_success = validate_user_input(event); 
    input_sequence.push({
        event: event,
        task: node_sequence[task_index],
        success: cached_success
    })
    console.log(`target: ${node_sequence[task_index].node.code}, actual: ${event.code}, success: ${cached_success}`);
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
    download_output_data().then(r => console.log('Data Downloaded'));
}

function generate_output_data(){
    for (let i = 1; i < input_sequence.length; i++) {
        let current_task = input_sequence[i];
        let previous_task = input_sequence[i-1];
        parsed_output_data.push({
            uid: uid,
            user_name: sanitised_string(document.getElementById('user-name').value),
            evaluation_mouse_make: 'logitech',
            evaluation_mouse_model: sanitised_string(evaluation_mouse_model.value),
            evaluation_mouse_iteration: 'v1.0',
            
            target_node: current_task.task.node.key,
            actual_node: get_node_from_event_code(current_task.event.code).key,

            node_transformation: previous_task.task.transformation,
            task_index: i-1,
            cycle_index: current_task.task.cycle_index,
            
            task_success: current_task.success,
            input_duration: current_task.event.timeStamp - previous_task.event.timeStamp,
            
            previous_target_node: previous_task.task.node.key,
            previous_actual_node: get_node_from_event_code(previous_task.event.code).key,
        });
    }
    console.log(parsed_output_data);
}

async function download_output_data (){
    const json = {};
    const zip = new JSZip();
    
    Object.keys(parsed_output_data).forEach(key => {
        json[key] = parsed_output_data[key];
    });

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            const data = json[key];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            console.log(`${uid}-${key}.json`);
            console.log(data);
            zip.file(`${uid}-${key}.json`, blob);
        }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    console.log(blob);
    const download = document.createElement("a");
    download.href = URL.createObjectURL(blob);
    download.download = `${uid}.zip`;
    console.log(download.download);
    download.click();
}

function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}

setInterval(function() {
    check_user_name();
    if (!task_active) return;
    render_target_node();
}, 1);

const user_name_input = document.getElementById('user-name');
const start_evaluation_button = document.getElementById('start-evaluation');
function check_user_name() {
    start_evaluation_button.disabled = user_name_input.value.trim() === '';
}