let data = [];
let input = document.getElementById('json-key');
let key = input.value === '' 
            ? input.placeholder 
            : input.value;
let keyboards = [];
let keys = [];
function parse(event){
    process(Array.from(event.target.files)).then(r => construct());
}
async function process(files) {
    for (const file of files) {
        let parsed = JSON.parse(await read(file));
        data.push(parsed);
        data.forEach((obj, index) => {
            for (const key in obj) {
                if (!keys.includes(key) && valid(obj, key)) {
                    keys.push(key);
                }
            }
        });
    }
    createParameterSelector();
}
function construct(){
    data.forEach(file =>{
        let keyboard = file[key];
        if (!keyboards.includes(keyboard)){
            keyboards.push({
                name: keyboard,
                data: [],
                aggregated: []
            });
        }
    })
}
function createParameterSelector(){
    let container = document.getElementById('parameter-selector');
    keys.forEach(key =>{
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
    })
}
function valid(obj, key){
    return !isNaN(obj[key]);
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
              if(object[key] === keyboard.name){
                  keyboard.data.push(object);
              }
          })
    })
    keyboards.forEach(keyboard =>{
        console.log(`${keyboard.name} has ${keyboard.data.length} instances.`);
        let aggregated = [];
        aggregated.push({
            [key] : keyboard.name
        })
        keys.forEach(key =>{
            if (document.getElementById(key).checked){
                let values = [];
                keyboard.data.forEach(object => {
                    values.push(parseFloat(object[key]));
                });
                let mean = values.reduce((acc, val) => acc + val, 0) / values.length;
                let variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
                aggregated.push({
                    [`${key}-mean`] : mean
                })
                aggregated.push({
                    [`${key}-variance`] : variance
                })
            }
        })
        keyboard.aggregated = aggregated;
    })
    download();
}
async function download(){
    const zip = new JSZip();
    keyboards.forEach(keyboard =>{
        const blob = new Blob([JSON.stringify(keyboard.aggregated, null, 2)], { type: "application/json" });
        zip.file(`${keyboard.name}.json`, blob);
    })
    const blob = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${Date.now().toString()}.zip`;
    downloadLink.click();
}