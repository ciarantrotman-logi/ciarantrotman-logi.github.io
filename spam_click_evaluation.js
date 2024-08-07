const spam_click_canvas = document.getElementById('spam-click-canvas')
const spam_click_context = spam_click_canvas.getContext('2d');
const spam_click_rect = spam_click_canvas.getBoundingClientRect();

let progress_bar = document.getElementById('progress-bar');

let pre_evaluation_screen = document.getElementById('pre-evaluation-screen');
let evaluation_screen = document.getElementById('evaluation-screen');
let post_evaluation_screen = document.getElementById('post-evaluation-screen');

let start_evaluation_button = document.getElementById('start-evaluation');

let user_name = "";
let evaluation_mouse_make = "";
let evaluation_mouse_model = "";

let cursor_position = {
    x: 0,
    y: 0
};

let click_size = 0;

window.addEventListener('resize', scale_canvas);
spam_click_canvas.addEventListener('mousemove', mouse_movement);
spam_click_canvas.addEventListener('click', mouse_click);

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

let uid = Date.now().toString();
let click_events = [];

let evaluation_start_timestamp;

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

function start_evaluation(){
    pre_evaluation_screen.style.display = 'none';
    evaluation_screen.style.display = 'block';
    
    user_name = sanitised_string(document.getElementById('user-name').value);
    evaluation_mouse_make = sanitised_string(document.getElementById('evaluation-mouse-make').value);
    evaluation_mouse_model = sanitised_string(document.getElementById('evaluation-mouse-model').value);
    
    document.body.style.cursor = 'none';
}

function mouse_click(event){
    if (click_events.length === 0){
        evaluation_timer();
        evaluation_start_timestamp = Date.now();
    }
    click_size += 15;
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
    spam_click_context.fillStyle = '#FFFFFF1A';
    spam_click_context.fillRect(0, 0, spam_click_canvas.width * 2, spam_click_canvas.height * 2);
    spam_click_context.closePath();
}
function clear_canvas() {
    spam_click_context.clearRect(0, 0, spam_click_canvas.width, spam_click_canvas.height);
}

scale_canvas();

let split_count = 10;
let split_duration = 3000;
let evaluation_duration = split_duration * (split_count + 1);

let current_split_index = 0;
let previous_split_click_index = 1;

let split_data = [];

function evaluation_timer() {
    setTimeout(calculate_split_performance, split_duration);
}

function calculate_split_performance(){
    if (current_split_index >= split_count) {
        finish_evaluation();
        return;
    }
    
    let aggregate_click_duration = 0;
    let click_durations = [];
    for (let i = previous_split_click_index + 1; i < click_events.length; i++) {
        let click_duration = click_events[i].timeStamp - click_events[i-1].timeStamp;
        aggregate_click_duration += click_duration;
        click_durations.push(click_duration);
    }
    
    let mean_click_duration = aggregate_click_duration / click_durations.length;
    let click_duration_variance = click_durations.reduce((accumulator, duration) => accumulator + Math.pow(duration - mean_click_duration, 2), 0) / click_durations.length;
    console.log(`Split ${current_split_index + 1}\n
    Mean Click Duration: ${mean_click_duration}\n
    Click Duration Variance: ${click_duration_variance}
    `);
    
    split_data.push({
        'uid' : uid,
        'user-name' : user_name,
        'evaluation-mouse-make' : evaluation_mouse_make,
        'evaluation-mouse-model' : evaluation_mouse_model,
        'split-index' : current_split_index,
        'split-duration-ms' : split_duration,
        'mean-click-duration' : mean_click_duration,
        'click-duration-variance' : click_duration_variance,
        'split-click-count' : click_durations.length
    })
    
    previous_split_click_index = click_events.length - 1;
    current_split_index++;
    
    evaluation_timer();
}

function finish_evaluation(){
    document.body.style.cursor = 'auto';
    evaluation_screen.style.display = 'none';
    post_evaluation_screen.style.display = 'block';
    download_output_data().then(r => function(){
        console.log('Data downloaded successfully!');
    });
}

async function download_output_data (){
    const json = {};
    const zip = new JSZip();

    Object.keys(split_data).forEach(key => {
        json[key] = split_data[key];
    });

    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            const data = json[key];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
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
setInterval(function(){
    check_user_name();
})
setInterval(function(){
    let elapsed_duration = Date.now() - evaluation_start_timestamp;
    const progress = (elapsed_duration / evaluation_duration) * 100;
    progress_bar.style.width = progress + '%';
})
setInterval(function(){
    fade_canvas();
    click_size -= .3;
    click_size = click_size < 1 ? 1 : click_size;
    draw_dot(cursor_position.x, cursor_position.y, 'black', click_size);
})

function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}
function check_user_name() {
    start_evaluation_button.disabled =
        document.getElementById('user-name').value.trim() === '' ||
        document.getElementById('evaluation-mouse-make').value.trim() === '' ||
        document.getElementById('evaluation-mouse-model').value.trim() === '';
}