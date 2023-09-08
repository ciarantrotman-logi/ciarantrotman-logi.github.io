function createLocales(event){
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const csv = event.target.result;
        const parsed = Papa.parse(csv, { header: true }).data;
        const headers = Object.keys(parsed[1]);

        let json = [];
        for (let i = 1; i < headers.length; i++){
            let pairs = {};
            for (let j = 0; j < parsed.length; j++){
                pairs[parsed[j][headers[0]]] = parsed[j][headers[i]];
            }
            json.push(pairs);
        }
        download(json, headers);
    };
    reader.readAsText(file);
}

async function download(json, headers){
    const zip = new JSZip();

    for (let i = 0; i < json.length; i++){
        const blob = new Blob([JSON.stringify(json[i], null, 2)], { type: "application/json" });
        zip.file(`${headers[i+1]}.json`, blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `locales.zip`;
    downloadLink.click();
}