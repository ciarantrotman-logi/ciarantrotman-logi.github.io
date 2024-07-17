function on_continue(){
    document.getElementById('introduction').style.display = "none";
    document.getElementById('metric-area').style.display = "block";
}

let evaluation_section_area = document.getElementById('evaluation-area');
let progress_bar = document.getElementById('progress-bar');

let url = new URL(window.location.href);
let disable_tlx = url.searchParams.get("no_tlx") !== null;
let disable_umux = url.searchParams.get("no_umux") !== null;
let disable_attrakdiff = url.searchParams.get("no_attrakdiff") !== null;
let disable_timbre = url.searchParams.get("no_timbre") !== null;
let disable_tactility = url.searchParams.get("no_tactility") !== null;
let disable_ergo = url.searchParams.get("no_ergo") !== null;
let disable_fss = url.searchParams.get("no_fss") !== null;
let manually_download_data = url.searchParams.get("manual_download") !== null;
let query_string = "";
extract_query_parameters(url.toString());
function extract_query_parameters(url_string) {
    let question_mark_index = url_string.indexOf("?");
    if (question_mark_index !== -1) {
        query_string = '?';
        query_string += url_string.substring(question_mark_index + 1);
    }
}
console.log(`Query Parameters = ${query_string}`);
console.log(`Manual Download = ${manually_download_data}`);

