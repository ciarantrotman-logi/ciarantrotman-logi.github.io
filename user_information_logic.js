let ansi = [
    {id:'english-us', label: 'US English'},
    {id:'chinese-pinyin', label: 'Chinese (Pinyin)'},
    {id:'chinese-zhuyin', label: 'Chinese (Zhuyin)'},
    {id:'thai', label: 'Thai'},
    {id:'korean', label: 'korean'}
]
let iso = [
    {layout: 'iso', id: "english-international", label: "International English" },
    {layout: 'iso', id: "british-irish", label: "British / Irish" },
    {layout: 'iso', id: "arabic", label: "Arabic" },
    {layout: 'iso', id: "bulgarian", label: "Bulgarian" },
    {layout: 'iso', id: "french-belgian", label: "French / Belgian" },
    {layout: 'iso', id: "french-canadian", label: "Canadian French" },
    {layout: 'iso', id: "greek", label: "Greek" },
    {layout: 'iso', id: "hebrew", label: "Hebrew" },
    {layout: 'iso', id: "turkish-f", label: "Turkish (F)" },
    {layout: 'iso', id: "turkish-q", label: "Turkish (Q)" },
    {layout: 'iso', id: "croatian-slovenian", label: "Croatian / Slovenian" },
    {layout: 'iso', id: "czech", label: "Czech" },
    {layout: 'iso', id: "danish", label: "Danish" },
    {layout: 'iso', id: "italian", label: "Italian" },
    {layout: 'iso', id: "norwegian", label: "Norwegian" },
    {layout: 'iso', id: "portuguese", label: "Portuguese" },
    {layout: 'iso', id: "slovak", label: "Slovak" },
    {layout: 'iso', id: "spanish-standard", label: "Spanish" },
    {layout: 'iso', id: "spanish-latin", label: "Latin American Spanish" },
    {layout: 'iso', id: "swiss", label: "Swiss" },
    {layout: 'iso', id: "german-austrian", label: "German / Austrian" },
    {layout: 'iso', id: "hungarian", label: "Hungarian" },
    {layout: 'iso', id: "icelandic", label: "Icelandic" },
    {layout: 'iso', id: "swedish-finnish", label: "Swedish / Finnish" },
    {layout: 'iso', id: "dutch", label: "Dutch" },
    {layout: 'iso', id: "romanian", label: "Romanian" }
]
let jis = [
    {layout: 'jis', id: "japanese", label: "Japanese" }
]

let layoutDropdown = document.getElementById('keyboard-layout');
let languageDropdown = document.getElementById('keyboard-language');

layoutDropdown.addEventListener('change', function (){
    populateKeyboardLanguageOptions();
})

function populateKeyboardLanguageOptions(){
    languageDropdown.innerHTML = "";
    switch (layoutDropdown.value){
        case 'iso':
            iso.forEach(language =>{
                let option = document.createElement('option');
                option.value = language.id;
                option.text = language.label;
                languageDropdown.appendChild(option);
            })
            break;
        case 'ansi':
            ansi.forEach(language =>{
                let option = document.createElement('option');
                option.value = language.id;
                option.text = language.label;
                languageDropdown.appendChild(option);
            })
            break;
        case 'jis':
            jis.forEach(language =>{
                let option = document.createElement('option');
                option.value = language.id;
                option.text = language.label;
                languageDropdown.appendChild(option);
            })
            break;
    }
}

let url = new URL(window.location.href);
let userIndex = url.searchParams.get('userID');

populateKeyboardLanguageOptions();

function inputUserInformation(){
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('user-information').style.display = 'block';
}
function inputKeyboardInformation(){
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('user-information').style.display = 'none';
    document.getElementById('keyboard-information').style.display = 'block';
}
function startEvaluation(){
    sessionStorage.setItem('user-id', userIndex);
    sessionStorage.setItem('user-name', sanitisedString(document.getElementById('user-name').value));
    
    sessionStorage.setItem('user-handedness', document.getElementById('user-handedness').value);
    sessionStorage.setItem('user-hand-size', document.getElementById('user-hand-size').value);
    
    sessionStorage.setItem('user-keyboard-usage', document.getElementById('keyboard-usage').value);
    sessionStorage.setItem('user-technical-familiarity', document.getElementById('technical-familiarity').value);

    sessionStorage.setItem('test-condition-flag', document.getElementById('test-condition-flag').value);
    sessionStorage.setItem('ergonomic-flag', document.getElementById('ergonomic-flag').value);
    
    sessionStorage.setItem('usage-environment', document.getElementById('usage-environment').value);
    sessionStorage.setItem('workspace-type', document.getElementById('workspace-type').value);
    
    sessionStorage.setItem('evaluated-keyboard-make', sanitisedString(document.getElementById('evaluated-keyboard-make').value));
    sessionStorage.setItem('evaluated-keyboard-model', sanitisedString(document.getElementById('evaluated-keyboard-model').value));

    sessionStorage.setItem('mechanical-flag', document.getElementById('mechanical-flag').value);
    sessionStorage.setItem('switch-make', sanitisedString(document.getElementById('switch-make').value));
    sessionStorage.setItem('switch-model', sanitisedString(document.getElementById('switch-model').value));
    
    sessionStorage.setItem('evaluated-keyboard-layout', document.getElementById('keyboard-layout').value);
    sessionStorage.setItem('evaluated-keyboard-language', document.getElementById('keyboard-language').value);
    
    sessionStorage.setItem('benchmark-flag', document.getElementById('benchmark-flag').value);
    sessionStorage.setItem('palm-rest-flag', document.getElementById('palm-rest-flag').value);
    
    submitted = true;
}

function sanitisedString(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}

setInterval(function() {
    document.getElementById('continue-to-keyboard-data').disabled 
        = document.getElementById('user-name').value.length === 0;
    document.getElementById('continue-to-evaluation').disabled
        = document.getElementById('evaluated-keyboard-make').value.length === 0
        || document.getElementById('evaluated-keyboard-model').value.length === 0;
    document.getElementById('switch-type-div').style.display 
        = document.getElementById('mechanical-flag').value === 'true'
            ? 'inline'
            : 'none';
})

let submitted = false;

window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});