let body = document.getElementById('body');

let fitts_canvas = document.getElementById('fitts-canvas');
let fitts_context = fitts_canvas.getContext('2d');
let fitts_rect = fitts_canvas.getBoundingClientRect();

let debug_canvas = document.getElementById('debug-canvas');
let debug_context = debug_canvas.getContext('2d');
let debug_rect = debug_canvas.getBoundingClientRect();

let readout = document.getElementById('readout');

let mouse_position = {x: 0, y: 0};
let center = {x: 0, y: 0};
let last_click_data = {x: 0, y: 0, timestamp: 0};

let random = false;

let dpr = 1;
let size = 600;

let targets = [];
let section_performance_data = [];
let all_performance_data = [];
let csv = [];

let target_index = 0;
let previous_target_index = 0;
let task_index = 0;
let section_index = 0;
let action_index = 0;

let active_target_color = "#FF0000";
let visible_inactive_target_color = "#DDDDDD";
let invisible_inactive_target_color = "#FFFFFF";

fitts_canvas.addEventListener('mousemove', trace);
fitts_canvas.addEventListener('mousedown', click);
window.addEventListener('resize', rescale);

let sections = [
    { points: 15, radius: 100, size: 75 },
    { points: 15, radius: 125, size: 50 },
    { points: 15, radius: 150, size: 25 },
    { points: 15, radius: 250, size: 5 },
]
function trace(event) {
    set_mouse_position(event);
    readout.innerText = `
        mouse position: (${Math.ceil(get_mouse_position().x)}, ${Math.ceil(get_mouse_position().y)})
        cursor local position: (${local_cursor_position().x.toFixed(2)}, ${local_cursor_position().y.toFixed(2)})
        
        target position (${target_index}): (${targets[target_index].x.toFixed(2)}, ${targets[target_index].y.toFixed(2)})
        normalised position: (${normalised_local_position().x.toFixed(2)}, ${normalised_local_position().y.toFixed(2)})
        `;
}
function click(event) {
    set_mouse_position(event);

    draw_line(debug_context, current_target(), get_mouse_position(), '#DDDDDD');
    draw_circle(debug_context, get_mouse_position(), 2, 'black');
    draw_circle(debug_context, last_click_data, 2, '#DDDDDD');
    
    let on_target = evaluate_click_accuracy();
    if (on_target && task_index > 0) {
        calculate_throughput();
    }
    
    
    update_target_index();
    update_section_index();
    
    render_targets();
    cache_click_data();
}
function calculate_throughput() {
    let amplitude = distance_between_points(current_target(), previous_target());
    let width = (sections[section_index].size * 2);
    let movement_time_ms = (new Date() - last_click_data.timestamp);
    let movement_time_s = movement_time_ms / 1000;

    let index_of_difficulty = Math.log2((amplitude / width) + 1);
    let throughput = index_of_difficulty / movement_time_s;
    
    draw_line(debug_context, get_center(), convert_to_local_space(get_center(), normalised_local_position()), 'grey');
    draw_circle(debug_context, convert_to_local_space(get_center(), normalised_local_position()).x, convert_to_local_space(get_center(), normalised_local_position()).y, 'black');
    
    let data = {
        'amplitude': amplitude,
        'width': width,
        'movement_time_ms': movement_time_ms,
        'movement_time_s': movement_time_s,
        'index_of_difficulty': index_of_difficulty,
        'throughput': throughput,
        'target': current_target(),
        'global_cursor_position': get_mouse_position(),
        'local_cursor_position': local_cursor_position(),
        'relative_cursor_position': normalised_local_position(),
        'approach_vector': normalised_vector(approach_vector()),
        'perpendicular_vector': normalised_vector(perpendicular_vector(approach_vector())),
        'section_index': section_index,
        'action_index': action_index,
        'task_type' : random_mode() ? 'random_position' : 'circular_points'
    }
    console.log(data);
    section_performance_data.push(data);
    action_index++;
}
function approach_vector(){
    return {
        x: get_mouse_position().x - targets[target_index].x,
        y: get_mouse_position().y - targets[target_index].y
    };
    // return {
    //     x: targets[previous_target_index].x - targets[target_index].x,
    //     y: targets[previous_target_index].y - targets[target_index].y
    // };
}
function evaluate_click_accuracy() {
    let any_target_clicked = false;
    let correct_target_clicked = false;
    targets.forEach(target =>{
        if (target_clicked(target)) {
            any_target_clicked = true;
            if (was_correct_target_clicked(target)){
                correct_target_clicked = true;
                on_correct_target_clicked(target);
            }
        }
    })
    if (!any_target_clicked || !correct_target_clicked){
        on_correct_target_not_clicked(targets[target_index]);
    }
    return correct_target_clicked;
}
function on_correct_target_clicked(target){
    // target.color = successful_target_color;
}
function on_correct_target_not_clicked(target) {
    // target.color = unsuccessful_target_color;
}
function was_correct_target_clicked(target){
    return target.index === target_index;
}
function generate_targets(){
    clear_canvas(fitts_context, fitts_canvas);
    calculate_target_parameters();
    render_targets();
}

