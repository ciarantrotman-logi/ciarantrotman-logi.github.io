const spam_click_canvas = document.getElementById('spam-click-canvas')
const spam_click_context = spam_click_canvas.getContext('2d');
const spam_click_rect = spam_click_canvas.getBoundingClientRect();

let cursor_position = {
    x: 0,
    y: 0
};

window.addEventListener('resize', scale_canvas);
spam_click_canvas.addEventListener('mousemove', mouse_movement);
spam_click_canvas.addEventListener('click', mouse_click);

let click_events = [];

function scale_canvas(){
    spam_click_canvas.width = window.innerWidth;
    spam_click_canvas.height = window.innerHeight;
    console.log(`canvas size: ${spam_click_canvas.width}, ${spam_click_canvas.height}`)
}
function mouse_movement(event){
    set_cursor_position(event);
}
function set_cursor_position(event){
    cursor_position = {
        x: event.clientX - spam_click_rect.left,
        y: event.clientY - spam_click_rect.top
    }
}

function mouse_click(event){
    if (click_events.length === 0){
        evaluation_timer();
    }
    fade_canvas();
    draw_dot(cursor_position.x, cursor_position.y, 'black', 10);
    
    click_events.push(event);
}

function draw_dot(x, y, color = 'black', size = 3) {
    spam_click_context.beginPath();
    spam_click_context.fillStyle = color;
    spam_click_context.arc(x, y, size / 2, 0, 2 * Math.PI);
    spam_click_context.fill();
    spam_click_context.closePath();
}
function fade_canvas() {
    spam_click_context.beginPath();
    spam_click_context.fillStyle = '#FFFFFF30';
    spam_click_context.fillRect(0, 0, spam_click_canvas.width * 2, spam_click_canvas.height * 2);
    spam_click_context.closePath();
}
function clear_canvas() {
    spam_click_context.clearRect(0, 0, spam_click_canvas.width, spam_click_canvas.height);
}

scale_canvas();

function evaluation_timer() {
    setTimeout(function() {
        let aggregate_click_duration = 0;
        for (let i = 1; i < click_events.length; i++) {
            let click_duration = click_events[i].timeStamp - click_events[i-1].timeStamp;
            aggregate_click_duration += click_duration;
        }
        console.log(aggregate_click_duration / click_events.length)
    }, 5000);
}
