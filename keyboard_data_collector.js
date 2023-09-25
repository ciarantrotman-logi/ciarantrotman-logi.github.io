function downloadKeyboardData(event){
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true }).data;
        let json = [];
        for (let i = 1; i < parsed.length; i++){
            let data = {};
            data = parsed[i];
            for (const key in data){
                data[key] = sanitisedString(data[key]);
            }
            json.push(data);
        }

        for (let i = 0; i < json.length; i++){
            console.log();
        }
        download(json);
    };
    reader.readAsText(file);
}

function sanitisedString(target){
    if (!isNaN(target)){
        return target;
    }
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}

async function download(json){
    const zip = new JSZip();

    for (let i = 0; i < json.length; i++){
        const blob = new Blob([JSON.stringify(json[i], null, 2)], { type: "application/json" });
        zip.file(`${json[i]['evaluated-keyboard-make']}-${json[i]['evaluated-keyboard-model']}.json`, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${Date.now().toString()}.zip`;
    downloadLink.click();
}