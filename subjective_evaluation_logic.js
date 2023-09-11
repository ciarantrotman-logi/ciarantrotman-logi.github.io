function onContinue(){
    document.getElementById('introduction').style.display = "none";
    document.getElementById('metric-area').style.display = "block";
}

let evaluationArea = document.getElementById('evaluation-area');

let sections = [
    {   header: 'Cognitive Load',
        introduction: 'This first section is focused on understanding how <b>easy or difficult you found the evaluation task</b> with this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'task-load-index',
        metrics: [
            {id: "tlx-mental-demand"},
            {id: "tlx-physical-demand"},
            {id: "tlx-temporal-demand"},
            {id: "tlx-performance"},
            {id: "tlx-effort"},
            {id: "tlx-frustration"}
        ],
        range: {min: -10, max: 10, value: 0}},
    {   header: 'Usability',
        introduction: 'Next, we want to get understand how <b>how you found using this keyboard</b> during the evaluation.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'keyboard-usability-score',
        metrics: [
            {id: "umux-p-functionality"},
            {id: "umux-n-frustration"},
            {id: "umux-p-easiness"},
            {id: "umux-n-difficulty"},
            {id: "umux-k-legibility"},
            {id: "umux-k-ergonomics"},
            {id: "umux-k-satisfaction"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   header: 'Immersion',
        introduction: 'Now we want to get a quick insight into how <b>immersed you were</b> while you were doing this evaluation.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'flow-short-scale',
        metrics: [
            {id: "fss-aba-challenge"},
            {id: "fss-fp-fluidity"},
            {id: "fss-aba-temporality"},
            {id: "fss-fp-concentration"},
            {id: "fss-fp-clarity"},
            {id: "fss-aba-absorption"},
            {id: "fss-fp-autonomy"},
            {id: "fss-fp-confidence"},
            {id: "fss-fp-control"},
            {id: "fss-aba-thought"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   header: 'Acoustics',
        introduction: 'This next section looks at what your impressions of the <b>sound of the keyboard</b> are.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the acoustics of the keyboard you are evaluating.',
        id: 'timbre-semantic-pairs',
        metrics: [
            {id: "timbre-calmness"},
            {id: "timbre-pleasantness"},
            {id: "timbre-smoothness"},
            {id: "timbre-harmoniousness"},
            {id: "timbre-gentleness"},
            {id: "timbre-sharpness"},
            {id: "timbre-loudness"},
            {id: "timbre-pitch"},
            {id: "timbre-thickness"},
            {id: "timbre-weakness"},
            {id: "timbre-metallicness"},
            {id: "timbre-harshness"},
            {id: "timbre-beauty"},
            {id: "timbre-keyboard-premiumness"},
            {id: "timbre-keyboard-satisfaction"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Tactile Feedback',
        introduction: 'Next, we want a sense of what your impressions of the <b>tactile feedback from the keyboard</b> are.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the click feel of the keyboard you are evaluating.',
        id: 'haptic-semantic-pairs',
        metrics: [
            {id: "haptic-pleasantness"},
            {id: "haptic-comfort"},
            {id: "haptic-satisfaction"},
            {id: "haptic-heaviness"},
            {id: "haptic-strength"},
            {id: "haptic-distinctness"},
            {id: "haptic-sharpness"},
            {id: "haptic-stability"},
            {id: "haptic-premiumness"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Touch and Feel',
        introduction: 'Now we want a quick sense of your thoughts on the <b>touch and feel of the keys</b> on this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the feeling of keys on the keyboard you are evaluating.',
        id: 'somatosensory-semantic-pairs',
        metrics: [
            {id: "somatosensory-smoothness"},
            {id: "somatosensory-stickiness"},
            {id: "somatosensory-softness"},
            {id: "somatosensory-coldness"},
            {id: "somatosensory-flexibility"}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Design and Aesthetics',
        introduction: 'Then finally, we want to get a sense of your perception of the <b>design and aesthetics</b> of this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the keyboard you are evaluating.',
        id: 'hedonistic-pragmatic-usability',
        metrics: [
            {id: "attrakdiff-p-simple"},
            {id: "attrakdiff-a-attractive"},
            {id: "attrakdiff-p-practical"},
            {id: "attrakdiff-h-stylish"},
            {id: "attrakdiff-p-predictable"},
            {id: "attrakdiff-h-premiumn"},
            {id: "attrakdiff-h-creative"},
            {id: "attrakdiff-a-good"},
            {id: "attrakdiff-p-structure"},
            {id: "attrakdiff-h-captivating"}
        ],
        range: {min: -3, max: 3, value: 0}
    }
]

constructPage();

function constructElementWithID(tag, id){
    let element = document.createElement(tag);
    element.id = id;
    return element;
}

function constructPage(){
    let i = 1;
    sections.forEach(section =>{
        let container = document.createElement("div");
        let baseID = section.id.toString();
        container.id = baseID;
        let progression = " (" + i + "/" + sections.length + ")";
        // container.innerHTML = "<h2>" + section.header + progression + "</h2>";
        
        let header = constructElementWithID("h2", `${baseID}-header`);
        let introduction = constructElementWithID("p", `${baseID}-introduction`);
        let instructions = constructElementWithID("i", `${baseID}-instruction`);
        
        let divider = document.createElement("div");
        divider.innerHTML = "<br><hr><br>";
        
        container.appendChild(header);
        container.appendChild(introduction);
        container.appendChild(instructions);
        container.appendChild(divider);
        
        section.metrics.forEach(metric =>{
            let element = document.createElement("div");
            let description = document.createElement("div");
            let input = document.createElement("input");
            let labels = document.createElement("div");
            let left = document.createElement("label");
            let right = document.createElement("label");
            
            let baseID = metric.id.toString();

            input.id = baseID;
            input.type = "range";
            input.className = "slider";
            input.min = section.range.min;
            input.max = section.range.max;
            input.value = section.range.value;

            description.id = `${baseID}-description`;
            left.id = `${baseID}-low`;
            right.id = `${baseID}-high`;

            labels.className = "label-container";
            left.className = "left-label";
            right.className = "right-label";

            labels.appendChild(left);
            labels.appendChild(right);

            element.appendChild(description);
            element.appendChild(input);
            element.appendChild(labels);
            container.appendChild(element);
        })
        evaluationArea.appendChild(container);
        i++;
    })
}

let previousButton = document.getElementById('subjective-evaluation-previous-section');
let nextButton = document.getElementById('subjective-evaluation-next-section');
let submitButton = document.getElementById('subjective-evaluation-submit');

let index = 0;

function nextSection(){
    index++;
    index = clamp(index, 0, sections.length - 1);
    manageSection();
}
function previousSection(){
    index--;
    index = clamp(index, 0, sections.length - 1);
    manageSection();
}

function manageSection(){
    nextButton.disabled = index === sections.length - 1;
    previousButton.disabled = index === 0;

    submitButton.style.display = index !== sections.length - 1 ? "none" : "block";

    for (let i = 0; i < sections.length; i++) {
        document.getElementById(sections[i].id).style.display = i === index ? "block" : "none";
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
    downloadData();
}

let submitted = false;

function downloadData() {
    const data = sessionStorage;
    let stamp = Date.now().toString();
    database.ref(stamp).set(data)
        .then(function() {
            document.getElementById("finish-screen").innerHTML =
                "Thank you for participating in this user test! You may now close this window."
        })
        .catch(function(error) {
            document.getElementById("finish-screen").innerHTML =
                "Thank you for participating in this user test, please download this .JSON file and send it to the facilitator.";
            manualDownload(data);
        });
    submitted = true;
}

function manualDownload(data){
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

window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});


firebase.initializeApp(firebaseConfig);
let database = firebase.database();

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
}
manageSection();