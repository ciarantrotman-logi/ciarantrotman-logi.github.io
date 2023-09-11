localisation();

function localisation(){
    let locale = sessionStorage.getItem('locale');
    if (locale === null){
        localise(document.getElementById('locale').value);
    }
    else{
        localise(locale);
    }
}

function localise(locale){
    sessionStorage.setItem('locale', locale);
    fetch(`./locales/${locale}.json`)
    .then(response => response.json())
    .then(data =>{
        console.log(`Locale set to ${data["language-label"]} (${locale})`);
        document.getElementById('locale').value = locale;
        for (const key in data){
            let element = document.getElementById(key);
            if (element !== null){
                element.innerHTML = data[key]
            }
        }
    })
}