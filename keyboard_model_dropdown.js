let makeDropdown = document.getElementById('evaluated-keyboard-make');
let modelDropdown = document.getElementById('evaluated-keyboard-model');
let apple = [
    {id: "magickeyboard", label: "Magic Keyboard", url: ""},
    {id: "magickeyboardforipad", label: "Magic Keyboard for iPad", url: ""}
]
let asus = [
    {id: "azoth", label: "Azoth", url: ""},
    {id: "falchion", label: "Falchion", url: ""},
    {id: "claymoreii", label: "Claymore II", url: ""}
]
let corsair = [
    {id: "k60", label: "K60", url: ""},
    {id: "k65mini", label: "K65 Mini", url: ""},
    {id: "k70pro", label: "K70 Pro", url: ""},
    {id: "k70", label: "K70", url: ""},
    {id: "k100rgb", label: "K100 RGB", url: ""}
]
let hyperx = [
    {id: "alloyorigins60", label: "Alloy Origins 60", url: ""},
    {id: "alloyorigins65", label: "Alloy Origins 65", url: ""}
]
let keychron = [
    {id: "k1", label: "K1", url: ""},
    {id: "k4", label: "K4", url: ""},
    {id: "k8", label: "K8", url: ""},
    {id: "k8pro", label: "K8 Pro", url: ""},
    {id: "q4", label: "Q4", url: ""},
    {id: "q6", label: "Q6", url: ""},
    {id: "q8", label: "Q8", url: ""}
]
let kinesis = [
    {id: "freestyleedge", label: "Freestyle Edge", url: ""},
]
let logitech = [
    {id: "mxmechanical", label: "MX Mechanical", url: ""},
    {id: "mxmechanicalmini", label: "MX Mechanical Mini", url: ""},
    {id: "mxkeys", label: "MX Keys", url: ""},
    {id: "mxkeysmini", label: "MX Keys Mini", url: ""},
    {id: "mxkeyss", label: "MX Keys S", url: ""},
    {id: "g213", label: "G213", url: ""},
    {id: "g513", label: "G513", url: ""},
    {id: "g715", label: "G715", url: ""},
    {id: "g815", label: "G815", url: ""},
    {id: "g910", label: "G910", url: ""},
    {id: "g915", label: "G915", url: ""},
    {id: "k650", label: "K650", url: ""},
    {id: "craft", label: "Craft", url: ""},
    {id: "prox", label: "Pro X", url: ""},
    {id: "keystogo", label: "Keys-To-Go", url: ""},
    {id: "popkeys", label: "Pop Keys", url: ""},
    {id: "slimfoliopro", label: "Slim Folio Pro", url: ""},
    {id: "k380", label: "K380", url: ""},
    {id: "k860", label: "K860", url: ""},
    {id: "k780", label: "K780", url: ""},
    {id: "combotouch", label: "Combo Touch", url: ""}
]
let microsoft = [
    {id: "surfaceergonomickeyboard", label: "Surface Ergonomic Keyboard", url: ""},
    {id: "surfacekeyboard", label: "Surface Keyboard", url: ""},
    {id: "sculpt", label: "Sculpt", url: ""},
    {id: "surfaceprokeyboard", label: "Surface Pro Keyboard", url: ""}
]
let nuphy = [
    {id: "air75", label: "Air75", url: ""},
    {id: "air96", label: "Air96", url: ""},
    {id: "halo65", label: "Halo65", url: ""},
    {id: "halo75", label: "Halo75", url: ""},
    {id: "halo96", label: "Halo96", url: ""}
]
let razer = [
    {id: "deathstalker", label: "DeathStalker", url: ""},
    {id: "protypeultra", label: "Pro Type Ultra", url: ""},
    {id: "blackwidowchroma", label: "Blackwidow Chroma", url: ""},
    {id: "hunstmanmini", label: "Hunstman Mini", url: ""},
    {id: "cynosachroma", label: "Cynosa Chroma", url: ""}
]
let steelseries = [
    {id: "apexpro", label: "Apex Pro", url: ""},
    {id: "apex3", label: "Apex 3", url: ""}
]
let vgn = [
    {id: "s99", label: "S99", url: ""}
]
let wooting = [
    {id: "he", label: "HE", url: ""},
    {id: "60he", label: "60 HE", url: ""}
]
let zsa = [
    {id: "moonlander", label: "Moonlander", url: ""},
]
makeDropdown.addEventListener('change', function (){
    populateKeyboardModelOptions();
});
function populateKeyboardModelOptions(){
    modelDropdown.innerHTML = "";
    switch (makeDropdown.value){
        case 'apple':
            generateModelOptions(apple);
            break;
        case 'asus':
            generateModelOptions(asus);
            break;
        case 'corsair':
            generateModelOptions(corsair);
            break;
        case 'hyperx':
            generateModelOptions(hyperx);
            break;
        case 'keychron':
            generateModelOptions(keychron);
            break;
        case 'kinesis':
            generateModelOptions(kinesis);
            break;
        case 'logitech':
            generateModelOptions(logitech);
            break;
        case 'microsoft':
            generateModelOptions(microsoft);
            break;
        case 'nuphy':
            generateModelOptions(nuphy);
            break;
        case 'razer':
            generateModelOptions(razer);
            break;
        case 'steelseries':
            generateModelOptions(steelseries);
            break;
        case 'vgn':
            generateModelOptions(vgn);
            break;
        case 'wooting':
            generateModelOptions(wooting);
            break;
        case 'zsa':
            generateModelOptions(zsa);
            break;
    }
}
function generateModelOptions(make){
    make.forEach(model =>{
        let option = document.createElement('option');
        option.label = model.label;
        option.value = model.id;
        option.id = model.id;
        modelDropdown.appendChild(option);
        sessionStorage.setItem('completion-url', model.url);
    })
}
populateKeyboardModelOptions();