/*
Data Loss Prevention
*/
let submitted = true; // todo revert
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
/*
State Management
*/
function start_subjective_evaluation() {
    introduction_area.style.display = "none";
    metric_evaluation_area.style.display = "block";
}
function next_section(){
    index++;
    clamp_index();
    manage_section();
}
function previous_section(){
    index--;
    clamp_index();
    manage_section();
}
function clamp_index(){
    index = clamp(index, 0, sections.length - 1);
}
function manage_section(){
    next_button.disabled = index === sections.length - 1;
    previous_button.disabled = index === 0;
    submit_button.style.display = index !== sections.length - 1 ? "none" : "block";
    for (let i = 0; i < sections.length; i++) {
        document.getElementById(sections[i].id).style.display = i === index ? "block" : "none";
        let indicator = document.getElementById(`${sections[i].id.toString()}-indicator`);
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
let sections = [
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
            {id: "umux-m-p-functionality"},
            {id: "umux-m-n-frustration"},
            {id: "umux-m-p-easiness"},
            {id: "umux-m-n-difficulty"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   id: 'fss-m',
        metrics: [
            {id: "fss-m-aba-challenge"},
            {id: "fss-m-fp-fluidity"},
            {id: "fss-m-aba-temporality"},
            {id: "fss-m-fp-concentration"},
            {id: "fss-m-fp-clarity"},
            {id: "fss-m-aba-absorption"},
            {id: "fss-m-fp-autonomy"},
            {id: "fss-m-fp-confidence"},
            {id: "fss-m-fp-control"},
            {id: "fss-m-aba-thought"}
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
            {id: "attrakdiff-m-h-creative"},
            {id: "attrakdiff-m-a-good"},
            {id: "attrakdiff-m-p-structure"},
            {id: "attrakdiff-m-h-captivating"}
        ],
        range: {min: -3, max: 3, value: 0}
    }
]
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
    sections.forEach(section => {
        let base_id = section.id.toString();
        let marker = construct_element_with_id("p", `${base_id}-indicator`, 'section-indicator');
        marker.innerHTML = marker.id;
        progression_indicators.appendChild(marker);
    })
    let i = 1;
    sections.forEach(section =>{
        let container = document.createElement("div");
        let base_id = section.id.toString();
        container.id = base_id;

        let header = construct_element_with_id("h2", `${base_id}-header`);
        let introduction = construct_element_with_id("p", `${base_id}-introduction`);
        let instructions = construct_element_with_id("i", `${base_id}-instruction`);

        header.innerHTML = header.id;
        introduction.innerHTML = introduction.id;
        instructions.innerHTML = instructions.id;

        let divider = document.createElement("div");
        divider.innerHTML = "<br><hr><br>";

        container.appendChild(header);
        container.appendChild(introduction);
        container.appendChild(instructions);
        container.appendChild(divider);

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
function submit_data(){
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
    sections.forEach(section => {
        section.metrics.forEach( metric => {
            sessionStorage.setItem(metric.id, document.getElementById(metric.id).value);
        })
    })
}
function download_data() {
    direct_download_data(sessionStorage);
    /*
    const data = sessionStorage;
    let stamp = Date.now().toString();
    database.ref(stamp).set(data)
        .then(function() {
            successful_upload_message.style.display = 'block';
        })
        .catch(function(error) {
            direct_download_message.style.display = 'block';
            direct_download_data(data);
        });
    */
    submitted = true;
    console.log(sessionStorage);
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
/*
Database Initialisation
*/
// firebase.initializeApp(firebaseConfig);
// let database = firebase.database();