/*
-----[Variable Declaration]
*/
let key_order = [
    /*
    Number Row
    */
    {key_name: "1",             key_code: "Digit1"},
    {key_name: "2",             key_code: "Digit2"},
    {key_name: "3",             key_code: "Digit3"},
    {key_name: "4",             key_code: "Digit4"},
    {key_name: "5",             key_code: "Digit5"},
    {key_name: "6",             key_code: "Digit6"},
    {key_name: "7",             key_code: "Digit7"},
    {key_name: "8",             key_code: "Digit8"},
    {key_name: "9",             key_code: "Digit9"},
    {key_name: "0",             key_code: "Digit0"},
    /*
    Function Keys
    */
    {key_name: "F1",            key_code: "F1"},
    {key_name: "F2",            key_code: "F2"},
    {key_name: "F3",            key_code: "F3"},
    {key_name: "F4",            key_code: "F4"},
    {key_name: "F5",            key_code: "F5"},
    {key_name: "F6",            key_code: "F6"},
    {key_name: "F7",            key_code: "F7"},
    {key_name: "F8",            key_code: "F8"},
    {key_name: "F9",            key_code: "F9"},
    {key_name: "F10",            key_code: "F10"},
    {key_name: "F11",            key_code: "F11"},
    {key_name: "F12",            key_code: "F12"},
    /*
    Arrow Keys
    */
    {key_name: "Left Arrow",    key_code: "ArrowLeft"},
    {key_name: "Up Arrow",      key_code: "ArrowUp"},
    {key_name: "Right Arrow",   key_code: "ArrowRight"},
    {key_name: "Down Arrow",    key_code: "ArrowDown"},
    /*
    D Cluster
    */
    {key_name: "E",             key_code: "KeyE"},
    {key_name: "F",             key_code: "KeyF"},
    {key_name: "C",             key_code: "KeyC"},
]

let base_key = {key_name: "D", key_code: "KeyD"};

let number_of_cycles = 3;
let evaluation_steps= [];

let task_index = 0;
let action_index = 0;

let task_started = false;
let task_completed = false;

let during_task_data_collection = [];
let output_data = [];

let progression_readout= document.getElementById('progress-visualisation');
let base_key_readout= document.getElementById('base-key');
let target_key_readout= document.getElementById('target-key');

let input_user_name= document.getElementById('user-name');
let input_keyboard_model= document.getElementById('keyboard-model');
let input_keyboard_make= document.getElementById('keyboard-make');
let input_keyboard_condition= document.getElementById('keyboard-condition');
/*
-----[System Events]
*/
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    if (!task_started || task_completed) return;
    calculate_user_performance(event, validate_user_input(event));
    progress_evaluation_task();
    display_progression_information();
    set_target_visibility()
});
/*
-----[Visual Logic]
*/
function set_target_visibility(){
    target_key_readout.classList.toggle('hide-text');
    base_key_readout.classList.toggle('hide-text');
}
/*
-----[Core Logic]
*/
function validate_user_input(event){
    return is_seeking_task()
        ? event.code ===  current_task().target.key_code 
        : event.code ===  current_task().base.key_code;
}
function calculate_user_performance(event, correct_input){
    during_task_data_collection.push({
        event: event,
        correct_input: correct_input,
        task_type: task_type(),
        action_index : action_index,
        task_index : task_index,
        cycle_index : cycle_index()
    });
}
function progress_evaluation_task(){
    if (is_seeking_task() && action_index > 0) {
        task_index++;
    }
    if (task_index >= evaluation_steps.length){
        on_task_completed();
    } else {
        display_current_target_key();
    }
    action_index++;
}
function on_task_completed(){
    task_completed = true;
    calculate_task_performance();
    download_generated_data(output_data);
}
function create_evaluation_steps(){
    for (let j = 1; j <= number_of_cycles; j++) {
        for (let i = 0; i < key_order.length; i++) {
            evaluation_steps.push({
                base: base_key,
                target: key_order[i]
            });
        }
    }
}
/*
-----[Data Processing]
*/
function calculate_task_performance(){
    for (let i = 1; i < during_task_data_collection.length; i++) {
        let current_input = during_task_data_collection[i];
        let previous_input = during_task_data_collection[i-1];
        output_data.push({
            user_name: sessionStorage.getItem('user-name'),
            keyboard_make: sessionStorage.getItem('keyboard-make'),
            keyboard_model: sessionStorage.getItem('keyboard-model'),
            keyboard_condition: sessionStorage.getItem('keyboard-condition'),
            pressed_key_code: current_input.event.code,
            previous_key_code: previous_input.event.code,
            input_duration: current_input.event.timeStamp - previous_input.event.timeStamp,
            correct_input: current_input.correct_input,
            task_type: current_input.task_type,
            action_index : current_input.task_index,
            task_index: current_input.action_index,
            cycle_index: current_input.cycle_index
        });
    }
    console.log(output_data);
}
function download_generated_data (data){
    const json = {};
    Object.keys(data).forEach(key => {
        json[key] = data[key];
    });
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const placeholder = document.createElement("a");
    placeholder.href = url;
    placeholder.download = Date.now().toString();
    document.body.appendChild(placeholder);
    placeholder.click();
    document.body.removeChild(placeholder);
    URL.revokeObjectURL(url);
}
/*
-----[Utility Functions]
*/
function display_current_target_key(){
    base_key_readout.innerHTML = current_task().base.key_name;
    target_key_readout.innerHTML = current_task().target.key_name;
}
function display_progression_information(){
    //progression_readout.innerHTML = `${task_completed ? 'completed' : 'ongoing'} <br> task is ${task_type()} <br> cycle index is ${cycle_index()} <br> steps in cycle is ${steps_in_cycle()} <br> ${task_index} of ${evaluation_steps.length} total steps done <br> current action index is ${action_index}`;
}
function current_task(){
    return evaluation_steps[task_index];
}
function is_seeking_task(){
    return action_index % 2 !== 0;
}
function task_type(){
    return is_seeking_task() ? 'seeking' : 'baseline';
}
function steps_in_cycle() {
    return evaluation_steps.length / number_of_cycles;
}
function cycle_index(){
    return Math.floor(task_index / steps_in_cycle());
}
function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}
/*
-----[Evaluation Logic Functions]
*/
function begin_evaluation(){
    task_started = true;
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('key-location-exercise').style.display = 'block';
    cache_evaluation_data();
    console.log(sessionStorage);
}
function cache_evaluation_data(){
    sessionStorage.setItem('user-name', sanitised_string(document.getElementById('user-name').value));
    sessionStorage.setItem('keyboard-make', sanitised_string(document.getElementById('keyboard-make').value));
    sessionStorage.setItem('keyboard-model', sanitised_string(document.getElementById('keyboard-model').value));
    sessionStorage.setItem('keyboard-condition', sanitised_string(document.getElementById('keyboard-condition').value));
}
/*
-----[Initial Calls]
*/
create_evaluation_steps();
display_current_target_key();
display_progression_information();
target_key_readout.classList.add('hide-text');