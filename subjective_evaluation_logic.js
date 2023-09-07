function onContinue(){
    document.getElementById('introduction').style.display = "none";
    document.getElementById('metric-area').style.display = "block";
}

let evaluationArea = document.getElementById('evaluation-area');

fetch('./locales/en-us.json')
    .then(response => response.json())
    .then(data => console.log(data))

let sections = [
    {   header: 'Cognitive Load',
        introduction: 'This first section is focused on understanding how <b>easy or difficult you found the evaluation task</b> with this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'task-load-index',
        metrics: [
            {   id: "tlx-mental-demand",
                low: "Not at all",
                high: "Very much",
                description: "How mentally demanding was performing the typing task when using this keyboard?"},
            {   id: "tlx-physical-demand",
                low: "Not at all",
                high: "Very much",
                description: "How physically demanding was performing the typing task when using this keyboard?"},
            {   id: "tlx-temporal-demand",
                low: "Not at all",
                high: "Very much",
                description: "How rushed did you feel when performing the typing task when using this keyboard?"},
            {   id: "tlx-performance",
                low: "Not at all",
                high: "Very much",
                description: "How successful did you feel you were when performing the typing task when using this keyboard?"},
            {   id: "tlx-effort",
                low: "Not at all",
                high: "Very much",
                description: "How hard did you have to work when performing the typing task when using this keyboard?"},
            {   id: "tlx-frustration",
                low: "Not at all",
                high: "Very much",
                description: "How frustrated or irritated did you feel when performing the typing task when using this keyboard?"}
        ],
        range: {min: -10, max: 10, value: 0}},
    {   header: 'Usability',
        introduction: 'Next, we want to get understand how <b>how you found using this keyboard</b> during the evaluation.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'keyboard-usability-score',
        metrics: [
            {   id: "umux-p-functionality",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "This keyboard’s capabilities meet my requirements"},
            {   id: "umux-n-frustration",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "Using this keyboard is a frustrating experience"},
            {   id: "umux-p-easiness",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "This keyboard is easy to use"},
            {   id: "umux-n-difficulty",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I have to spend too much time correcting things with this keyboard"},
            {   id: "umux-k-legibility",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I was easily able to understand the text and iconography on this keyboard"},
            {   id: "umux-k-ergonomics",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I found that I was easily able to reach all of the keys I needed to press"},
            {   id: "umux-k-satisfaction",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I found that typing on this keyboard felt satisfying"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   header: 'Immersion',
        introduction: 'Now we want to get a quick insight into how <b>immersed you were</b> while you were doing this evaluation.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for each statement.',
        id: 'flow-short-scale',
        metrics: [
            {   id: "fss-aba-challenge",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I felt just the right amount of challenge during the evaluation task"},
            {   id: "fss-fp-fluidity",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "My thoughts and actions ran fluidly and smoothly while I was performing the evaluation task"},
            {   id: "fss-aba-temporality",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I did not notice the time passing during the evaluation task"},
            {   id: "fss-fp-concentration",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I had no difficulty concentrating while I was performing the evaluation task"},
            {   id: "fss-fp-clarity",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "My mind was completely clear while I was performing the evaluation task"},
            {   id: "fss-aba-absorption",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I was totally absorbed in the evaluation task"},
            {   id: "fss-fp-autonomy",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "The right movements occurred of their own accord while I was performing the evaluation task"},
            {   id: "fss-fp-confidence",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I knew what I had to do at each step of the way during the evaluation task"},
            {   id: "fss-fp-control",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I felt like I had everything under control while I was performing the evaluation task"},
            {   id: "fss-aba-thought",
                low: "Strongly disagree",
                high: "Strongly agree",
                description: "I was completely lost in thought during the evaluation task"}
        ],
        range: {min: -2, max: 2, value: 0}},
    {   header: 'Acoustics',
        introduction: 'This next section looks at what your impressions of the <b>sound of the keyboard</b> are.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the acoustics of the keyboard you are evaluating.',
        id: 'timbre-semantic-pairs',
        metrics: [
            {   id: "timbre-calmness",
                low: "Calm",
                high: "Harsh",
                description: ""},
            {   id: "timbre-pleasantness",
                low: "Pleasant",
                high: "Unpleasant",
                description: ""},
            {   id: "timbre-smoothness",
                low: "Smooth",
                high: "Rough",
                description: ""},
            {   id: "timbre-harmoniousness",
                low: "Harmonious",
                high: "Discordant",
                description: ""},
            {   id: "timbre-gentleness",
                low: "Gentle",
                high: "Hard",
                description: ""},
            {   id: "timbre-sharpness",
                low: "Sharp",
                high: "Dull",
                description: ""},
            {   id: "timbre-loudness",
                low: "Loud",
                high: "Soft",
                description: ""},
            {   id: "timbre-pitch",
                low: "High",
                high: "Low",
                description: ""},
            {   id: "timbre-thickness",
                low: "Thick",
                high: "Thin",
                description: ""},
            {   id: "timbre-weakness",
                low: "Weak",
                high: "Powerful",
                description: ""},
            {   id: "timbre-metallicness",
                low: "Metallic",
                high: "Deep",
                description: ""},
            {   id: "timbre-harshness",
                low: "Harsh",
                high: "Mild",
                description: ""},
            {   id: "timbre-beauty",
                low: "Beautiful",
                high: "Ugly",
                description: ""},
            /*{   id: "timbre-keyboard-crispiness",
                low: "Crispy",
                high: "Thocky",
                description: ""},*/
            {   id: "timbre-keyboard-premiumness",
                low: "Premium",
                high: "Basic",
                description: ""},
            {   id: "timbre-keyboard-satisfaction",
                low: "Satisfying",
                high: "Unsatisfying",
                description: ""}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Tactile Feedback',
        introduction: 'Next, we want a sense of what your impressions of the <b>tactile feedback from the keyboard</b> are.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the click feel of the keyboard you are evaluating.',
        id: 'haptic-semantic-pairs',
        metrics: [
            {   id: "haptic-pleasantness",
                low: "Pleasant",
                high: "Unpleasant",
                description: ""},
            {   id: "haptic-comfort",
                low: "Comfortable",
                high: "Uncomfortable",
                description: ""},
            {   id: "haptic-satisfaction",
                low: "Satisfying",
                high: "Unsatisfying",
                description: ""},
            {   id: "haptic-heaviness",
                low: "Heavy",
                high: "Light",
                description: ""},
            {   id: "haptic-strength",
                low: "Strong",
                high: "Weak",
                description: ""},
            {   id: "haptic-distinctness",
                low: "Distinct",
                high: "Indistinct",
                description: ""},
            {   id: "haptic-sharpness",
                low: "Sharp",
                high: "Dull",
                description: ""},
            {   id: "haptic-stability",
                low: "Stable",
                high: "Unstable",
                description: ""},
            {   id: "haptic-premiumness",
                low: "Premium",
                high: "Basic",
                description: ""}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Touch and Feel',
        introduction: 'Now we want a quick sense of your thoughts on the <b>touch and feel of the keys</b> on this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the feeling of keys on the keyboard you are evaluating.',
        id: 'somatosensory-semantic-pairs',
        metrics: [
            {   id: "somatosensory-smoothness",
                low: "Smooth",
                high: "Rough",
                description: ""},
            {   id: "somatosensory-stickiness",
                low: "Sticky",
                high: "Slippy",
                description: ""},
            {   id: "somatosensory-softness",
                low: "Soft",
                high: "Hard",
                description: ""},
            {   id: "somatosensory-coldness",
                low: "Cold",
                high: "Warm",
                description: ""},
            {   id: "somatosensory-flexibility",
                low: "Flexible",
                high: "Rigid",
                description: ""}
        ],
        range: {min: -50, max: 50, value: 0}},
    {   header: 'Design and Aesthetics',
        introduction: 'Then finally, we want to get a sense of your perception of the <b>design and aesthetics</b> of this keyboard.',
        instructions: 'Select using the sliders below the rating you consider the most appropriate for the keyboard you are evaluating.',
        id: 'hedonistic-pragmatic-usability',
        metrics: [
            {   id: "attrakdiff-p-simple",
                low: "Complicated",
                high: "Simple",
                description: ""},
            {   id: "attrakdiff-a-attractive",
                low: "Ugly",
                high: "Attractive",
                description: ""},
            {   id: "attrakdiff-p-practical",
                low: "Impractical",
                high: "Practical",
                description: ""},
            {   id: "attrakdiff-h-stylish",
                low: "Tacky",
                high: "Stylish",
                description: ""},
            {   id: "attrakdiff-p-predictable",
                low: "Unpredictable",
                high: "Predictable",
                description: ""},
            {   id: "attrakdiff-h-premiumn",
                low: "Cheap",
                high: "Premium",
                description: ""},
            {   id: "attrakdiff-h-creative",
                low: "Unimaginative",
                high: "Creative",
                description: ""},
            {   id: "attrakdiff-a-good",
                low: "Bad",
                high: "Good",
                description: ""},
            {   id: "attrakdiff-p-structure",
                low: "Confusing",
                high: "Clearly Structured",
                description: ""},
            {   id: "attrakdiff-h-captivating",
                low: "Dull",
                high: "Captivating",
                description: ""}
        ],
        range: {min: -3, max: 3, value: 0}
    }
]

let i = 1;
sections.forEach(section =>{
    let container = document.createElement("div");
    container.id = section.id.toString();
    let progression = " (" + i + "/" + sections.length + ")";
    container.innerHTML =
        "<h2>" + section.header + progression + "</h2>" +
        "<p>" + section.introduction + "</p>" +
        "<i>" + section.instructions + "</i>" +
        "<br><br><hr><br>";

    section.metrics.forEach(metric =>{
        let element = document.createElement("div");
        let input = document.createElement("input");
        let labels = document.createElement("div");
        let left = document.createElement("label");
        let center = document.createElement("label");
        let right = document.createElement("label");

        element.innerHTML = "<p>" + metric.description + "</p>";

        input.id = metric.id.toString();
        input.type = "range";
        input.className = "slider";
        input.min = section.range.min;
        input.max = section.range.max;
        input.value = section.range.value;

        left.innerHTML = metric.low;
        center.innerHTML = metric.center;
        right.innerHTML = metric.high;

        labels.className = "label-container";
        left.className = "left-label";
        center.className = "center-label";
        right.className = "right-label";

        labels.appendChild(left);
        if (metric.center !== undefined){
            labels.appendChild(center);
        }
        labels.appendChild(right);

        element.appendChild(input);
        element.appendChild(labels);
        container.appendChild(element);
    })
    evaluationArea.appendChild(container);
    i++;
})

let previousButton = document.getElementById('previous-section');
let nextButton = document.getElementById('next-section');
let submitButton = document.getElementById('submit');

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