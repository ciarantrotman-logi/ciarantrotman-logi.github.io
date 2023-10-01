let data = [];

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
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}
function construct(){
    data.forEach(file =>{
        const json = file;//JSON.parse(file);
        const key = "timbre";
        const regex = new RegExp("^" + key);
        const match = Object.keys(json).filter(key => regex.test(key));
        console.log(match);
    })
}