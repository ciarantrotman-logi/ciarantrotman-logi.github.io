const dpi_canvas = document.getElementById('dpi-canvas');
const dpi_context = dpi_canvas.getContext('2d');

let cursor_position = {
    x: 0,
    y: 0
};
let normalised_cursor_position = {
    x: 0,
    y: 0
};
let scalar_cursor_position = {
    x: 0,
    y: 0
};
let first_recorded_frame = true;

// let base_dpi = 100;
let scalar = 0;

function scale_canvas(){
    dpi_canvas.width = window.innerWidth;
    dpi_canvas.height = window.innerHeight;
    console.log(`canvas size: ${dpi_canvas.width}, ${dpi_canvas.height}`)
}
function mouse_movement(event){
    clear_canvas();
    set_cursor_position(event);
}
function set_cursor_position(event){
    let rect = dpi_canvas.getBoundingClientRect();
    
    // if it's the first frame then we need to center the apparent cursor
    if (first_recorded_frame){
        first_recorded_frame = false;
        cursor_position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        normalised_cursor_position = canvas_midpoint();
        scalar_cursor_position = canvas_midpoint();
        return;
    }
    
    // cursor_position and scalar_cursor_position still reference the positions from the last frame
    let cached_cursor_position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
    let cached_scalar_cursor_position = {
        x: scalar_cursor_position.x,
        y: scalar_cursor_position.y
    }
    // calculate the displacement since the last frame and apply it to our normalised cursor
    let real_displacement = {
        d_x: cached_cursor_position.x - cursor_position.x,
        d_y: cached_cursor_position.y - cursor_position.y
    }
    normalised_cursor_position = {
        x: normalised_cursor_position.x + real_displacement.d_x,
        y: normalised_cursor_position.y + real_displacement.d_y
    }
    // then update our cursor_position
    cursor_position = cached_cursor_position;
    
    // then we can calculate and apply the scalar attributes for the cursor
    let scalar_displacement = {
        d_x: real_displacement.d_x * scalar,
        d_y: real_displacement.d_y * scalar
    }
    scalar_cursor_position = {
        x: cached_scalar_cursor_position.x + scalar_displacement.d_x,
        y: cached_scalar_cursor_position.y + scalar_displacement.d_y
    }
    
    
    //draw_dot(cursor_position.x, cursor_position.y, 'grey');
    //draw_dot(normalised_cursor_position.x, normalised_cursor_position.y, 'red');
    draw_dot(scalar_cursor_position.x, scalar_cursor_position.y, 'blue');
    //draw_dot(canvas_midpoint().x, canvas_midpoint().y, 'black');
}

window.addEventListener('resize', scale_canvas);
dpi_canvas.addEventListener('mousemove', mouse_movement);

scale_canvas();
set_scalar_value();

function draw_dot(x, y, color = 'black', size = 3) {
    dpi_context.beginPath();
    dpi_context.fillStyle = color;
    dpi_context.fillRect(x - size / 2, y - size / 2, size, size);
    dpi_context.closePath();
}
function clear_canvas() {
    dpi_context.clearRect(0, 0, dpi_canvas.width, dpi_canvas.height);
}
function set_scalar_value() {
    scalar = .25;//1600 / base_dpi;
}

function canvas_midpoint(){
    let rect = dpi_canvas.getBoundingClientRect();
    return {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
    }
}
