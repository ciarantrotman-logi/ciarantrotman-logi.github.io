let demo_active = false;
let demo_targets = [];
let demo_target_index = 0;
let demo_target_section = { tasks: 3, amplitude: 100, width: 40 };

document.addEventListener('mousedown', demo_click);
document.addEventListener('wheel', demo_scroll);

function demo_click(){
    if (!demo_active) return;

}
function demo_scroll(event){
    if (!demo_active) return;
    update_scroll_position(event.deltaY);
    render_demo_task_targets();
}

function show_scrolling_task_demo(){
    initialise_scroll_position();
    demo_active = true;
    demo_canvas_area_element.style.display = 'block';
    generate_demo_task_targets();
    render_demo_task_targets();
}
function generate_demo_task_targets() {
    initialise_scroll_position();
    for (let i = 0; i < demo_target_section.tasks; i++) {
        let y_position = get_center().y;
        if (i % 2 === 0){
            y_position += demo_target_section.amplitude / 2;
        } else {
            y_position -= demo_target_section.amplitude / 2;
        }
        let target = {
            x: get_center().x,
            y: y_position,
            size: demo_target_section.width,
            index: i,
            color: visible_inactive_target_color};
        demo_targets.push(target);}
}
function render_demo_task_targets() {
    let width = 650;
    clear_canvas(demo_context, demo_canvas);
    for (let i = 0; i < demo_targets.length; i++) {
        let target = demo_targets[i];
        draw_rectangle(demo_context, target, target.size * 2,  width, target.color, true, false);
    }
    draw_rectangle(demo_context, current_demo_target(), current_demo_target().size * 2,  width, active_target_color, true, false);
    draw_rectangle(demo_context, get_scroll_position() + 1, 1, width, 'black', true, true);
    draw_rectangle(demo_context, get_scroll_position() - 1, 1, width, 'black', true, true);
}
function current_demo_target() {
    return demo_targets[demo_target_index];
}