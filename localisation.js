localisationOnLoad();

function applyLocalisation(){
    localisationOnLoad()
}

function localisationOnLoad(){
    let locale = sessionStorage.getItem('locale');
    if (locale === null){
        localise(document.getElementById('locale').value);
    }
    else{
        localise(locale);
    }
}

function localise(locale){
    console.log(`Locale set to ${locale}`);
    sessionStorage.setItem('locale', locale);
    fetch(`./locales/${locale}.json`)
        .then(response => response.json())
        .then(data =>{
            for (const key in data){
                let element = document.getElementById(key);
                if (element !== null){
                    element.innerHTML = data[key]
                }
            }
        })
}