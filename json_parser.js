function processJSON() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                const zip = new JSZip();

                for (let key in jsonData) {
                    if (jsonData.hasOwnProperty(key)) {
                        const innerData = jsonData[key];
                        const blob = new Blob([JSON.stringify(innerData, null, 2)], { type: "application/json" });
                        zip.file(`${key}.json`, blob);
                    }
                }

                const blob = await zip.generateAsync({ type: "blob" });
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${Date.now().toString()}.zip`;
                downloadLink.click();
            } catch (err) {
                console.error('Error parsing JSON:', err);
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    }
}