let sections = [
    {   id: 'tlx-k',
        metrics: [
            {id: "tlx-k-mental-demand"},
            {id: "tlx-k-physical-demand"},
            {id: "tlx-k-temporal-demand"},
            {id: "tlx-k-performance"},
            {id: "tlx-k-effort"},
            {id: "tlx-k-frustration"},
        ],
        range: {min: -10, max: 10, value: 0}},
    {   id: 'umux-k',
        metrics: [
            {id: "umux-k-functionality"},
            {id: "umux-k-frustration"},
            {id: "umux-k-easiness"},
            {id: "umux-k-difficulty"},
            {id: "umux-k-legibility"},
            {id: "umux-k-ergonomics"},
            {id: "umux-k-satisfaction"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   id: 'attrakdiff-k',
        metrics: [
            {id: "attrakdiff-k-p-simple"},
            {id: "attrakdiff-k-a-attractive"},
            {id: "attrakdiff-k-p-practical"},
            {id: "attrakdiff-k-h-stylish"},
            {id: "attrakdiff-k-p-predictable"},
            {id: "attrakdiff-k-h-premium"},
            {id: "attrakdiff-k-h-imaginative"},
            {id: "attrakdiff-k-a-good"},
            {id: "attrakdiff-k-p-structured"},
            {id: "attrakdiff-k-h-captivating"}
        ],
        range: {min: -3, max: 3, value: 0}},
    {   id: 'timbre-k',
        metrics: [
            {id: "timbre-k-hard"},
            {id: "timbre-k-loud"},
            {id: "timbre-k-powerful"},
            {id: "timbre-k-harsh"},
            {id: "timbre-k-high"},
            {id: "timbre-k-deep"},
            {id: "timbre-k-pleasant"},
            {id: "timbre-k-harmonious"},
            {id: "timbre-k-beautiful"},
            {id: "timbre-k-rough"},
            {id: "timbre-k-dull"},
            {id: "timbre-k-thick"},
            {id: "timbre-k-grating"},
            {id: "timbre-k-premium"},
            {id: "timbre-k-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'tactility-k',
        metrics: [
            {id: "tactility-k-comfortable"},
            {id: "tactility-k-heavy"},
            {id: "tactility-k-strong"},
            {id: "tactility-k-distinct"},
            {id: "tactility-k-sharp"},
            {id: "tactility-k-stable"},
            {id: "tactility-k-pleasant"},
            {id: "tactility-k-premium"},
            {id: "tactility-k-satisfying"},
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'ergo-k',
        metrics: [
            {id: "ergo-k-smooth"},
            {id: "ergo-k-sticky"},
            {id: "ergo-k-soft"},
            {id: "ergo-k-cold"},
            {id: "ergo-k-flexible"},
            {id: "ergo-k-pleasant"},
            {id: "ergo-k-premium"},
            {id: "ergo-k-satisfying"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   id: 'fss-k',
        metrics: [
            {id: "fss-k-a-challenge"},
            {id: "fss-k-f-fluidity"},
            {id: "fss-k-a-temporality"},
            {id: "fss-k-f-concentration"},
            {id: "fss-k-f-clarity"},
            {id: "fss-k-a-absorption"},
            {id: "fss-k-f-autonomy"},
            {id: "fss-k-f-confidence"},
            {id: "fss-k-f-control"},
            {id: "fss-k-a-thought"}
        ],
        range: {min: -2, max: 2, value: 0}}
]

let filtered_sections = [];

sections.forEach(section => {
    switch (section.id) {
        case 'tlx-k':
            if (!disable_tlx) {
                filtered_sections.push(section);
            }
            break;
        case 'umux-k':
            if (!disable_umux) {
                filtered_sections.push(section);
            }
            break;
        case 'attrakdiff-k':
            if (!disable_attrakdiff) {
                filtered_sections.push(section);
            }
            break;
        case 'timbre-k':
            if (!disable_timbre) {
                filtered_sections.push(section);
            }
            break;
        case 'tactility-k':
            if (!disable_tactility) {
                filtered_sections.push(section);
            }
            break;
        case 'ergo-k':
            if (!disable_ergo) {
                filtered_sections.push(section);
            }
            break;
        case 'fss-k':
            if (!disable_fss) {
                filtered_sections.push(section);
            }
            break;
        default:
            break;
    }
});

sections = filtered_sections;

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
    sections.forEach(section => {
        let base_id = section.id.toString();
        let marker = construct_element_with_id("p", `${base_id}-indicator`, 'section-indicator');
        marker.innerHTML = `${index}`;
        progression_indicators.appendChild(marker);
        index++;
    })
    let i = 1;
    sections.forEach(section =>{
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

let previousButton = document.getElementById('subjective-evaluation-previous-section');
let nextButton = document.getElementById('subjective-evaluation-next-section');
let submitButton = document.getElementById('subjective-evaluation-submit');

let index = 0;

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
    index = clamp(index, 0, sections.length - 1);
}

function manage_section(){
    nextButton.disabled = index === sections.length - 1;
    previousButton.disabled = index === 0;
    submitButton.style.display = index !== sections.length - 1 ? "none" : "block";
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

function submit(){
    document.getElementById('metric-area').style.display = "none";
    document.getElementById('finish-screen').style.display = "block";
    sessionStorage.setItem('evaluation-year', new Date().getUTCFullYear().toString());
    sessionStorage.setItem('evaluation-month', new Date().getUTCMonth().toString());
    sessionStorage.setItem('evaluation-day', new Date().getUTCDay().toString());
    sessionStorage.setItem('evaluation-hour', new Date().getUTCHours().toString());
    sessionStorage.setItem('evaluation-minute', new Date().getUTCMinutes().toString());
    sessionStorage.setItem('evaluation-second', new Date().getUTCSeconds().toString());
    sections.forEach(section => {
        section.metrics.forEach( metric => {
            sessionStorage.setItem(metric.id, document.getElementById(metric.id).value);
        })
    })
    download_data();
}

let submitted = false;

function download_data() {
    let stamp = sessionStorage.getItem('uid');
    if (manually_download_data){
        manual_download(sessionStorage);
        return;
    }
    database.ref(stamp).set(sessionStorage)
        .then(function() {
            document.getElementById("finish-screen").innerHTML =
                "Thank you for participating in this user test! You may now close this window."
        })
        .catch(function(error) {
            console.log(error);
            manual_download(sessionStorage);
        });
    submitted = true;
}

function manual_download(data){
    document.getElementById("finish-screen").innerHTML =
        "Thank you for participating in this user test, please download this .JSON file and send it to the facilitator.";
    const json = {};
    Object.keys(data).forEach(key => {
        json[key] = data[key];
    });
    const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const placeholder = document.createElement("a");
    placeholder.href = url;
    placeholder.download = sessionStorage.getItem('uid');
    document.body.appendChild(placeholder);
    placeholder.click();
    document.body.removeChild(placeholder);
    URL.revokeObjectURL(url);
}

window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});
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
/*
Database Initialisation
*/
firebase.initializeApp(firebaseConfig);
let database = firebase.database();
/*
Page Construction
*/
construct_page();
manage_section();