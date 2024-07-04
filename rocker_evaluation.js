let task_sequence_length = 20;

let repeat_proc = .3;
let horizontal_proc = .6;
let vertical_proc = .8;
let diagonal_proc = 1;

let nodes = [
    {
        key: "up",
        index: 0
    },
    {
        key: "down",
        index: 1
    },
    {
        key: "back",
        index: 2
    },
    {
        key: "forward",
        index: 3
    },
]
/*
        0   ↔   1
        ⇅       ⇅
        3   ↔   2 
*/
let transformations = [
    "repeat",
    "horizontal",
    "vertical",
    "diagonal",
]

let node_index = get_random_int(0, nodes.length);

function transform_index(transformation, target_node) {
    console.log(`${transformation}, ${target_node.key}`);
    switch (transformation) {
        case "repeat":
            return target_node.index;
        case "horizontal":
            return target_node.index % 2 === 0 
                ? target_node.index + 1 
                : target_node.index - 1;
        case "diagonal":
            return target_node.index % 2 === 0
                ? target_node.index + 2
                : target_node.index - 2;
        case "vertical":
            if (target_node.index === 0) return 3;  
            if (target_node.index === 1) return 2;  
            if (target_node.index === 2) return 1;  
            if (target_node.index === 3) return 0;  
            break;
        default:
            break;
    }
}


for (let i = 0; i < task_sequence_length; i++) {
    let proc = Math.random();
    if (proc < repeat_proc){
        node_index = transform_index(transformations[0], nodes[node_index]);
    } else if (proc < horizontal_proc) {
        node_index = transform_index(transformations[1], nodes[node_index]);
    } else if (proc < vertical_proc) {
        node_index = transform_index(transformations[2], nodes[node_index]);
    } else {
        node_index = transform_index(transformations[3], nodes[node_index]);
    }
}

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
