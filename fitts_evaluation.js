/*
------------------------------------------------------------------------------------------------------------------------DATA LOSS PREVENTION
*/
let submitted = false;
window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});
/*
------------------------------------------------------------------------------------------------------------------------ASSIGNMENTS
*/
let body = document.getElementById('body');
let evaluation_tasks_element = document.getElementById('fe-evaluation-tasks');
let canvas_area_element = document.getElementById('fe-canvas-container-area');
let restart_required_element = document.getElementById('fe-evaluation-restart-required');
let restart_required_error_message = document.getElementById('fe-eval-restart-required-error');
let restart_required_resize_message = document.getElementById('fe-eval-restart-required-resize');
let full_analytics_download_element = document.getElementById('fe-full-analytics-download-buffer');
let help_box_element = document.getElementById('fe-eval-task-help-box');

let non_canvas_element = document.getElementById('fe-non-canvas-area');

let fitts_canvas = document.getElementById('fitts-canvas');
let fitts_context = fitts_canvas.getContext('2d');
let fitts_rect = fitts_canvas.getBoundingClientRect();

let debug_canvas = document.getElementById('debug-canvas');
let debug_context = debug_canvas.getContext('2d');
let debug_rect = debug_canvas.getBoundingClientRect();

let mouse_position = {x: 0, y: 0};
let last_click_data = { 
    position : { x: 0, y: 0,}, 
    timestamp: 0};
let scroll_target_position = {x: 0, y: 0};

let evaluation_types = {
    'reciprocal_targets_two_dimensional':   'reciprocal_targets_two_dimensional',
    'random_targets_two_dimensional':       'random_targets_two_dimensional',
    'reciprocal_targets_one_dimensional':   'reciprocal_targets_one_dimensional'
}

let evaluation_type = evaluation_types.reciprocal_targets_two_dimensional;

let evaluation_task_in_progress = false;

let dpr = 1;
let size = 700;

let uid = Date.now().toString();
sessionStorage.setItem('uid', uid);

let targets = [];
let section_performance_data = [];
let all_performance_data = [];
let blended_analytic_data = [];

let target_index = 0;
let previous_target_index = 0;
let task_index = 0;
let section_index = 0;
let action_index = 0;

let active_target_color = "#fb7474";
let visible_inactive_target_color = "#F2F2F2";
let invisible_inactive_target_color = "#ffffff";

fitts_canvas.addEventListener('mousemove', trace);
document.addEventListener('mousedown', click);
document.addEventListener('wheel', scroll);
window.addEventListener('resize', rescale);

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

let two_dimensional_evaluation_sections = [
    { points: 11, radius: 100, size: 75 },
    { points: 11, radius: 125, size: 50 },
    { points: 11, radius: 150, size: 25 },
    { points: 11, radius: 200, size: 15 },
    { points: 11, radius: 250, size: 10 },
    { points: 11, radius: 300, size: 5 }
]
let one_dimensional_evaluation_sections = [
    { tasks: 4, amplitude: 100, width: 40 },
    { tasks: 4, amplitude: 150, width: 30 },
    { tasks: 4, amplitude: 200, width: 20 },
    { tasks: 4, amplitude: 300, width: 10 }
]
/*
------------------------------------------------------------------------------------------------------------------------URL PARSING
*/
let url = new URL(window.location.href);
let debug_check = url.searchParams.get('debug') !== null;
let full_analytics = url.searchParams.get('analytics') !== null;
let gliding_only = url.searchParams.get("gliding_only") !== null;
let mouse_gliding_only = url.searchParams.get("mouse_gliding_only") !== null;
let premium_keycaps = url.searchParams.get("premium_keycaps") !== null;

let no_scrolling = gliding_only || premium_keycaps || mouse_gliding_only;

let query_string = "";
extract_query_parameters(url.toString());
function extract_query_parameters(url_string) {
    let question_mark_index = url_string.indexOf("?");
    if (question_mark_index !== -1) {
        query_string = '?';
        query_string += url_string.substring(question_mark_index + 1);
    }
}
/*
------------------------------------------------------------------------------------------------------------------------MANAGE ADDITIONAL STATES
*/
debug_canvas.style.display = debug_check
    ? 'block'
    : 'none';
console.log(debug_check
    ? 'Debug Visualisations Enabled'
    : 'Debug Visualisations Disabled');
console.log(full_analytics
    ? 'Full Analytics Enabled'
    : 'Full Analytics Disabled');
console.log(no_scrolling
    ? 'Only 2D Evaluation Tasks'
    : 'All Evaluation Tasks');
