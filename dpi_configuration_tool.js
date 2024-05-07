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
let adjusted_cursor_position = {
    x: 0,
    y: 0
};
let first_position = true;

let base_dpi = 1600;
let scalar = 1;

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
    let cached_cursor_position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
    let real_displacement = {
        d_x: cached_cursor_position.x - cursor_position.x,
        d_y: cached_cursor_position.y - cursor_position.y
    }
    let adjusted_displacement = {
        d_x: real_displacement.d_x / scalar,
        d_y: real_displacement.d_y / scalar
    }
    let cached_adjusted_cursor_position = {
        x: adjusted_cursor_position.x + adjusted_displacement.d_x,
        y: adjusted_cursor_position.y + adjusted_displacement.d_y
    }

    cursor_position = cached_cursor_position;
    
    if (first_position){
        first_position = false;
        normalised_cursor_position = {
            x: rect.left + rect.width / 2,
            y: rect.left + rect.width / 2
        }
        adjusted_cursor_position = {
            x: normalised_cursor_position.x,
            y: normalised_cursor_position.y
        }
        return;
    }
    normalised_cursor_position = {
        x: normalised_cursor_position.x + real_displacement.d_x,
        y: normalised_cursor_position.y + real_displacement.d_y
    }
    adjusted_cursor_position = {
        x: cached_adjusted_cursor_position.x + adjusted_displacement.d_x,
        y: cached_adjusted_cursor_position.y + adjusted_displacement.d_y
    }
    
    draw_dot(cursor_position.x, cursor_position.y, 'grey');
    draw_dot(adjusted_cursor_position.x, adjusted_cursor_position.y, 'black');
    draw_dot(normalised_cursor_position.x, normalised_cursor_position.y, 'red');
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
    scalar = base_dpi / 1200;
    console.log(scalar);
}