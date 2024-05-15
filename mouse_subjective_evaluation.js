/*
Data Loss Prevention
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
Declarations & References
*/
let index = 0;
let introduction_area = document.getElementById('introduction');
let metric_evaluation_area = document.getElementById('metric-evaluation-area');
let evaluation_section_area = document.getElementById('evaluation-area');
let evaluation_finished_area = document.getElementById('evaluation-finished-area');
let direct_download_message = document.getElementById('me-subjective-eval-direct-download-message');
let successful_upload_message = document.getElementById('me-subjective-eval-uploaded-data-message');
let previous_button = document.getElementById('me-subjective-eval-previous-section');
let next_button = document.getElementById('me-subjective-eval-next-section');
let submit_button = document.getElementById('me-subjective-eval-submit');
let progress_bar = document.getElementById('progress-bar');
/*
State Management
*/
function start_subjective_evaluation() {
    introduction_area.style.display = "none";
    metric_evaluation_area.style.display = "block";
    calculate_progress_bar_width();
}
function next_section(){
    index++;
    clamp_index();
    manage_section();
    scroll_to_top();
}
function previous_section(){
    index--;
    clamp_index();
    manage_section();
    scroll_to_top();
}
function clamp_index(){
    index = clamp(index, 0, standard_evaluation_sections.length - 1);
}
function manage_section() {
    next_button.disabled = index === standard_evaluation_sections.length - 1;
    previous_button.disabled = index === 0;
    submit_button.style.display = index !== standard_evaluation_sections.length - 1 ? "none" : "block";
    for (let i = 0; i < standard_evaluation_sections.length; i++) {
        document.getElementById(standard_evaluation_sections[i].id).style.display = i === index ? "block" : "none";
        let indicator = document.getElementById(`${standard_evaluation_sections[i].id.toString()}-indicator`);
        if (i === index) {
            indicator.classList.add('current');
            indicator.classList.remove('completed', 'uncompleted');
        } else if (i < index) {
            indicator.classList.add('completed');
            indicator.classList.remove('current', 'uncompleted');
        } else {
            indicator.classList.add('uncompleted');
            indicator.classList.remove('completed', 'current');
        }
    }
}
/*
Evaluation Metrics
*/
let standard_evaluation_sections = [
    {   id: 'tlx-m',
        metrics: [
            {id: "tlx-m-mental-demand"},
            {id: "tlx-m-physical-demand"},
            {id: "tlx-m-temporal-demand"},
            {id: "tlx-m-performance"},
            {id: "tlx-m-effort"},
            {id: "tlx-m-frustration"}
        ],
        range: {min: -10, max: 10, value: 0}},
    {   id: 'umux-m',
        metrics: [
            {id: "umux-m-effectiveness"},
            {id: "umux-m-satisfaction"},
            {id: "umux-m-usability"},
            {id: "umux-m-efficiency"},
            {id: "umux-m-fluidity"},
        ],
        range: {min: -2, max: 2, value: 0}},
    {   id: 'umux-m*',
        metrics: [
            {id: "umux-m*-satisfaction"},
            {id: "umux-m*-usability"},
            {id: "umux-m*-efficiency"},
            {id: "umux-m*-fluidity"},
        ],
        range: {min: -2, max: 2, value: 0}},
    {   id: 'attrakdiff-m',
        metrics: [
            {id: "attrakdiff-m-p-simple"},
            {id: "attrakdiff-m-a-attractive"},
            {id: "attrakdiff-m-p-practical"},
            {id: "attrakdiff-m-h-stylish"},
            {id: "attrakdiff-m-p-predictable"},
            {id: "attrakdiff-m-h-premium"},
            {id: "attrakdiff-m-h-imaginative"},
            {id: "attrakdiff-m-a-good"},
            {id: "attrakdiff-m-p-structured"},
            {id: "attrakdiff-m-h-captivating"}
        ],
        range: {min: -3, max: 3, value: 0}},
    {   id: 'ergo-m*',
        metrics: [
            {id: "ergo-m*-size"},
            {id: "ergo-m*-weight"},
            {id: "ergo-m*-confidence"},
            {id: "ergo-m*-balance"},
        ],
        range: {min: -3, max: 3, value: 0}},
    {   id: 'ergo-m',
        metrics: [
            {id: "ergo-m-size-high"},
            {id: "ergo-m-size-wide"},
            {id: "ergo-m-size-tilted"},
            {id: "ergo-m-weight-heavy"},
            {id: "ergo-m-material-hard"},
            {id: "ergo-m-material-warm"},
            {id: "ergo-m-material-rigid"},
            {id: "ergo-m-quality-comfortable"},
            {id: "ergo-m-quality-pleasant"},
            {id: "ergo-m-quality-premium"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'glide-m',
        metrics: [
            {id: "glide-m-interface-textured"},
            {id: "glide-m-interface-slippy"},
            {id: "glide-m-interface-loud"},
            {id: "glide-m-interface-consistent"},
            {id: "glide-m-usability-fast"},
            {id: "glide-m-usability-heavy"},
            {id: "glide-m-usability-controlled"},
            {id: "glide-m-usability-laborious"},
            {id: "glide-m-quality-pleasant"},
            {id: "glide-m-quality-premium"},
            {id: "glide-m-quality-satisfying"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'timbre-m',
        metrics: [
            {id: "timbre-m-hard"},
            {id: "timbre-m-loud"},
            {id: "timbre-m-powerful"},
            {id: "timbre-m-harsh"},
            {id: "timbre-m-high"},
            {id: "timbre-m-deep"},
            {id: "timbre-m-pleasant"},
            {id: "timbre-m-harmonious"},
            {id: "timbre-m-beautiful"},
            {id: "timbre-m-rough"},
            {id: "timbre-m-dull"},
            {id: "timbre-m-thick"},
            {id: "timbre-m-grating"},
            {id: "timbre-m-premium"},
            {id: "timbre-m-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'timbre-m*',
        metrics: [
            {id: "timbre-m*-loud"},
            {id: "timbre-m*-dull"},
            {id: "timbre-m*-deep"},
            {id: "timbre-m*-pleasant"},
            {id: "timbre-m*-premium"},
            {id: "timbre-m*-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'tactility-m',
        metrics: [
            {id: "tactility-m-comfortable"},
            {id: "tactility-m-heavy"},
            {id: "tactility-m-strong"},
            {id: "tactility-m-distinct"},
            {id: "tactility-m-sharp"},
            {id: "tactility-m-stable"},
            {id: "tactility-m-pleasant"},
            {id: "tactility-m-premium"},
            {id: "tactility-m-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'tactility-m*',
        metrics: [
            {id: "tactility-m*-comfortable"},
            {id: "tactility-m*-heavy"},
            {id: "tactility-m*-strong"},
            {id: "tactility-m*-distinct"},
            {id: "tactility-m*-sharp"},
            {id: "tactility-m*-stable"},
            {id: "tactility-m*-pleasant"},
            {id: "tactility-m*-premium"},
            {id: "tactility-m*-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'fss-m',
        metrics: [
            {id: "fss-m-a-challenge"},
            {id: "fss-m-f-fluidity"},
            {id: "fss-m-a-temporality"},
            {id: "fss-m-f-concentration"},
            {id: "fss-m-f-clarity"},
            {id: "fss-m-a-absorption"},
            {id: "fss-m-f-autonomy"},
            {id: "fss-m-f-confidence"},
            {id: "fss-m-f-control"},
            {id: "fss-m-a-thought"}
        ],
        range: {min: -2, max: 2, value: 0}}
]
let gliding_specific_sections = [
    {   id: 'umux-g',
        metrics: [
            {id: "umux-g-effectiveness"},
            {id: "umux-g-satisfaction"},
            {id: "umux-g-usability"},
            {id: "umux-g-efficiency"},
        ],
        range: {min: -2, max: 2, value: 0}},
    {   id: 'usability-g*',
        metrics: [
            {id: "usability-g*-control-general"},
            {id: "usability-g*-control-starting"},
            {id: "usability-g*-control-stopping"},
            {id: "usability-g*-precision-local"},
            {id: "usability-g*-precision-global"},
            {id: "usability-g*-directionality-symmetry"},
            {id: "usability-g*-directionality-horizontal"},
            {id: "usability-g*-directionality-vertical"},
        ],
        range: {min: -3, max: 3, value: 0}},
    {   id: 'usability-g',
        metrics: [
            {id: "usability-g-fast"},
            {id: "usability-g-laborious"},
            {id: "usability-g-heavy"},
            {id: "usability-g-unstable"},
            {id: "usability-g-unresponsive"},
            {id: "usability-g-inconsistent"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'timbre-g',
        metrics: [
            {id: "timbre-g-loud"},
            {id: "timbre-g-pleasant"},
            {id: "timbre-g-premium"},
            {id: "timbre-g-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'tactility-g',
        metrics: [
            {id: "tactility-g-rough"},
            {id: "tactility-g-sticky"},
            {id: "tactility-g-firm"},
            {id: "tactility-g-hard"},
            {id: "tactility-g-pleasant"},
            {id: "tactility-g-premium"},
            {id: "tactility-g-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'attrakdiff-g',
        metrics: [
            {id: "attrakdiff-g-p-simple"},
            {id: "attrakdiff-g-a-attractive"},
            {id: "attrakdiff-g-p-practical"},
            {id: "attrakdiff-g-h-stylish"},
            {id: "attrakdiff-g-p-predictable"},
            {id: "attrakdiff-g-h-premium"},
            {id: "attrakdiff-g-h-imaginative"},
            {id: "attrakdiff-g-a-good"},
            {id: "attrakdiff-g-p-structured"},
            {id: "attrakdiff-g-h-captivating"}
        ],
        range: {min: -3, max: 3, value: 0}}
]
/*
URL Parsing
 */
// URL queries to disable sections
let url = new URL(window.location.href);
let reset_when_finished = url.searchParams.get("reset_when_finished") !== null;
let disable_timbre = url.searchParams.get("disable_timbre") !== null;
let disable_tactility = url.searchParams.get("disable_tactility") !== null;
let disable_glide = url.searchParams.get("disable_glide") !== null;
let gliding_only = url.searchParams.get("gliding_only") !== null;
let premium_keycaps = url.searchParams.get("premium_keycaps") !== null;
let mouse_gliding_only = url.searchParams.get("mouse_gliding_only") !== null;
let center_of_gravity = url.searchParams.get("center_of_gravity") !== null;
let filtered_sections = [];

if (gliding_only) {
    standard_evaluation_sections = gliding_specific_sections;
} else {
    if (premium_keycaps) {
        standard_evaluation_sections.forEach(section => {
            switch (section.id) {
                case 'attrakdiff-m':
                    filtered_sections.push(section);
                    break;
                case 'ergo-m':
                    filtered_sections.push(section);
                    break;
                case 'timbre-m':
                    filtered_sections.push(section);
                    break;
                case 'tactility-m':
                    filtered_sections.push(section);
                    break;
                default:
                    break;
            }
        });
    } else if (mouse_gliding_only) {
        standard_evaluation_sections.forEach(section => {
            switch (section.id) {
                case 'umux-m':
                    filtered_sections.push(section);
                    break;
                default:
                    break;
            }
        });
        gliding_specific_sections.forEach(section => {
            switch (section.id) {
                case 'usability-g*':
                    filtered_sections.push(section);
                    break;
                case 'usability-g':
                    filtered_sections.push(section);
                    break;
                case 'timbre-g':
                    filtered_sections.push(section);
                    break;
                default:
                    break;
            }
        });
    } else if (center_of_gravity) {
    standard_evaluation_sections.forEach(section => {
        switch (section.id) {
            case 'tlx-m':
                filtered_sections.push(section);
                break;
            case 'umux-m':
                filtered_sections.push(section);
                break;
            case 'ergo-m*':
                filtered_sections.push(section);
                break;
            default:
                break;
        }
    });
    gliding_specific_sections.forEach(section => {
        switch (section.id) {
            case 'usability-g*':
                filtered_sections.push(section);
                break;
            case 'usability-g':
                filtered_sections.push(section);
                break;
            default:
                break;
        }
    });
} else {
        standard_evaluation_sections.forEach(section =>{
            switch (section.id) {
                case 'glide-m':
                    if (!disable_glide){
                        filtered_sections.push(section);
                    } break;
                case 'timbre-m':
                    if (!disable_timbre){
                        filtered_sections.push(section);
                    } break;
                case 'timbre-m*':
                    if (!disable_timbre){
                        filtered_sections.push(section);
                    } break;
                case 'tactility-m':
                    if (!disable_tactility){
                        filtered_sections.push(section);
                    } break;
                case 'tactility-m*':
                    if (!disable_tactility){
                        filtered_sections.push(section);
                    } break;
                default:
                    filtered_sections.push(section);
                    break;
            }
        });
    }
    standard_evaluation_sections = filtered_sections;
}
/*
Procedural Generation
*/
function construct_element_with_id(tag, id, class_name){
    let element = document.createElement(tag);
    element.id = id;
    element.className = class_name;
    return element;
}
function build_slider(slider, section){
    slider.type = "range";
    slider.className = "slider";
    slider.min = section.range.min;
    slider.max = section.range.max;
    slider.value = section.range.value;
}
function construct_page(){
    let progression_indicators = document.getElementById('progression-indicators');
    let index = 1;
    standard_evaluation_sections.forEach(section => {
        let base_id = section.id.toString();
        let marker = construct_element_with_id("p", `${base_id}-indicator`, 'section-indicator');
        marker.innerHTML = `${index}`;
        progression_indicators.appendChild(marker);
        index++;
    })
    let i = 1;
    standard_evaluation_sections.forEach(section =>{
        let container = document.createElement("div");
        let sticky_header = document.createElement("div");

        sticky_header.classList.add('sticky-header');
        
        let base_id = section.id.toString();
        container.id = base_id;
        
        let header = construct_element_with_id("h2", `${base_id}-header`);
        let introduction = construct_element_with_id("p", `${base_id}-introduction`);
        let instructions = construct_element_with_id("i", `${base_id}-instruction`);
        instructions.style.fontSize = 'small';

        header.innerHTML = header.id;
        introduction.innerHTML = introduction.id;
        instructions.innerHTML = instructions.id;

        let divider = document.createElement("div");
        divider.innerHTML = "<br><hr><br>";

        container.appendChild(sticky_header);
        container.appendChild(divider);
        
        sticky_header.appendChild(header);
        sticky_header.appendChild(introduction);
        sticky_header.appendChild(instructions);

        section.metrics.forEach(metric => {
            let base_id = metric.id.toString();
            
            let element = construct_element_with_id("div", `${base_id}-container`);
            let description = construct_element_with_id("div", `${base_id}-description`);
            let low_label = construct_element_with_id("div", `${base_id}-low`, "left-label");
            let high_label = construct_element_with_id("div", `${base_id}-high`, "right-label");
            let label_container = construct_element_with_id("div", `${base_id}-label-container`, "label-container");
            let metric_slider = construct_element_with_id("input", `${base_id}`);
            
            build_slider(metric_slider, section);

            description.innerHTML = description.id;
            low_label.innerHTML = low_label.id;
            high_label.innerHTML = high_label.id;

            label_container.appendChild(low_label);
            label_container.appendChild(high_label);

            element.appendChild(description);
            element.appendChild(metric_slider);
            element.appendChild(label_container);
            container.appendChild(element);
        })
        evaluation_section_area.appendChild(container);
        i++;
    })
}
/*
Initial Page State Definition
*/
construct_page();
manage_section();
/*
Submission & Data Processing
*/
let query_string = "";
extract_query_parameters(url.toString());
function extract_query_parameters(url_string) {
    let question_mark_index = url_string.indexOf("?");
    if (question_mark_index !== -1) {
        query_string = '?';
        query_string += url_string.substring(question_mark_index + 1);
    }
}
function submit_data(){
    scroll_to_top();
    metric_evaluation_area.style.display = "none";
    evaluation_finished_area.style.display = "block";
    cache_submission_time();
    cache_evaluation_metric_data();
    download_data();
}
function cache_submission_time(){
    sessionStorage.setItem('evaluation-year', new Date().getUTCFullYear().toString());
    sessionStorage.setItem('evaluation-month', new Date().getUTCMonth().toString());
    sessionStorage.setItem('evaluation-day', new Date().getUTCDay().toString());
    sessionStorage.setItem('evaluation-hour', new Date().getUTCHours().toString());
    sessionStorage.setItem('evaluation-minute', new Date().getUTCMinutes().toString());
    sessionStorage.setItem('evaluation-second', new Date().getUTCSeconds().toString());
}
function cache_evaluation_metric_data(){
    standard_evaluation_sections.forEach(section => {
        section.metrics.forEach( metric => {
            sessionStorage.setItem(metric.id, document.getElementById(metric.id).value);
        })
    })
}
function download_data() {
    const data = sessionStorage;
    let stamp = Date.now().toString();
    database.ref(stamp).set(data)
        .then(function() {
            successful_upload_message.style.display = 'block';
            if (reset_when_finished) {
                sessionStorage.clear();
                window.location.href = `mouse_evaluation.html${query_string}`;
            }
        })
        .catch(function(error) {
            direct_download_message.style.display = 'block';
            direct_download_data(data);
        });
    submitted = true;
}

function direct_download_data(data){
    direct_download_message.style.display = 'block';
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
Utility Functions
*/
function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}
function scroll_to_top() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
window.addEventListener('scroll', calculate_progress_bar_width);
function calculate_progress_bar_width(){
    const scroll_top = document.documentElement.scrollTop;
    const scroll_height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scroll_top / scroll_height) * 100;
    progress_bar.style.width = progress + '%';
}
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
/*
Database Initialisation
*/
firebase.initializeApp(mouse_evaluation_firebase_data);
let database = firebase.database();