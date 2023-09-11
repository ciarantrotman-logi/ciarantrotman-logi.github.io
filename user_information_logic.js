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
                option.id = language.id;
                languageDropdown.appendChild(option);
            })
            break;
        case 'ansi':
            ansi.forEach(language =>{
                let option = document.createElement('option');
                option.value = language.id;
                option.id = language.id;
                languageDropdown.appendChild(option);
            })
            break;
        case 'jis':
            jis.forEach(language =>{
                let option = document.createElement('option');
                option.value = language.id;
                option.id = language.id;
                languageDropdown.appendChild(option);
            })
            break;
    }
}

let url = new URL(window.location.href);
let userIndex = url.searchParams.get('userID');
console.log(`User ID = ${userIndex}`);

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