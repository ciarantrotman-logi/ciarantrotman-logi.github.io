/*
Data Loss Prevention
*/
let submitted = true;
window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});
/*
Caching
*/
let url = new URL(window.location.href);
let user_index = url.searchParams.get('userID');
let full_analytics = url.searchParams.get('analytics') !== null;
console.log(`User ID = ${user_index}`);
console.log(`Full Analytics = ${full_analytics}`);
/*
State Management
*/
function proceed_to_user_information_section(){
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('user-information').style.display = 'block';
}
function proceed_to_mouse_information_section(){
    document.getElementById('user-information').style.display = 'none';
    document.getElementById('mouse-information').style.display = 'block';
}
function proceed_to_fitts_evaluation(){
    cache_session_storage();
    submitted = true;
    window.location.href = full_analytics 
        ? 'fitts_evaluation.html?analytics'
        : 'fitts_evaluation.html';
}
/*
Session Storage Management
*/
function cache_session_storage(){
    // Filtering Flags
    sessionStorage.setItem('test-condition-flag', document.getElementById('test-condition-flag').value);
    sessionStorage.setItem('ergonomic-flag', document.getElementById('ergonomic-flag').value);
    sessionStorage.setItem('benchmark-flag', document.getElementById('me-mouse-info-benchmark').value);
    // User Information 
    sessionStorage.setItem('user-id', user_index);
    sessionStorage.setItem('user-name', sanitised_string(document.getElementById('user-name').value));
    sessionStorage.setItem('user-handedness', document.getElementById('me-user-info-mouse-hand').value);
    sessionStorage.setItem('user-hand-size', document.getElementById('me-user-info-hand-size').value);
    sessionStorage.setItem('user-mouse-usage', document.getElementById('me-user-info-mouse-usage').value);
    sessionStorage.setItem('user-technical-familiarity', document.getElementById('me-user-info-mouse-familiarity').value);
    // Mouse Information
    sessionStorage.setItem('evaluation-mouse-make', sanitised_string(document.getElementById('me-mouse-info-mouse-make').value));
    sessionStorage.setItem('evaluation-mouse-model', sanitised_string(document.getElementById('me-mouse-info-mouse-model').value));
    sessionStorage.setItem('evaluation-mouse-color', sanitised_string(document.getElementById('me-mouse-info-mouse-color').value));
    if (dpi_known_field.value === 'true'){
        sessionStorage.setItem('evaluation-mouse-dpi', document.getElementById('me-mouse-info-dpi').value);
    } else {
        sessionStorage.setItem('evaluation-mouse-dpi*', document.getElementById('me-mouse-info-cursor-speed').value);
    }
    sessionStorage.setItem('evaluation-mouse-acceleration', document.getElementById('me-mouse-info-cursor-acceleration').value);
    // Environment Information
    sessionStorage.setItem('evaluation-surface', document.getElementById('me-mouse-info-surface-type').value);
    if (surface_type_field.value === 'mat'){
        if (mat_known_field.value === 'true'){
            sessionStorage.setItem('evaluation-mat-make', sanitised_string(document.getElementById('me-mouse-info-mat-make').value));
            sessionStorage.setItem('evaluation-mat-model', sanitised_string(document.getElementById('me-mouse-info-mat-model').value));
        } else {
            sessionStorage.setItem('evaluation-mat-hardness', document.getElementById('me-mouse-mat-hardness').value);
            sessionStorage.setItem('evaluation-mat-roughness', document.getElementById('me-mouse-mat-roughness').value);
        }
    } else {
        sessionStorage.setItem('evaluation-desk-material', document.getElementById('me-mouse-info-desk-material').value);
    }
    sessionStorage.setItem('evaluation-mouse-feet', document.getElementById('me-mouse-info-feet-information').value);
    if (feet_information_field.value === 'changed'){
        sessionStorage.setItem('evaluation-mouse-feet-make', sanitised_string(document.getElementById('me-mouse-info-feet-make').value));
        sessionStorage.setItem('evaluation-mouse-feet-model', sanitised_string(document.getElementById('me-mouse-info-feet-model').value));
    } else {
        sessionStorage.setItem('evaluation-mouse-feet-make', sessionStorage.getItem('evaluation-mouse-make'));
        sessionStorage.setItem('evaluation-mouse-feet-model', sessionStorage.getItem('evaluation-mouse-model'));
    }
}
/*
Utility Functions
*/
function sanitised_string(target){
    let sanitised = target.replace(/\W+/g, "");
    return sanitised.toLowerCase();
}
/*
Input Field Management
*/
let dpi_known_field = document.getElementById("me-mouse-info-dpi-known");
let dpi_known_input_fields = document.getElementById("me-mouse-info-dpi-known-details");
let dpi_unknown_input_fields = document.getElementById("me-mouse-info-dpi-unknown-details");

let surface_type_field = document.getElementById('me-mouse-info-surface-type');
let mat_input_fields = document.getElementById('me-mouse-info-mat-details');
let desk_input_fields = document.getElementById('me-mouse-info-desk-details');

let mat_known_field = document.getElementById('me-mouse-info-mat-brand-known');
let mat_known_input_fields = document.getElementById('me-mouse-info-mat-brand-known-details');
let mat_unknown_input_fields = document.getElementById('me-mouse-info-mat-brand-unknown-details');

let feet_information_field = document.getElementById('me-mouse-info-feet-information');
let feet_input_fields = document.getElementById('me-mouse-info-feet-details');

setInterval(function() {
    display_dpi_input_fields();
    display_surface_input_fields();
    display_feet_input_fields();
})
function display_dpi_input_fields(){
    let dpi_known = dpi_known_field.value === 'true';
    dpi_known_input_fields.style.display = dpi_known ? 'block' : 'none';
    dpi_unknown_input_fields.style.display = dpi_known ? 'none' : 'block';
}
function display_surface_input_fields(){
    let using_mat = surface_type_field.value === 'mat';
    mat_input_fields.style.display = using_mat ? 'block' : 'none';
    desk_input_fields.style.display = using_mat ? 'none' : 'block';
    if (using_mat){
        let mat_known = mat_known_field.value === 'true';
        mat_known_input_fields.style.display = mat_known ? 'block' : 'none';
        mat_unknown_input_fields.style.display = mat_known ? 'none' : 'block';
    }
}
function display_feet_input_fields(){
    let need_information = feet_information_field.value === 'changed';
    feet_input_fields.style.display = need_information ? 'block' : 'none';
}
/*
Debug Information 
*/
