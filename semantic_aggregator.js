let data = [];
let metrics = [];
let keys = [
    "timbre",
    "haptic",
    "somato"
]
let csv = [];

function parse(event){
    process(Array.from(event.target.files)).then(r => construct());
}
async function process(files) {
    for (const file of files) {
        let parsed = JSON.parse(await read(file));
        data.push(parsed);
    }
}
async function read(file){
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}
function construct(){
    data.forEach(file =>{
        keys.forEach(key => {
            let json = file;
            let regex = new RegExp("^" + key);
            let match = Object.keys(json).filter(key => regex.test(key));
            match.forEach(parameter => {
                if(!metrics.some(metric => metric.category === key && metric.metric === parameter)){
                    metrics.push({category: key, metric: parameter});
                }
            })
        })
    })
    csv.push({
        category: 'category',
        metric: 'metric',
        value: 'value',
        'evaluated-keyboard-make': 'evaluated-keyboard-make',
        'evaluated-keyboard-model': 'evaluated-keyboard-model',
        'switch-make': 'switch-make',
        'switch-model': 'switch-model',
        'document-index': 'document-index'
    });
    let i = 1;
    data.forEach(file =>{
        metrics.forEach(metric =>{
            csv.push({
                category: metric.category, 
                metric: metric.metric, 
                value: file[metric.metric], 
                'evaluated-keyboard-make': file['evaluated-keyboard-make'],
                'evaluated-keyboard-model': file['evaluated-keyboard-model'],
                'switch-make': file['switch-make'],
                'switch-model': file['switch-model'],
                'document-index': i
                }
            )
        })
        i++;
    })
    download();
}
async function download(){
    let download = csv.map(row => Object.values(row).join(',')).join('\n');
    let blob = new Blob([download], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'semantic-aggregation.csv');
    link.click();
}