if (no_scrolling){
    document.getElementById('fe-intro-explainer-third-task').style.display = 'none';
}
/*
------------------------------------------------------------------------------------------------------------------------SYSTEM EVENTS
*/
function trace(event) {
    set_cursor_position(event);
    calculate_polling_rate();
    calculate_velocity();
}
function click(event) {
    if (fitts_canvas.style.display === 'none') return;
    if (event.button === 0 && two_dimensional_evaluation_task()) {
        on_left_click();
        calculate_progress_bar_width();
    }
    if (event.button === 1 && one_dimensional_evaluation_task()) {
        on_middle_click();
        calculate_progress_bar_width();
    }
}
function on_left_click() {
    if (!evaluation_task_in_progress) return;
    
    draw_line(debug_context, current_target(), get_user_input_position(), '#dddddd');
    draw_circle(debug_context, get_user_input_position(), 2, '#dddddd', false, true);
    draw_circle(debug_context, get_last_click_position(), 2, '#ffffff', false, true);

    let on_target = evaluate_two_dimensional_click_accuracy();
    if (on_target && task_index === 0) {
        start_calculating_polling_rate();
        start_calculating_velocity();
        cache_screen_dimension_data();
    }
    if (on_target && task_index > 0) {
        calculate_throughput();
    }

    update_target_index();
    update_section_index();
    render_targets();
    cache_input_location_data();
}
function on_middle_click() {
    draw_line(debug_context, current_target(), get_user_input_position(), '#dddddd');
    draw_circle(debug_context, get_user_input_position(), 2, '#dddddd', false, true);
    draw_circle(debug_context, get_last_click_position(), 2, '#ffffff', false, true);

    let on_target = evaluate_one_dimensional_click_accuracy();
    if (on_target && task_index === 0) {
        start_calculating_velocity();
    }
    if (on_target && task_index > 0) {
        calculate_throughput();
    }

    update_target_index();
    update_section_index();
    render_targets();
    cache_input_location_data();
}
function scroll(event) {
    update_scroll_position(event.deltaY);
    render_targets();
    calculate_velocity();
}
/*
------------------------------------------------------------------------------------------------------------------------PROGRESS EVALUATION
*/
let attempted_task_count = 0;
let total_task_count = 0;
let progress_bar = document.getElementById('progress-bar');
calculate_total_task_count();
function calculate_total_task_count(){
    two_dimensional_evaluation_sections.forEach(function (task) {
        total_task_count += task.points; // Once for reciprocal task
        total_task_count += task.points; // Once for random task
    });
    if (no_scrolling) return;
    one_dimensional_evaluation_sections.forEach(function (task) {
        total_task_count += task.tasks;
    });
}
function calculate_progress_bar_width(){
    attempted_task_count++;
    let progress = (attempted_task_count / total_task_count) * 100;
    progress_bar.style.width = progress + '%';
}
/*
------------------------------------------------------------------------------------------------------------------------CALCULATION & EVALUATION
*/
function calculate_throughput() {
    let amplitude = distance_between_points(current_target(), previous_target());
    let width = one_dimensional_evaluation_task() 
        ? one_dimensional_evaluation_sections[section_index].width
        : two_dimensional_evaluation_sections[section_index].size * 2;
    let movement_time_ms = (performance.now() - last_click_data.timestamp);
    let movement_time_s = movement_time_ms / 1000;

    let index_of_difficulty = Math.log2((amplitude / width) + 1);
    let throughput = index_of_difficulty / movement_time_s;
    
    draw_line(debug_context, get_center(), convert_to_local_space(get_center(), normalised_local_position()), 'black');
    draw_circle(debug_context, convert_to_local_space(get_center(), normalised_local_position()), 3, 'black');
    
    let data = {
        'amplitude': amplitude,
        'width': width,
        'movement_time_ms': movement_time_ms,
        'movement_time_s': movement_time_s,
        'index_of_difficulty': index_of_difficulty,
        'throughput': throughput,
        'target': current_target(),
        'global_cursor_position': get_user_input_position(),
        'local_cursor_position': input_position_relative_to_current_target(),
        'relative_cursor_position': normalised_local_position(),
        'approach_vector': normalised_vector(approach_vector()),
        'perpendicular_vector': normalised_vector(perpendicular_vector(approach_vector())),
        'section_index': section_index,
        'action_index': action_index,
        'task_type' : evaluation_type
    }
    section_performance_data.push(data);
    action_index++;
}
function evaluate_two_dimensional_click_accuracy() {
    let any_target_clicked = false;
    let correct_target_clicked = false;
    targets.forEach(target =>{
        if (target_clicked_with_cursor(target)) {
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
function evaluate_one_dimensional_click_accuracy(){
    let any_target_clicked = false;
    let correct_target_clicked = false;
    targets.forEach(target =>{
        if (target_clicked_with_scroll(target)) {
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
function was_correct_target_clicked(target){
    return target.index === target_index;
}
function generate_targets(){
    error_count = 0;
    clear_canvas(fitts_context, fitts_canvas);
    initialise_scroll_position();
    calculate_target_parameters();
    render_targets();
}
/*
------------------------------------------------------------------------------------------------------------------------FIRST FUNCTION CALLS
*/
evaluate_scaling();
function initialise_scroll_position(){
    scroll_target_position = get_center();
}
function update_scroll_position(delta){
    scroll_target_position.y += (delta * .025);
    scroll_target_position.y = clamp_number_in_range(scroll_target_position.y, 0, size);
}
function initialise_evaluation() {
    document.getElementById('introduction').style.display = 'none';
    generate_evaluation_section();
    go_fullscreen();
}
function start_evaluation(){
    evaluation_task_in_progress = true;
    canvas_area_element.style.display = 'flex';
    non_canvas_element.style.display = 'none';
    fitts_canvas.style.display = 'block';
    help_box_element.style.display = 'block';
    reset_evaluation_blocks();
    show_evaluation_task_help();
}
function show_evaluation_task_help() {
    reset_evaluation_task_help();
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_two_dimensional:
            document.getElementById('reciprocal-targets-two-dimensional-help').style.display = 'block';
            break;
        case evaluation_types.random_targets_two_dimensional:
            document.getElementById('random-targets-two-dimensional-help').style.display = 'block';
            break;
        case evaluation_types.reciprocal_targets_one_dimensional:
            document.getElementById('reciprocal-targets-one-dimensional-help').style.display = 'block';
            break;
        default:
            break;
    }
}
function reset_evaluation_task_help(){
    document.getElementById('reciprocal-targets-two-dimensional-help').style.display = 'none';
    document.getElementById('random-targets-two-dimensional-help').style.display = 'none';
    document.getElementById('reciprocal-targets-one-dimensional-help').style.display = 'none';
}
function generate_evaluation_section() {
    display_evaluation_task_information();
    generate_targets();
}
/*
------------------------------------------------------------------------------------------------------------------------FULLSCREEN MANAGEMENT
*/
let should_be_fullscreen;
function go_fullscreen() {
    document.documentElement.requestFullscreen().then(() => should_be_fullscreen = true);
}
function exit_fullscreen() {
    document.exitFullscreen().then(() => should_be_fullscreen = false);
}
/*
------------------------------------------------------------------------------------------------------------------------SECTION REVELATION
*/
function display_evaluation_task_information() {
    evaluation_task_in_progress = false;
    help_box_element.style.display = 'none';
    reset_evaluation_blocks();
    hide_evaluation_canvas();
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_two_dimensional:
            document.getElementById('reciprocal-targets-two-dimensional').style.display = 'block';
            break;
        case evaluation_types.random_targets_two_dimensional:
            document.getElementById('random-targets-two-dimensional').style.display = 'block';
            break;
        case evaluation_types.reciprocal_targets_one_dimensional:
            document.getElementById('reciprocal-targets-one-dimensional').style.display = 'block';
            break;
        default:
            break;
    }
}
function reset_evaluation_blocks(){
    document.getElementById('reciprocal-targets-two-dimensional').style.display = 'none';
    document.getElementById('random-targets-two-dimensional').style.display = 'none';
    document.getElementById('reciprocal-targets-one-dimensional').style.display = 'none';
}
function hide_evaluation_canvas() {
    non_canvas_element.style.display = 'block';
    canvas_area_element.style.display = 'none';
    reset_evaluation_task_help();
}
/*
------------------------------------------------------------------------------------------------------------------------TARGET GENERATION
*/
function calculate_target_parameters(){
    targets = [];
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_two_dimensional:
            generate_reciprocal_two_dimensional_targets(two_dimensional_evaluation_sections[section_index]);
            break;
        case evaluation_types.random_targets_two_dimensional:
            generate_random_two_dimensional_targets(two_dimensional_evaluation_sections[section_index]);
            break;
        case evaluation_types.reciprocal_targets_one_dimensional:
            generate_reciprocal_one_dimensional_targets(one_dimensional_evaluation_sections[section_index]);
            break;
        default:
            break;
    }
}
function generate_reciprocal_two_dimensional_targets(section){
    for (let i = 0; i < section.points; i++) {
        const angle = (i / section.points) * 2 * Math.PI;
        let target = {
            x: get_center().x + section.radius * Math.cos(angle),
            y: get_center().y + section.radius * Math.sin(angle),
            size: section.size,
            index: i,
            color: visible_inactive_target_color};
        targets.push(target);}
}
function generate_random_two_dimensional_targets(section){
    let size = section.size;
    let horizontal_skew = (fitts_canvas.height / dpr) * .3;
    let border = {
        x_max: (fitts_canvas.width / dpr) - size,
        x_min: size,
        y_max: ((fitts_canvas.height / dpr) - size - horizontal_skew),
        y_min: (size + horizontal_skew) 
    }
    let start_point = get_center();
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
function is_point_in_border(point, border) {
    let within_x = point.x > border.x_min && point.x < border.x_max;
    let within_y = point.y > border.y_min && point.y < border.y_max;
    return within_x && within_y;
}

function generate_reciprocal_one_dimensional_targets(section) {
    initialise_scroll_position();
    for (let i = 0; i < section.tasks; i++) {
        let y_position = get_center().y;
        if (i % 2 === 0){
            y_position += section.amplitude / 2;
        } else {
            y_position -= section.amplitude / 2;
        }
        let target = {
            x: get_center().x,
            y: y_position,
            size: section.width,
            index: i,
            color: visible_inactive_target_color};
        targets.push(target);}
}
function generate_random_one_dimensional_targets(section) {
    initialise_scroll_position();
    let start_point_parameters = generate_randomised_point(section);
    targets.push({
        x: get_center().x,
        y: generate_point_in_limits(start_point_parameters),
        size: start_point_parameters.width,
        index: 0,
        color: '#ffffff'});
    for (let i = 1; i < section.tasks; i++) {
        let seed = targets[i - 1].y;
        let point_parameters = generate_randomised_point(section);
        targets.push({
            x: get_center().x,
            y: generate_seeded_point_in_limits(seed, point_parameters),
            size: point_parameters.width,
            index: i,
            color: '#ffffff'});
    }
}
function generate_randomised_point(section){
    let width_range = Math.round(section.width / 2);
    let amplitude_range = Math.round(section.amplitude / 2);
    return { 
        width : get_random_int(section.width - width_range, section.width + width_range), 
        amplitude : get_random_int(section.amplitude - amplitude_range, section.amplitude + amplitude_range)}
}
function generate_point_in_limits(point_parameters) {
    let actual_width = point_parameters.width * 2;
    let limits = {
        min: actual_width,
        max: (fitts_canvas.height - actual_width)
    }
    return get_random_int(limits.min, limits.max);
}
function generate_seeded_point_in_limits(seed, point_parameters) {
    let actual_width = point_parameters.width * 2;
    let limits = {
        min: actual_width,
        max: (fitts_canvas.height - actual_width)
    }
    let target_points = {
        upwards_point: seed + point_parameters.amplitude,
        downwards_point: seed - point_parameters.amplitude
    }
    let flipper = get_random_int(0, 9) % 2 === 0;
    let upwards_valid = is_point_in_limits(target_points.upwards_point, limits);
    let downwards_valid = is_point_in_limits(target_points.downwards_point, limits);
    let invalid_parameters = !(upwards_valid || downwards_valid);    
    if (invalid_parameters) {
        return generate_point_in_limits(point_parameters);
    }
    if (flipper) {
        if (upwards_valid) {
            return target_points.upwards_point;
        } else {
            return target_points.downwards_point;
        }
    } else {
        if (downwards_valid) {
            return target_points.downwards_point;
        } else {
            return target_points.upwards_point;
        }
    }
}
function is_point_in_limits(point, limits){
    return point > limits.min && point < limits.max;
}
/*
------------------------------------------------------------------------------------------------------------------------INDEX CALCULATION
*/
function update_section_index(){
    if (task_index < targets.length) return;
    cache_performance_data();
    section_index++;
    clear_canvas(debug_context, debug_canvas);
    if (should_move_to_next_section()) {
        stop_calculating_polling_rate();
        stop_calculating_velocity();
        section_index = 0;
        get_next_evaluation_type();
        display_evaluation_task_information();
    }

    target_index = 0;
    task_index = 0;
    generate_targets();
}
function should_move_to_next_section(){
    return section_index >= current_evaluation_type_length();
}
function cache_performance_data(){
    if (one_dimensional_evaluation_task()) {
        cache_one_dimensional_parameters();
    } else if (two_dimensional_evaluation_task()) {
        calculate_effective_parameters();
    }
}
function current_evaluation_type_length(){
    if (one_dimensional_evaluation_task()) {
        return one_dimensional_evaluation_sections.length;
    } else return two_dimensional_evaluation_sections.length;
}
function get_next_evaluation_type() {
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_two_dimensional:
            evaluation_type = evaluation_types.random_targets_two_dimensional;
            break;
        case evaluation_types.random_targets_two_dimensional:
            if (no_scrolling) {
                hide_everything();
                finish_fitts_evaluation();
                break;
            }
            evaluation_type = evaluation_types.reciprocal_targets_one_dimensional;
            break;
        case evaluation_types.reciprocal_targets_one_dimensional:
            finish_fitts_evaluation();
            break;
        default:
            break;
    }
}
function finish_fitts_evaluation(){
    submitted = true;
    exit_fullscreen();
    calculate_aggregate_performance_data();
    calculate_aggregate_correlation_data();
    if (full_analytics) {
        blended_analytic_data = generate_blended_data(all_performance_data, uid);
        show_download_buffer();
    } else {
        load_subjective_evaluation();
    }
}
function hide_everything(){
    document.getElementById('body').style.display = 'none';
}
function show_download_buffer(){
    help_box_element.style.display = 'none';
    evaluation_tasks_element.style.display = "none";
    full_analytics_download_element.style.display = "block";
}
function load_subjective_evaluation() {
    window.location.href = `mouse_subjective_evaluation.html${query_string}`;
}
/*
------------------------------------------------------------------------------------------------------------------------DATA ANALYSIS
*/
function cache_one_dimensional_parameters(){
    section_performance_data.forEach(data => {
        all_performance_data.push({
            'amplitude': data.amplitude,
            'width': data.width,
            'index_of_difficulty': data.index_of_difficulty,
            'throughput': data.throughput,
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
    });
    section_performance_data = [];
}
function calculate_effective_parameters(){
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
    });
    section_performance_data = [];
}
function calculate_effective_throughput(effective_index_of_difficulty, movement_time) {
    return effective_index_of_difficulty / movement_time;
}
/*
------------------------------------------------------------------------------------------------------------------------TARGET INDEX SELECTION
*/
function update_target_index(){
    previous_target_index = target_index;
    calculate_next_target_index();
}
function calculate_next_target_index(){
    if (evaluation_type === evaluation_types.reciprocal_targets_two_dimensional) {
        get_next_reciprocal_index();
    } else {
        get_next_linear_index();
    }
    task_index++;
}
function get_next_reciprocal_index(){
    let increment = Math.ceil(targets.length / 2);
    let decrement = increment - 1;
    if (task_index % 2 === 0){
        target_index += increment;
    }
    else {
        target_index -= decrement;
    }
}
function get_next_linear_index(){
    target_index++;
}
/*
------------------------------------------------------------------------------------------------------------------------RENDERING FUNCTIONS
*/
function render_targets() {
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_one_dimensional:
            render_one_dimensional_targets();
            debug_render_one_dimensional_targets();
            break;
        case evaluation_types.reciprocal_targets_two_dimensional:
            render_two_dimensional_targets();
            debug_render_two_dimensional_targets();
            break;
        case evaluation_types.random_targets_two_dimensional:
            render_two_dimensional_targets();
            debug_render_two_dimensional_targets();
            break;
        default:
            break;
    }
}
function render_two_dimensional_targets() {
    clear_canvas(fitts_context, fitts_canvas);
    for (let i = 0; i < targets.length; i++) {
        draw_circle(fitts_context, targets[i], targets[i].size,  targets[i].color, true, false);
    }
    draw_circle(fitts_context, current_target(), current_target().size,  active_target_color, true, false);
}
function debug_render_two_dimensional_targets(){
        for (let i = 0; i < targets.length; i++) {
            draw_circle(debug_context, targets[i], targets[i].size,  '#eeeeee', false, true);
        }
        if (task_index > 0) {
            draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(approach_vector(), current_target().size)), '#add8e6');
            draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(perpendicular_vector(approach_vector()), current_target().size)), '#e6adbc');
        }
}
function render_one_dimensional_targets() {
    let width = 650;
    clear_canvas(fitts_context, fitts_canvas);
    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        draw_rectangle(fitts_context, target, target.size * 2,  width, target.color, true, false);
    }
    draw_rectangle(fitts_context, current_target(), current_target().size * 2,  width, active_target_color, true, false);
    draw_rectangle(fitts_context, get_scroll_position(), 1, width, 'black', true, false);
}
function debug_render_one_dimensional_targets() {
    for (let i = 0; i < targets.length; i++) {
        draw_circle(debug_context, targets[i], targets[i].size,  '#eeeeee', false, true);
    }
    if (task_index > 0) {
        draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(approach_vector(), current_target().size)), '#add8e6');
        draw_line(debug_context, current_target(), vector_end_point(current_target(), normalised_vector(perpendicular_vector(approach_vector()), current_target().size)), '#e6adbc');
    }
}
/*
------------------------------------------------------------------------------------------------------------------------VECTOR FUNCTIONS
*/
function approach_vector(){
    return {
        x: targets[previous_target_index].x - targets[target_index].x,
        y: targets[previous_target_index].y - targets[target_index].y
    };
}
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
    let local_x = (input_position_relative_to_current_target().x * normalised.x) + (input_position_relative_to_current_target().y * normalised.y);
    let local_y = (input_position_relative_to_current_target().x * perpendicular.x) + (input_position_relative_to_current_target().y * perpendicular.y);
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
------------------------------------------------------------------------------------------------------------------------REFERENCES
*/
function current_target() {
    return targets[target_index];
}
function previous_target() {
    return targets[previous_target_index];
}
function input_position_relative_to_current_target() {
    return convert_to_local_space(get_user_input_position(), { x: current_target().x, y: current_target().y})
}
function set_cursor_position(event){
    let rect = fitts_canvas.getBoundingClientRect();
    mouse_position.x = event.clientX - rect.left;
    mouse_position.y = event.clientY - rect.top;
}
function get_user_input_position(){
    if (two_dimensional_evaluation_task()) {
        return mouse_position;
    } else {
        return scroll_target_position
    }
}
function get_scroll_position(){
    return scroll_target_position;
}
function get_last_click_position(){
    return last_click_data.position;
}
function cache_input_location_data(){
    last_click_data.position = {
        x: get_user_input_position().x,
        y: get_user_input_position().y
    }
    last_click_data.timestamp = performance.now();
}
function two_dimensional_evaluation_task(){
    return evaluation_type === evaluation_types.reciprocal_targets_two_dimensional || evaluation_type === evaluation_types.random_targets_two_dimensional;
}
function one_dimensional_evaluation_task(){
    return evaluation_type === evaluation_types.reciprocal_targets_one_dimensional;
}
/*
------------------------------------------------------------------------------------------------------------------------ALGEBRAIC FUNCTIONS
*/
function convert_to_local_space(point, origin){
    return {
        x: point.x - origin.x,
        y: point.y - origin.y
    };
}
function target_clicked_with_cursor(target){
    return distance_from_mouse(target) <= target.size;
}
function target_clicked_with_scroll(target){
    return distance_from_scroll_target(target) <= target.size;
}
function distance_from_mouse(target){
    return distance(
        get_user_input_position().x,
        get_user_input_position().y,
        target.x,
        target.y);
}
function distance_from_scroll_target(target){
    return distance(
        get_scroll_position().x,
        get_scroll_position().y,
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
function clamp_number_in_range(number, min, max) {
    return Math.min(Math.max(number, min), max);
}
function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
------------------------------------------------------------------------------------------------------------------------GRAPHIC FUNCTIONS
*/
function draw_line(context, start_point, end_point, color, width = 1) {
    context.beginPath();
    context.moveTo(
        start_point.x,
        start_point.y);
    context.lineTo(
        end_point.x,
        end_point.y)
    context.strokeWidth = width;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
}
function draw_circle(context, center, size, color, fill, stroke){
    context.beginPath();
    if (fill){
        context.fillStyle = color;
        context.arc(center.x, center.y, size, 0, 2 * Math.PI);
        context.fill();
    }
    if (stroke){
        context.strokeStyle = color;
        context.arc(center.x, center.y, size, 0, 2 * Math.PI);
        context.stroke();
    }
    context.closePath();
}
function draw_rectangle(context, center_point, height, width, color, fill, stroke){
    context.beginPath();
    let top_left_x = center_point.x - (width / 2);
    let top_left_y = center_point.y - (height / 2);
    if (fill){
        context.fillStyle = color;
        context.fillRect(top_left_x, top_left_y, width, height);
        context.fill();
    }
    if (stroke){
        context.strokeStyle = color;
        context.strokeRect(top_left_x, top_left_y, width, height);
        context.stroke();
    }
    context.closePath();
}
function clear_canvas(context, canvas){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}
/*
------------------------------------------------------------------------------------------------------------------------CANVAS SCALING
*/
function evaluate_scaling(){
    dpr = window.devicePixelRatio || 1;
    if (base_dpr() === null){
        console.log(`Set Base DPR to: ${dpr}`);
        localStorage.setItem('dpr', dpr);
    } else {
        let factor = base_dpr() / dpr;
        if (factor === 1) {
            console.log('Scales Match')
        } else {
            scale_body();
        }
    }
    console.log(`Initial DPR: ${dpr}`);
    
    fitts_rect = scale_canvas(fitts_canvas, fitts_context);
    debug_rect = scale_canvas(debug_canvas, debug_context);
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
    if (dpr === previous) {
        console.log(`Window Resized; no DPR change`);
    } else {
        scale_body();
    }
    if (should_be_fullscreen && evaluation_task_in_progress && !document.fullscreenElement) {
        display_resize_restart_screen();
    }
}
function scale_body(){
    let factor = base_dpr() / dpr;
    console.log(`Scale Factor: ${factor}`)
    body.style.transform = `scale(${factor})`;
}
function get_center(){
    return {
        x: (fitts_canvas.width / dpr) * .5,
        y: (fitts_canvas.height / dpr) * .5
    };
}
function base_dpr(){
    return localStorage.getItem('dpr');
}
/*
------------------------------------------------------------------------------------------------------------------------DATA DOWNLOADING
*/
function calculate_aggregate_performance_data() {
    sessionStorage.setItem('dpr', dpr);
    sessionStorage.setItem('throughput-2D-reciprocal', calculate_average_effective_throughput(evaluation_types.reciprocal_targets_two_dimensional));
    sessionStorage.setItem('throughput-2D-random', calculate_average_effective_throughput(evaluation_types.random_targets_two_dimensional));
    sessionStorage.setItem('throughput-1D-reciprocal', calculate_average_throughput(evaluation_types.reciprocal_targets_one_dimensional));
}
function calculate_aggregate_correlation_data(){
    cache_correlation_data('2D-reciprocal', evaluation_types.reciprocal_targets_two_dimensional, true);
    cache_correlation_data('2D-random', evaluation_types.random_targets_two_dimensional, true);
    cache_correlation_data('1D-reciprocal', evaluation_types.reciprocal_targets_one_dimensional, false);
}
function cache_correlation_data(suffix, target_case, effective_flag) {
    let correlation_data = calculate_data_correlation(target_case, effective_flag);
    sessionStorage.setItem(`pearsons-r-${suffix}`, correlation_data.r_value.toString());
    sessionStorage.setItem(`r-squared-${suffix}`, correlation_data.r_squared.toString());
}
function calculate_data_correlation(target_case, effective_flag) {
    let r_value = pearsons_r(target_case, effective_flag);
    let r_squared = r_value * r_value;
    let z_value = fisher_transformation(r_value);
    let p_value = abramowitz_and_stegun_approximation(z_value);
    return {
        r_value: r_value,
        r_squared: r_squared,
        z_value: z_value,
        p_value: p_value
    };
}
function calculate_average_throughput(target_case){
    let aggregate = 0.0;
    let count = 0;
    all_performance_data.forEach(data => {
        if (data.task_type === target_case){
            aggregate += data.throughput;
            count++;
        }
    });
    return aggregate / count;
}
function calculate_average_effective_throughput(target_case){
    let aggregate = 0.0;
    let count = 0;
    all_performance_data.forEach(data => {
        if (data.task_type === target_case){
            aggregate += data.effective_throughput;
            count++;
        }
    });
    return aggregate / count;
}
async function directly_download_full_analytics(){
    const zip = new JSZip();
    for (let i = 0; i < blended_analytic_data.length; i++){
        const blob = new Blob([JSON.stringify(blended_analytic_data[i], null, 2)], { type: "application/json" });
        zip.file(`${uid}-${i}.json`, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const download_link = document.createElement("a");
    download_link.href = URL.createObjectURL(blob);
    download_link.download = `${uid}.zip`;
    download_link.click();
}
function download_session_storage() {
    console.log(sessionStorage);
    const storageData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        storageData[key] = sessionStorage.getItem(key);
    }
    const json = JSON.stringify(storageData, null, 2);
    const download_link = document.createElement("a");
    download_link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json));
    download_link.setAttribute('download', `${uid}.json`);
    document.body.appendChild(download_link);
    download_link.click();
}

/*
------------------------------------------------------------------------------------------------------------------------ERROR PREVENTION
*/
window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=' || event.key === '-')) {
        event.preventDefault();
    }
});
document.addEventListener('wheel', function(event) {
    event.preventDefault();
}, { passive: false });
/*
------------------------------------------------------------------------------------------------------------------------INTEGRITY INSURANCE
*/
document.addEventListener('keydown', function(event) {
    if (should_be_fullscreen) {
        event.preventDefault();
    }
});
function on_correct_target_clicked(target) { }
function on_correct_target_not_clicked(target) {
    error_count ++;
    evaluate_error_rate();
}
let error_count = 0;
let error_rate = 0;
const total_error_threshold = .4;
function evaluate_error_rate() {
    error_rate = error_count / total_task_count;
    if (error_rate > total_error_threshold) {
        display_error_restart_screen();
    }
}
function display_error_restart_screen(){
    restart_required_error_message.style.display = 'block';
    display_restart_screen();
}
function display_resize_restart_screen(){
    restart_required_resize_message.style.display = 'block';
    display_restart_screen();
}
function display_restart_screen(){
    should_be_fullscreen = false;
    exit_fullscreen();
    non_canvas_element.style.display = 'block';
    canvas_area_element.style.display = 'none';
    evaluation_tasks_element.style.display = 'none';
    restart_required_element.style.display = 'block';
    help_box_element.style.display = 'none';
}
function restart_evaluation() {
    submitted = true
    sessionStorage.setItem('restart-required-flag', 'true');
    location.reload();
}
/*
------------------------------------------------------------------------------------------------------------------------HARDWARE SPECIFICATION PARSING
*/
function cache_screen_dimension_data(){
    let screen_pixel_width = window.screen.width * dpr;
    let screen_pixel_height = window.screen.height * dpr;
    let screen_orientation = window.screen.orientation.type;
    console.log(`Screen Resolution: (${screen_pixel_width}:${screen_pixel_height})`)
    sessionStorage.setItem('screen-pixel-width', screen_pixel_width.toString());
    sessionStorage.setItem('screen-pixel-height', screen_pixel_height.toString());
    sessionStorage.setItem('screen-orientation', screen_orientation.toString());
}
window.requestAnimationFrame(calculate_frames_per_second);
let frames = [];
let max_calculated_fps = 0;
function calculate_frames_per_second(now) {
    frames.unshift(now);
    if (frames.length > 10) {
        let last_frame = frames.pop();
        let fps = Math.floor(1000 * 10 / (now - last_frame));
        if (max_calculated_fps < fps && fps % 2 === 0) {
            max_calculated_fps = fps;
            sessionStorage.setItem('fps', max_calculated_fps);
            console.log(`FPS set to ${fps}`);
        }
    }
    window.requestAnimationFrame(calculate_frames_per_second);
}
let last_polling_time = 0;
let polling_rate_data = [];
let should_calculate_polling_rate = false;
let polling_rate_calculation_latch = false;
function start_calculating_polling_rate() {
    if (polling_rate_calculation_latch) return;
    polling_rate_calculation_latch = true;
    should_calculate_polling_rate = true;
    last_polling_time = performance.now();
}
function stop_calculating_polling_rate() {
    if (!should_calculate_polling_rate) return;
    should_calculate_polling_rate = false;
    let median_polling_duration = calculate_median_polling_rate();
    let modal_polling_duration = calculate_modal_polling_rate();
    let median_polling_frequency = convert_to_hertz(median_polling_duration);
    let modal_polling_frequency = convert_to_hertz(modal_polling_duration);
    console.log(`Median (${median_polling_duration.toFixed(1)}ms) Modal (${modal_polling_duration.toFixed(1)}ms)`);
    let polling_duration = 0;
    let polling_frequency = 0;
    if (median_polling_frequency === modal_polling_frequency){
        polling_frequency = median_polling_frequency;
        polling_duration = median_polling_duration;
    } else {
        polling_frequency = modal_polling_frequency;
        polling_duration = modal_polling_duration;
    }
    sessionStorage.setItem('polling-rate', polling_frequency);
    console.log(`Polling Rate set to ${polling_frequency.toFixed(1)}Hz, (${polling_duration.toFixed(1)}ms)`);
}
function calculate_polling_rate(){
    if (!should_calculate_polling_rate) return;
    let current_polling_time = performance.now();
    let time_since_last_data = current_polling_time - last_polling_time;
    last_polling_time = current_polling_time;
    polling_rate_data.push(time_since_last_data);
}
function calculate_median_polling_rate() {
    polling_rate_data.sort(function(a, b) {
        return a - b;
    });
    let length = polling_rate_data.length;
    let middle_index = Math.floor(length / 2);
    if (length % 2 === 1) {
        return polling_rate_data[middle_index];
    } else {
        return (polling_rate_data[middle_index - 1] + polling_rate_data[middle_index]) / 2;
    }
}
function calculate_modal_polling_rate() {
    let mode_map = {};
    let max_count = 0;
    let modes = [];
    const rounded_polling_rates = polling_rate_data.map((num) => num.toFixed(1));
    rounded_polling_rates.forEach(function (element) {
        if (mode_map[element] == null) {
            mode_map[element] = 1;
        } else {
            mode_map[element]++;
        }
        if (mode_map[element] > max_count) {
            max_count = mode_map[element];
        }
    });
    for (let element in mode_map) {
        if (mode_map[element] === max_count) {
            modes.push(Number(element));
        }
    }
    return modes.pop();
}
function convert_to_hertz(milliseconds){
    return 1000 / milliseconds;
}
/*
------------------------------------------------------------------------------------------------------------------------VELOCITY CALCULATIONS
*/
let last_cursor_position = {x: 0, y: 0};
let last_velocity_stamp = 0;
let sampled_velocities = [];
let should_calculate_velocity = false;
function start_calculating_velocity(){
    should_calculate_velocity = true;
    last_cursor_position = get_user_input_position();
    last_velocity_stamp = performance.now();
    sampled_velocities = [];
}
function stop_calculating_velocity() {
    if (!should_calculate_velocity) return;
    should_calculate_velocity = false;
    let velocity_data = calculate_velocity_data();
    let section = session_storage_section_name();
    console.log(`[${section}] Mean (${velocity_data.mean.toFixed(1)}px/ms) Median (${velocity_data.median.toFixed(1)}px/ms) Maximum(${velocity_data.maximum.toFixed(1)}px/ms)`);
    sessionStorage.setItem(`mean-velocity-${section}`, velocity_data.mean);
    sessionStorage.setItem(`maximum-velocity-${section}`, velocity_data.maximum);
    sessionStorage.setItem(`median-velocity-${section}`, velocity_data.median);
    sampled_velocities = [];
}

