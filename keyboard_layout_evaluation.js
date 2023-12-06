/*
-----[Variable Declaration]
*/
let key_frequencies = [
    // Arrow Keys
    {key_name: "Left Arrow",    key_code: "ArrowLeft",      key_frequency: .65},
    {key_name: "Right Arrow",   key_code: "ArrowRight",     key_frequency: .65},
    {key_name: "Up Arrow",      key_code: "ArrowUp",        key_frequency: .65},
    {key_name: "Down Arrow",    key_code: "ArrowDown",      key_frequency: .65},
    // Function Keys
    {key_name: "F1",            key_code: "F1",             key_frequency: 0},
    {key_name: "F2",            key_code: "F2",             key_frequency: 0},
    {key_name: "F3",            key_code: "F3",             key_frequency: 0},
    {key_name: "F4",            key_code: "F4",             key_frequency: 0},
    {key_name: "F6",            key_code: "F6",             key_frequency: 0},
    {key_name: "F7",            key_code: "F7",             key_frequency: 0},
    {key_name: "F8",            key_code: "F8",             key_frequency: 0},
    {key_name: "F9",            key_code: "F9",             key_frequency: 0},
    {key_name: "F10",           key_code: "F10",            key_frequency: 0},
    {key_name: "F12",           key_code: "F12",            key_frequency: 0},
    // Number Row
    {key_name: "1",             key_code: "Digit1",         key_frequency: .25},
    {key_name: "2",             key_code: "Digit2",         key_frequency: .25},
    {key_name: "3",             key_code: "Digit3",         key_frequency: .25},
    {key_name: "4",             key_code: "Digit4",         key_frequency: .25},
    {key_name: "5",             key_code: "Digit5",         key_frequency: .25},
    {key_name: "6",             key_code: "Digit6",         key_frequency: .25},
    {key_name: "7",             key_code: "Digit7",         key_frequency: .25},
    {key_name: "8",             key_code: "Digit8",         key_frequency: .25},
    {key_name: "9",             key_code: "Digit9",         key_frequency: .25},
    {key_name: "0",             key_code: "Digit0",         key_frequency: .25},
    // Common Gaming Keys
    {key_name: "Left Shift",    key_code: "ShiftLeft",      key_frequency: .45},
    {key_name: "Left Control",  key_code: "ControlLeft",    key_frequency: .45},
    {key_name: "Tab",           key_code: "Tab",            key_frequency: .45},
    {key_name: "Space",         key_code: "Space",          key_frequency: .45},
    {key_name: "W",             key_code: "KeyW",           key_frequency: .75},
    {key_name: "A",             key_code: "KeyA",           key_frequency: .75},
    {key_name: "S",             key_code: "KeyS",           key_frequency: .75},
    {key_name: "D",             key_code: "KeyD",           key_frequency: .75},
    {key_name: "Q",             key_code: "KeyQ",           key_frequency: .3},
    {key_name: "E",             key_code: "KeyE",           key_frequency: .3},
    {key_name: "C",             key_code: "KeyC",           key_frequency: .3},
    {key_name: "F",             key_code: "KeyF",           key_frequency: .3},
    {key_name: "Escape",        key_code: "Escape",         key_frequency: .1},
]

let evaluation_step_count= 50;
let evaluation_steps= [];

let task_index = 0;
let task_completed = false;

let during_task_data_collection = [];
let output_data = [];

let progression_readout= document.getElementById('progress-visualisation');
let target_key_readout= document.getElementById('target-key');
/*
-----[System Events]
*/
document.addEventListener('keydown', function(event) {
    if (task_completed) return;
    calculate_user_performance(event, validate_user_input(event));
    progress_evaluation_task();
    display_progression_information();
});
/*
-----[Core Logic]
*/
function validate_user_input(event){
    // console.log(`${event.code} (${target_key().key_code})`);
    return event.code ===  target_key().key_code;
}
function calculate_user_performance(event, correct_input){
    during_task_data_collection.push({
        event: event, correct_input: correct_input
    });
}
function progress_evaluation_task(){
    task_index++;
    if (task_index >= evaluation_step_count){
        on_task_completed();
    } else {
        display_current_target_key();
    }
}
function on_task_completed(){
    task_completed = true;
    calculate_task_performance();
    download_generated_data(output_data);
}
function create_evaluation_steps(){
    for (let i = 0; i < evaluation_step_count; i++) {
        evaluation_steps.push(generate_target_keys());
    }
}
/*
-----[Data Processing]
*/
function calculate_task_performance(){
    for (let i = 1; i < evaluation_step_count; i++) {
        let current_input = during_task_data_collection[i];
        let previous_input = during_task_data_collection[i-1];
        output_data.push({
            input_target: current_input.event.code,
            input_duration: current_input.event.timeStamp - previous_input.event.timeStamp,
            previous_input: previous_input.event.code,
            correct_input: current_input.correct_input
        });
    }
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
    target_key_readout.innerHTML = target_key().key_name;
}
function display_progression_information(){
    progression_readout.innerHTML = `(${task_index + 1}/${evaluation_step_count})`;
}
function generate_target_keys(){
    let key_distribution = [];
    key_frequencies.forEach(key=>{
        let normalised_frequency = key.key_frequency * 100;
        for (let i = 0; i < normalised_frequency; i++) {
            key_distribution.push({
                key_name: key.key_name,    
                key_code: key.key_code
            });
        }
    })
    return key_distribution[get_random_int(0, key_distribution.length)];
}
function target_key(){
    return evaluation_steps[task_index];
}
function get_random_int(min, max) {
    return Math.floor(Math.random() * ((max - 1) - min + 1)) + min;
}
/*
-----[Initial Calls]
*/
create_evaluation_steps();
display_current_target_key();
display_progression_information();