initial_scaling();
generate_targets();

function calculate_target_parameters(){
    let section = sections[section_index];
    targets = [];
    
    if (random_mode()) {
        let size = section.size;
        let border = {
            x_max: fitts_canvas.width - size,
            x_min: size,
            y_max: fitts_canvas.height - size,
            y_min: size
        }
        let start_point = generate_random_point_in_border(border);
        targets.push({
            x: start_point.x,
            y: start_point.y,
            size: section.size,
            index: 0,
            color: invisible_inactive_target_color});
        for (let i = 1; i < section.points; i++) {
            let seed = {
                x: targets[i - 1].x, 
                y: targets[i - 1].y };
            let point = generate_seeded_point_in_border(seed, section.radius, border)
            targets.push({
                x: point.x,
                y: point.y,
                size: section.size,
                index: i,
                color: invisible_inactive_target_color});
        }
    } else {
        for (let i = 0; i < section.points; i++) {
            const angle = (i / section.points) * 2 * Math.PI;
            let target = {
                x: center.x + section.radius * Math.cos(angle),
                y: center.y + section.radius * Math.sin(angle),
                size: section.size,
                index: i,
                color: visible_inactive_target_color};
            targets.push(target);
        }
    }
}
function generate_random_point_in_border(border) {
    let x = get_random_int(border.x_min, border.x_max);
    let y = get_random_int(border.y_min, border.y_max);
    return {x: x, y: y};
}
function generate_seeded_point_in_border(start_point, magnitude, border){
    let point = generate_seeded_point(start_point, magnitude);
    while (!is_point_in_border(point, border)) {
        point = generate_seeded_point(start_point, magnitude);
    }
    return point;
}
function generate_seeded_point(start_point, magnitude) {
    let angle = Math.random() * 2 * Math.PI;
    let x = Math.cos(angle) * magnitude;
    let y = Math.sin(angle) * magnitude;
    let vector = { x: x, y: y };
    return vector_end_point(start_point, vector);
}
function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function is_point_in_border(point, border) {
    let within_x = point.x > border.x_min && point.x < border.x_max;
    let within_y = point.y > border.y_min && point.y < border.y_max;
    return within_x && within_y;
}
function update_target_index(){
    previous_target_index = target_index;
    calculate_next_target_index();
}
function update_section_index(){
    if (task_index < targets.length) return;
    calculate_two_dimensional_fitts_data();
    
    section_index++;
    if (section_index >= sections.length) {
        // todo handle the end of the evaluation properly
        random = !random;
        section_index = 0;
        generate_csv_data();
        download_all_performance_data();
    }

    target_index = 0;
    task_index = 0;
    generate_targets();
}
function calculate_two_dimensional_fitts_data(){
    let mean_position = { x: 0, y: 0 };
    let mean_distance = { x: 0, y: 0 };
    let mean_square_difference = { x: 0, y: 0 };
    let standard_deviation_distances = { x: 0, y: 0 };
    let effective_position = { x: 0, y: 0 };
    
    let mean_length = section_performance_data.length;

    section_performance_data.forEach(data => {
        mean_position.x += data.relative_cursor_position.x;
        mean_position.y += data.relative_cursor_position.y;
    })
    mean_position.x /= mean_length;
    mean_position.y /= mean_length;

    section_performance_data.forEach(data => {
        let distance = {
            x: mean_position.x - data.relative_cursor_position.x,
            y: mean_position.y - data.relative_cursor_position.y
        }
        mean_distance.x += distance.x;
        mean_distance.y += distance.y;

        data.distance = distance;
    })
    mean_distance.x /= mean_length;
    mean_distance.y /= mean_length;

    section_performance_data.forEach(data => {
        let square_difference = {
            x: Math.pow((data.distance.x - mean_distance.x), 2),
            y: Math.pow((data.distance.y - mean_distance.y), 2),
        }
        mean_square_difference.x += square_difference.x;
        mean_square_difference.y += square_difference.y;

        data.square_difference = square_difference;
    })
    mean_square_difference.x /= mean_length;
    mean_square_difference.y /= mean_length;

    standard_deviation_distances.x = Math.sqrt(mean_square_difference.x);
    standard_deviation_distances.y = Math.sqrt(mean_square_difference.y);

    effective_position.x = 4.133 * standard_deviation_distances.x;
    effective_position.y = 4.133 * standard_deviation_distances.y;

    let effective_amplitude = 0;
    section_performance_data.forEach(data => {
        effective_amplitude += data.amplitude;
    })
    effective_amplitude /= mean_length;

    let effective_width = Math.min(effective_position.x, effective_position.y);
    let effective_index_of_difficulty = Math.log2((effective_amplitude / effective_width) + 1);

    section_performance_data.forEach(data => {
        all_performance_data.push({
            'amplitude': data.amplitude,
            'effective_amplitude': effective_amplitude,
            'width': data.width,
            'effective_width': effective_width,
            'index_of_difficulty': data.index_of_difficulty,
            'effective_index_of_difficulty': effective_index_of_difficulty,
            'throughput': data.throughput,
            'effective_throughput': calculate_effective_throughput(effective_index_of_difficulty, data.movement_time_s),
            'movement_time_ms': data.movement_time_ms,
            'target': data.target,
            'global_cursor_position': data.global_cursor_position,
            'local_cursor_position': data.local_cursor_position,
            'relative_cursor_position': data.relative_cursor_position,
            'approach_vector': data.approach_vector,
            'perpendicular_vector': data.perpendicular_vector,
            'section_index': data.section_index,
            'action_index': data.action_index,
            'task_type' : data.task_type
        });
    })
    section_performance_data = [];
}
function calculate_effective_throughput(effective_index_of_difficulty, movement_time) {
    return effective_index_of_difficulty / movement_time;
}
function calculate_next_target_index(){
    if (random_mode()){
        target_index++;
    } else {
        let increment = Math.ceil(targets.length / 2);
        let decrement = increment - 1;
        if (task_index % 2 === 0){
            target_index += increment;
        }
        else {
            target_index -= decrement;
        }   
    }
    task_index++;
}
function render_targets() {
    clear_canvas(fitts_context, fitts_canvas);
    for (let i = 0; i < targets.length; i++) {
        draw_circle(fitts_context, targets[i], targets[i].size,  targets[i].color, true, false);
    }
    draw_circle(fitts_context, current_target(), current_target().size,  active_target_color, true, false);
    render_debug_lines();
}
function render_debug_lines(){
    for (let i = 0; i < targets.length; i++) {
        draw_circle(debug_context, targets[i], targets[i].size,  '#EEEEEE', false, true);
    }
    if (task_index > 0) {
        draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(approach_vector(), current_target().size)), '#add8e6');
        draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(perpendicular_vector(approach_vector()), current_target().size)), '#e6adbc');
    }
}
function random_mode(){
    return random;
}
function generate_csv_data(){
    csv.push({
        'amplitude': 'amplitude',
        'effective_amplitude': 'effective_amplitude',
        'width': 'width',
        'effective_width': 'effective_width',
        'index_of_difficulty': 'index_of_difficulty',
        'effective_index_of_difficulty': 'effective_index_of_difficulty',
        'throughput': 'throughput',
        'effective_throughput': 'effective_throughput',
        'movement_time_ms': 'movement_time_ms',
        'target_position_x': 'target_position_x',
        'target_position_y': 'target_position_y',
        'global_cursor_position_x': 'global_cursor_position_x',
        'global_cursor_position_y': 'global_cursor_position_y',
        'local_cursor_position_x': 'local_cursor_position_x',
        'local_cursor_position_y': 'local_cursor_position_y',
        'relative_cursor_position_x': 'relative_cursor_position_x',
        'relative_cursor_position_y': 'relative_cursor_position_y',
        'approach_vector_x': 'approach_vector_x',
        'approach_vector_y': 'approach_vector_y',
        'perpendicular_vector_x': 'perpendicular_vector_x',
        'perpendicular_vector_y': 'perpendicular_vector_y',
        'section_index': 'section_index',
        'action_index': 'action_index',
        'task_type': 'task_type'
    });
    all_performance_data.forEach(data => {
        csv.push({
            'amplitude': data.amplitude,
            'effective_amplitude': data.effective_amplitude,
            'width': data.width,
            'effective_width': data.effective_width,
            'index_of_difficulty': data.index_of_difficulty,
            'effective_index_of_difficulty': data.effective_index_of_difficulty,
            'throughput': data.throughput,
            'effective_throughput': data.effective_throughput,
            'movement_time_ms': data.movement_time_ms,
            'target_position_x': data.target.x,
            'target_position_y': data.target.y,
            'global_cursor_position_x': data.global_cursor_position.x,
            'global_cursor_position_y': data.global_cursor_position.y,
            'local_cursor_position_x': data.local_cursor_position.x,
            'local_cursor_position_y': data.local_cursor_position.y,
            'relative_cursor_position_x': data.relative_cursor_position.x,
            'relative_cursor_position_y': data.relative_cursor_position.y,
            'approach_vector_x' : data.approach_vector.x,
            'approach_vector_y' : data.approach_vector.y,
            'perpendicular_vector_x': data.perpendicular_vector.x,
            'perpendicular_vector_y': data.perpendicular_vector.y,
            'selection_index' : data.section_index,
            'action_index' : data.action_index,
            'task_type' : data.task_type
        })
    });
}
/*
    VECTOR FUNCTIONS
*/
function normalised_vector(vector, length = 1) {
    let magnitude = vector_magnitude(vector);
    if (magnitude > 0) {
        return {
            x: (vector.x /= magnitude) * length,
            y: (vector.y /= magnitude) * length
        }
    }
    else return { x: 0, y: 0 };
}
function vector_magnitude(vector){
    return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
}
function normalised_local_position() {
    let normalised = normalised_vector(approach_vector());
    let perpendicular = normalised_vector(perpendicular_vector(approach_vector()));
    let local_x = (local_cursor_position().x * normalised.x) + (local_cursor_position().y * normalised.y);
    let local_y = (local_cursor_position().x * perpendicular.x) + (local_cursor_position().y * perpendicular.y);
    return {
        x: local_x,
        y: local_y };
}
function perpendicular_vector(vector) {
    return {
        x: (vector.y) * -1, 
        y: (vector.x) * 1 
    };
}
function vector_end_point(start_point, vector){
    return {
        x: start_point.x + vector.x,
        y: start_point.y + vector.y
    }
}
/*
    REFERENCES
*/
function current_target() {
    return targets[target_index];
}
function previous_target() {
    return targets[previous_target_index];
}
/*
    GENERAL UTILITIES
*/
function set_mouse_position(event){
    mouse_position.x = event.clientX - fitts_rect.left;
    mouse_position.y = event.clientY - fitts_rect.top;
}
function get_mouse_position(){
    return mouse_position;
}
function convert_to_local_space(point, origin){
    return {
        x: point.x - origin.x,
        y: point.y - origin.y
    };
}
function local_cursor_position() {
    return convert_to_local_space(get_mouse_position(), { x: current_target().x, y: current_target().y})
}
function draw_line(context, start_point, end_point, color) {
    context.beginPath();
    context.moveTo(
        start_point.x,
        start_point.y);
    context.lineTo(
        end_point.x,
        end_point.y)
    context.strokeStyle = color;
    context.stroke();
}
function draw_circle(context, center, size, color, fill = false, stroke = true){
    context.beginPath();
    context.arc(center.x, center.y, size, 0, 2 * Math.PI);
    if (fill){
        context.fillStyle = color;
        context.fill();
    }
    if (stroke){
        context.strokeStyle = color;
        context.stroke();
    }
}
function target_clicked(target){
    return distance_from_mouse(target) <= target.size;
}
function distance_from_mouse(target){
    return distance(
        get_mouse_position().x,
        get_mouse_position().y,
        target.x,
        target.y);
}
function distance_between_points(target_a, target_b){
    return distance(target_a.x, target_a.y, target_b.x, target_b.y);
}
function distance(x_a, y_a, x_b, y_b){
    let x = x_a - x_b;
    let y = y_a - y_b;
    return Math.sqrt(x * x + y * y);
}
function cache_click_data(){
    last_click_data.x = get_mouse_position().x;
    last_click_data.y = get_mouse_position().y;
    last_click_data.timestamp = new Date();
}
function initial_scaling(){
    dpr = window.devicePixelRatio || 1;
    if (base_dpr() === null){
        console.log(`set base dpr to ${dpr}`);
        localStorage.setItem('dpr', dpr);
    } else {
        let factor = base_dpr() / dpr;
        if (factor === 1) {
            console.log('scales match')
        } else {
            scale_body();
        }
    }
    console.log(`initial dpr: ${dpr}`);
    
    fitts_rect = scale_canvas(fitts_canvas, fitts_context);
    debug_rect = scale_canvas(debug_canvas, debug_context);
    calculate_center(dpr);
}
function scale_canvas(canvas, context) {
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    
    context.scale(dpr, dpr);

    return canvas.getBoundingClientRect();
}

function rescale(){
    let previous = dpr;
    dpr = window.devicePixelRatio || 1;
    if (dpr === previous){
        console.log(`resized, no dpr change`);
    } else {
        scale_body();
    }
}
function scale_body(){
    let factor = base_dpr() / dpr;
    console.log(`scale factor: ${factor}`)
    body.style.transform = `scale(${factor})`;
}
function calculate_center(dpr){
    center.x = (fitts_canvas.width / dpr) * .5;
    center.y = (fitts_canvas.height / dpr) * .5;
}
function get_center(){
    return center;
}
function clear_canvas(context, canvas){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}
function base_dpr(){
    return localStorage.getItem('dpr');
}
async function download_all_performance_data(){
    let download = csv.map(row => Object.values(row).join(',')).join('\n');
    let blob = new Blob([download], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'all_performance_data.csv');
    link.click();
}
window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=' || event.key === '-')) {
        event.preventDefault();
    }
});