function calculate_velocity() {
    if (!should_calculate_velocity) return;
    let current_velocity_stamp = performance.now();
    let current_mouse_position = get_user_input_position();
    let distance_travelled = distance_between_points(last_cursor_position, current_mouse_position);
    let velocity = distance_travelled / (current_velocity_stamp - last_velocity_stamp);
    sampled_velocities.push(velocity);
    last_cursor_position = {
        x: current_mouse_position.x, 
        y: current_mouse_position.y};
    last_velocity_stamp = current_velocity_stamp;
}
function session_storage_section_name(){
    switch (evaluation_type){
        case evaluation_types.reciprocal_targets_two_dimensional:
            return "2D-reciprocal";
        case evaluation_types.random_targets_two_dimensional:
            return "2D-random";
        case evaluation_types.reciprocal_targets_one_dimensional:
            return "1D-reciprocal";
        default:
            return null;
    }
}
function calculate_velocity_data() {
    sampled_velocities.sort(function(a, b) {
        return a - b;
    });
    let length = sampled_velocities.length;
    let middle_index = Math.floor(length / 2);
    let maximum_velocity = sampled_velocities[length - 1];
    let sum = sampled_velocities.reduce((a, b) => a + b, 0);
    let mean_velocity = sum / length;
    if (length % 2 === 1) {
        return {
            median : sampled_velocities[middle_index],
            mean: mean_velocity,
            maximum : maximum_velocity
        };
    } else {
        return {
            median: (sampled_velocities[middle_index - 1] + sampled_velocities[middle_index]) / 2,
            mean: mean_velocity,
            maximum: maximum_velocity
        };
    }
}
/*
------------------------------------------------------------------------------------------------------------------------DATABASE DECLARATION
*/
