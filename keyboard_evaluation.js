let ansi = [
    {id:'english-us', label: 'US English'},
    {id:'chinese-pinyin', label: 'Chinese (Pinyin)'},
    {id:'chinese-zhuyin', label: 'Chinese (Zhuyin)'},
    {id:'thai', label: 'Thai'},
    {id:'korean', label: 'Korean'}
]
let iso = [
    {id: "english-international", label: "International English" },
    {id: "british-irish", label: "British / Irish" },
    {id: "arabic", label: "Arabic" },
    {id: "bulgarian", label: "Bulgarian" },
    {id: "french-belgian", label: "French / Belgian" },
    {id: "french-canadian", label: "Canadian French" },
    {id: "greek", label: "Greek" },
    {id: "hebrew", label: "Hebrew" },
    {id: "turkish-f", label: "Turkish (F)" },
    {id: "turkish-q", label: "Turkish (Q)" },
    {id: "croatian-slovenian", label: "Croatian / Slovenian" },
    {id: "czech", label: "Czech" },
    {id: "danish", label: "Danish" },
    {id: "italian", label: "Italian" },
    {id: "norwegian", label: "Norwegian" },
    {id: "portuguese", label: "Portuguese" },
    {id: "slovak", label: "Slovak" },
    {id: "spanish-standard", label: "Spanish" },
    {id: "spanish-latin", label: "Latin American Spanish" },
    {id: "swiss", label: "Swiss" },
    {id: "german-austrian", label: "German / Austrian" },
    {id: "hungarian", label: "Hungarian" },
    {id: "icelandic", label: "Icelandic" },
    {id: "swedish-finnish", label: "Swedish / Finnish" },
    {id: "dutch", label: "Dutch" },
    {id: "romanian", label: "Romanian" }
]
let jis = [
    {id: "japanese", label: "Japanese" }
]

let layout_dropdown = document.getElementById('keyboard-layout');
let language_dropdown = document.getElementById('keyboard-language');

layout_dropdown.addEventListener('change', function (){
    populate_keyboard_language_options();
});

function populate_keyboard_language_options(){
    language_dropdown.innerHTML = "";
    switch (layout_dropdown.value){
        case 'iso':
            generate_language_options(iso);
            break;
        case 'ansi':
            generate_language_options(ansi);
            break;
        case 'jis':
            generate_language_options(jis);
            break;
    }
}

function generate_language_options(layout){
    layout.forEach(language =>{
        let option = document.createElement('option');
        option.value = language.id;
        option.id = language.id;
        language_dropdown.appendChild(option);
    })
}

let url = new URL(window.location.href);
let user_index = url.searchParams.get('userID');
let skip_typing_evaluation = url.searchParams.get("skip_evaluation") !== null;
let query_string = "";
extract_query_parameters(url.toString());
function extract_query_parameters(url_string) {
    let question_mark_index = url_string.indexOf("?");
    if (question_mark_index !== -1) {
        query_string = '?';
        query_string += url_string.substring(question_mark_index + 1);
    }
}
console.log(`User ID = ${user_index}`);
console.log(`Query Parameters = ${query_string}`);

populate_keyboard_language_options();

function cache_user_information(){
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('user-information').style.display = 'block';
}
function cache_keyboard_information(){
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('user-information').style.display = 'none';
    document.getElementById('keyboard-information').style.display = 'block';
}
function cache_data_and_progress(){
    cache_session_storage();
    cache_system_information();
    submitted = true;
    window.location.href = skip_typing_evaluation 
        ? `keyboard_subjective_evaluation.html${query_string}`
        : `typing_evaluation.html${query_string}`;
}
function cache_session_storage(){
    sessionStorage.setItem('user-id', user_index);
    sessionStorage.setItem('uid', Date.now().toString());
    sessionStorage.setItem('user-name', sanitised_string(document.getElementById('user-name').value));

    sessionStorage.setItem('user-handedness', document.getElementById('user-handedness').value);
    sessionStorage.setItem('user-hand-size', document.getElementById('user-hand-size').value);

    sessionStorage.setItem('user-keyboard-usage', document.getElementById('keyboard-usage').value);
    sessionStorage.setItem('user-technical-familiarity', document.getElementById('technical-familiarity').value);

    sessionStorage.setItem('test-condition-flag', document.getElementById('test-condition-flag').value);
    sessionStorage.setItem('ergonomic-flag', document.getElementById('ergonomic-flag').value);

    sessionStorage.setItem('usage-environment', document.getElementById('usage-environment').value);
    sessionStorage.setItem('workspace-type', document.getElementById('workspace-type').value);

    sessionStorage.setItem('evaluated-keyboard-make', sanitised_string(document.getElementById('evaluated-keyboard-make').value));
    sessionStorage.setItem('evaluated-keyboard-model', sanitised_string(document.getElementById('evaluated-keyboard-model').value));

    sessionStorage.setItem('mechanical-flag', document.getElementById('mechanical-flag').value);
    if (document.getElementById('mechanical-flag').value === "true"){
        sessionStorage.setItem('switch-make', sanitised_string(document.getElementById('switch-make').value));
        sessionStorage.setItem('switch-model', sanitised_string(document.getElementById('switch-model').value));
    } else {
        sessionStorage.setItem('switch-make',  sanitised_string(document.getElementById('evaluated-keyboard-make').value));
        sessionStorage.setItem('switch-model', sanitised_string(document.getElementById('evaluated-keyboard-model').value));
    }

    sessionStorage.setItem('evaluated-keyboard-layout', document.getElementById('keyboard-layout').value);
    sessionStorage.setItem('evaluated-keyboard-language', document.getElementById('keyboard-language').value);

    sessionStorage.setItem('benchmark-flag', document.getElementById('benchmark-flag').value);
    sessionStorage.setItem('palm-rest-flag', document.getElementById('palm-rest-flag').value);

    sessionStorage.setItem('user-information-check', 'true');
}
function cache_system_information(){
    sessionStorage.setItem('browser-name', navigator.userAgent);
    sessionStorage.setItem('operating-system', navigator.platform);
    sessionStorage.setItem('preferred-language', navigator.language);
}

function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}

setInterval(function() {
    document.getElementById('switch-type-div').style.display
        = document.getElementById('mechanical-flag').value === 'true'
        ? 'block'
        : 'none';
    document.getElementById('continue-to-keyboard-data').disabled
        = document.getElementById('user-name').value.length === 0;
    document.getElementById('continue-to-evaluation').disabled
        = document.getElementById('evaluated-keyboard-make').value.length === 0
        || document.getElementById('evaluated-keyboard-model').value.length === 0;
})

let submitted = false;

window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});