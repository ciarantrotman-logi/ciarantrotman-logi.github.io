let data = [];
let input = document.getElementById('json-key');
let key = input.value === '' 
            ? input.placeholder 
            : input.value;
let keyboards = [];
let keys = [];
function parse(event){
    document.getElementById('parameter-selector').style.display = 'block';
    process(Array.from(event.target.files)).then(r => construct());
}
async function process(files) {
    for (const file of files) {
        let parsed = JSON.parse(await read(file));
        data.push(parsed);
        let container = document.getElementById('parameter-keys');
        data.forEach((obj, index) => {
            for (const key in obj) {
                if (!keys.includes(key) && valid(obj, key)) {
                    keys.push(key);
                    checkbox(obj, key, container);
                }
            }
        });
    }
}
function checkbox(obj, key, container){
    let div = document.createElement('div');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = key;
    checkbox.checked = true;
    div.appendChild(checkbox);
    let label = document.createElement('label');
    label.textContent = key;
    div.appendChild(label);
    container.appendChild(div);
}
function valid(obj, key){
    return !isNaN(obj[key]) && obj[key] !== null;
}
function construct(){
    data.forEach(file =>{
        let keyboard = file[key];
        if (!keyboards.includes(keyboard)){
            keyboards.push({
                model: file['evaluated-keyboard-model'],
                make: file['evaluated-keyboard-make'],
                data: [],
                aggregated: []
            });
        }
    })
}
async function read(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}
function aggregate(){
    keyboards.forEach(keyboard =>{
          data.forEach(object =>{
              if(object[key] === keyboard.model){
                  keyboard.data.push(object);
              }
          })
    })
    keyboards.forEach(keyboard =>{
        console.log(`${keyboard.model} has ${keyboard.data.length} instances.`);
        let aggregated = {};
        aggregated["model"] = keyboard.model;
        aggregated["make"] = keyboard.make;
        keys.forEach(key =>{
            if (document.getElementById(key).checked){
                let values = [];
                keyboard.data.forEach(object => {
                    values.push(parseFloat(object[key]));
                });
                if (mean()) {
                    aggregated[`${key}-mean`] = values.reduce((acc, val) => acc + val, 0) / values.length;
                }
                if (variance()){
                    aggregated[`${key}-variance`] = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
                }
            }
        })
        keyboard.aggregated = aggregated;
    })
    download();
}
function mean(){
    return  document.getElementById('data-selection').value === 'mean' ||
            document.getElementById('data-selection').value === 'mean-and-variance';
}
function variance(){
    return  document.getElementById('data-selection').value === 'variance' ||
        document.getElementById('data-selection').value === 'mean-and-variance';
}
async function download(){
    const zip = new JSZip();
    keyboards.forEach(keyboard =>{
        const blob = new Blob([JSON.stringify(keyboard.aggregated, null, 2)], { type: "application/json" });
        zip.file(`${keyboard.model}.json`, blob);
    })
    const blob = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${Date.now().toString()}.zip`;
    downloadLink.click();
}