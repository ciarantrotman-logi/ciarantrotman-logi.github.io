const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.PointerLockControls(camera, document.body);

camera.position.set(0,0,0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.add(controls.getObject());

let spawned_objects = [];

for (let i = 0; i < 100; i++) {
    let geometry = new THREE.DodecahedronGeometry();
    let material = new THREE.MeshBasicMaterial({ color: random_hex_color() });
    let object = new THREE.Mesh(geometry, material);
    let target_position = random_point_on_sphere(15);
    object.position.set(target_position.x, target_position.y, target_position.z);
    scene.add(object);
    spawned_objects.push(object);
}

function generate_environment(height) {
    let geometry = new THREE.CylinderGeometry();
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75
    });
    let object = new THREE.Mesh(geometry, material);
    object.position.set(0, height, 0);
    object.scale.set(3, .1, 3);
    scene.add(object);
}

generate_environment(-1);
generate_environment(1);

generate_environment();

document.addEventListener('click', lock_cursor);

function lock_cursor() {
    controls.lock();
}

function unlock_cursor() {
    controls.unlock();
}

function animate() {
    requestAnimationFrame(animate);
    spawned_objects.forEach((spawned_object) =>{
        spawned_object.rotation.x += 0.01;
        spawned_object.rotation.y += 0.01;
        spawned_object.rotation.z += 0.01;
    })
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//----------------------------------------------------------------------------------------------------------------------
function random_point_on_sphere(radius) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return { x, y, z };
}
function random_hex_color() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor.padStart(6, '0');
}