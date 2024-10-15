const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new THREE.PointerLockControls(camera, document.body);

camera.position.set(0,0,0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.add(controls.getObject());

scene.background = new THREE.Color(0xbbc9f4);

let spawned_objects = [];

function generate_targets(){
    for (let i = 0; i < 30; i++) {
        let geometry = new THREE.DodecahedronGeometry();
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.75
        });
        material.castShadow = true;
        let object = new THREE.Mesh(geometry, material);

        object.type = Math.random() < 0 ? 'oscillate' : 'rotate';
        object.oscillation_amplitude = Math.random() * 2;
        object.speed = random_float(-.2, .2);
        object.is_valid_target = true;
        
        let target_radius = random_float(10, 15);
        let target_position = random_point_on_sphere(target_radius, -3, 3);
        
        object.initial_radius = target_radius;
        object.position.set(target_position.x, target_position.y, target_position.z);
        
        let scale_factor = random_float(.25, 1);
        object.scale.set(scale_factor, scale_factor, scale_factor);
        scene.add(object);
        spawned_objects.push(object);
    }
}
function generate_environment(height) {
    let geometry = new THREE.CylinderGeometry();
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25
    });
    material.receiveShadow = true;
    let object = new THREE.Mesh(geometry, material);
    object.position.set(0, height, 0);
    object.scale.set(3, .1, 3);
    scene.add(object);
}
function generate_reticule() {
    let geometry = new THREE.TorusGeometry();
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75
    });
    let object = new THREE.Mesh(geometry, material);
    object.position.set(0, 0, -1);
    object.scale.set(.01, .01, .01);
    camera.add(object);
}

generate_targets();
generate_environment(-1);
generate_environment(1);
generate_reticule();

document.addEventListener('click', () => {
    if (controls.isLocked){
        return;
    }
    controls.lock();
});
window.addEventListener('click', () => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    let raycaster = new THREE.Raycaster(camera.position, direction);
    const intersected_objects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersected_objects.length; i++) {
        const object = intersected_objects[i];
        if (object.object.is_valid_target) {
            scene.remove(object.object);
            break;
        }
    }
});


function animate() {
    requestAnimationFrame(animate);
    spawned_objects.forEach(object => {
        if (object.type === 'oscillate') {
            object.position.y += Math.sin(Date.now()) * object.oscillation_amplitude;
        } else if (object.type === 'rotate') {
            rotate_object_in_circle(object, object.initial_radius, object.speed);
        }
    });
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//----------------------------------------------------------------------------------------------------------------------
function random_point_on_sphere(radius, min_y, max_y) {
    let point;
    do {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        point = { x, y, z };
    } while (point.y < min_y || point.y > max_y);
    return point;
}
function random_float(min, max) {
    return Math.random() * (max - min) + min;
}
function random_hex_color() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor.padStart(6, '0');
}
function rotate_object_in_circle(object, radius, speed) {
    const time = Date.now() * 0.001;
    object.position.x = radius * Math.cos(time * speed);
    object.position.z = radius * Math.sin(time * speed);
}