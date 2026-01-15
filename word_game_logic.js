// ---------------------------------------------------------------------------------------------------------------------    [SETTINGS]

const 
    min_word_length = 3, 
    total_letter_count = 12,
    board_generation_attempt_limit = 64,
    minimum_allowed_words = 64,
    solution_length_limit = 6;

// ---------------------------------------------------------------------------------------------------------------------    [DICTIONARY]

const VOWELS = [
    ['E', 12], ['A', 11], ['I', 10], ['O', 9], ['U', 4], ['Y', 2]
];
const CONSONANTS = [
    ['T', 9], ['N', 9], ['S', 9], ['R', 8], ['L', 7], ['C', 6],
    ['D', 6], ['M', 5], ['H', 5], ['G', 4], ['B', 3], ['F', 3],
    ['P', 3], ['K', 2], ['V', 2], ['W', 2], ['Y', 1], ['X', 1],
    ['Z', 1], ['J', 1], ['Q', 1]
];
const COMMON_DIGRAMS = new Set ([
    'TH','HT','CH','HC','SH','HS','ST','TS','ER','RE','IN','NI','AN','NA'
]);

async function load_dictionary(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`failed to load dictionary: ${response.status} ${response.statusText}`);
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('dictionary is not valid.');
    }

    if (data && typeof data === 'object' && !Array.isArray(data)) {
        const cleaned = new Set();
        for (let word of Object.keys(data)) {
            if (typeof word !== 'string') continue;
            if (should_be_included_in_set(word)) {
                cleaned.add(word.toUpperCase());
            }
        }
        return Array.from(cleaned);
    }
    throw new Error('failure during json parsing');
}
function should_be_included_in_set(word) {
    return above_minimum_length(word)
        && has_no_repeating_characters(word)
        && contains_vowels(word);
}
function above_minimum_length(word) {
    return word.length >= min_word_length;
}
function has_no_repeating_characters(word) {
    return !/(.)\1/.test(word);
}
function contains_vowels(word) {
    return /[aeiou]/i.test(word);
}

let allowed_words = [];
let cached_board_information = {};

// ---------------------------------------------------------------------------------------------------------------------    [GUI]

function connect_gameplay_buttons() {
    const reset_button = document.getElementById('reset_button');
    const enter_button = document.getElementById('enter_button');
    if (reset_button) reset_button.addEventListener('click', reset_word);
    if (enter_button) enter_button.addEventListener('click', enter_word);
}
connect_gameplay_buttons();

// ---------------------------------------------------------------------------------------------------------------------    [RANDOM GENERATION]

class random_seed {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }
}
function get_current_date_as_number() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return Number(`${year}${month}${day}`);
}

const seed = get_current_date_as_number();
const random_generation = new random_seed(seed);

console.log('seed for generation is', seed);

// ---------------------------------------------------------------------------------------------------------------------    [BOARD GENERATION]

let input_buttons = [];
let by_button = new Map();

function generate_letters() {
    let letters = [];
    const chosen = new Set();

    const number_of_vowels = random_generation.next() < 0.4 ? 4 : 3;
    while (letters.length < number_of_vowels) {
        const letter = pick_letter_based_on_weight(VOWELS, chosen);
        chosen.add(letter);
        letters.push(letter)
    }
    while (letters.length < total_letter_count) {
        const letter = pick_letter_based_on_weight(CONSONANTS, chosen);
        chosen.add(letter);
        letters.push(letter);
    }

    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(random_generation.next() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    let best_configuration = null;
    let best_score = Infinity;
    
    for (let attempt = 0; attempt < board_generation_attempt_limit; attempt++) {
        const arrangement = letters.slice();
        for (let i = arrangement.length - 1; i > 0; i--) {
            const j = Math.floor(random_generation.next() * (i + 1));
            [arrangement[i], arrangement[j]] = [arrangement[j], arrangement[i]];
        }
        const sides = [
            [arrangement[0], arrangement[1], arrangement[2]],
            [arrangement[3], arrangement[4], arrangement[5]],
            [arrangement[6], arrangement[7], arrangement[8]],
            [arrangement[9], arrangement[10], arrangement[11]],
        ];
        const arrangement_score = score_board_configuration(sides);
        if (arrangement_score < best_score) {
            best_score = arrangement_score;
            best_configuration = sides;
            if (arrangement_score === 0) break;
        }
    }
    return best_configuration;
}
function pick_letter_based_on_weight(pairs, current_set) {
    const filtered = pairs.filter(([letter]) => !current_set.has(letter));
    const total = filtered.reduce((s, [, w]) => s + w, 0);
    let r = random_generation.next() * total;
    for (const [letter, w] of filtered) {
        if ((r -= w) <= 0) return letter;
    }
    return filtered[filtered.length - 1][0];
}
function score_board_configuration(sides) {
    let score = 0;
    for (const side of sides) {
        for (let i = 0; i < side.length; i++) {
            for (let j = i + 1; j < side.length; j++) {
                const a = side[i], b = side[j];
                if (COMMON_DIGRAMS.has(a + b) || COMMON_DIGRAMS.has(b + a)) {
                    score += 1
                }
            }
        }
    }
    return score;
}
function generate_board_interface(board_info) {
    const container = document.getElementById('game_area');
    //container.innerHTML = '';

    const margin = 8;

    for (let side = 0; side < 4; side++) {
        const side_div = document.createElement('div');
        side_div.className = `side side-${side}`;
        container.appendChild(side_div);
    }

    const by_side = new Map([[0, []], [1, []], [2, []], [3, []]]);
    board_info.by_letter.forEach((value, letter) => {
        by_side.get(value.side).push({ letter, value });
    });
    for (let s = 0; s < 4; s++) {
        by_side.get(s).sort((a, b) => (a.value.index ?? 0) - (b.value.index ?? 0));
    }

    for (let side = 0; side < 4; side++) {
        const side_div = container.querySelector(`.side-${side}`);
        by_side.get(side).forEach(({ letter, value }) => {
            const button_to_add = document.createElement('button');
            button_to_add.id = `button-${value.reference}`;
            button_to_add.type = 'button';
            button_to_add.textContent = letter;
            button_to_add.className = 'board-button';
            button_to_add.addEventListener('click', function() {
                log_letter_press_attempt({ letter: letter, value: value, button: button_to_add });
            });
            side_div.appendChild(button_to_add);

            let reference = {button: button_to_add, submitted: false, selected: false, solved: false};
            input_buttons.push(reference);
            by_button.set(button_to_add, reference);
        });
    }
}
function generate_board_information(board) {
    const letters = board.flat();
    const letter_set = new Set(letters);
    
    const letter_index = new Map(letters.map((character, i) => [character, i]));
    const all_mask = (1 << letters.length) - 1;

    const by_letter = new Map();
    let reference_index = 0;
    for (let s = 0; s < 4; s++) {
        for (let i = 0; i < 3; i++) {
            const character = board[s][i];
            by_letter.set(character, { side: s, index: i, reference: reference_index });
            reference_index++;
        }
    }
    return { letters, letter_set: letter_set, letter_index: letter_index, all_mask: all_mask, by_letter: by_letter };
}
function is_word_valid_for_board(word, set_of_letters, by_letter) {
    for (const character of word) {
        if (!set_of_letters.has(character)) {
            return false;
        }
    }
    for (let i = 1; i < word.length; i++) {
        const a = by_letter.get(word[i - 1]);
        const b = by_letter.get(word[i]);
        if (!a || !b) return false;
        if (a.side === b.side) return false;
    }
    return true;
}
async function filter_word_based_on_generated_letters(valid_words, board_information) {
    const filtered_words = [];
    for (const validated_word of valid_words) {
        if (is_word_valid_for_board(validated_word, board_information.letter_set, board_information.by_letter)) {
            filtered_words.push(validated_word);
        }
    }
    return filtered_words;
}
function bitmask_for_word(word, letter_index) {
    let mask = 0;
    const seen = new Set();
    for (const character of word) {
        if (seen.has(character)) continue;
        seen.add(character);
        mask |= (1 << letter_index.get(character));
    }
    return mask;
}
function create_bitmask(letters) {
    let bitmask = 0;
    for (const letter of letters) {
        const index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
        bitmask |= (1 << index);
    }
    return bitmask;
}
function build_graph_edges(filtered_words, board_information) {
    const edges = new Map();
    for (const w of filtered_words) {
        const start = w[0];
        const end = w[w.length - 1];
        const entry = edges.get(start) || [];
        entry.push({ word: w, end, mask: bitmask_for_word(w, board_information.letter_index) });
        edges.set(start, entry);
    }
    return edges;
}
function shortest_chain_of_words_to_solve(edges, ALL_MASK) {
    const queue = [];
    const seen = new Set();
    for (const [start, list] of edges.entries()) {
        for (const edge of list) {
            const state = { last: edge.end, mask: edge.mask, path: [edge.word] };
            const key = `${state.last}|${state.mask}`;
            if (!seen.has(key)) {
                seen.add(key);
                queue.push(state);
            }
        }
    }
    while (queue.length) {
        const current_word = queue.shift();
        
        if (current_word.mask === ALL_MASK) {
            return current_word.path;
        }

        const next_list = edges.get(current_word.last) || [];
        
        for (const edge of next_list) {
            const next_mask = current_word.mask | edge.mask;
            const key = `${edge.end}|${next_mask}`;
            if (!seen.has(key)) {
                seen.add(key);
                queue.push({ last: edge.end, mask: next_mask, path: [...current_word.path, edge.word] });
            }
        }
    }
    return null;
}
async function generate_board_data() {
    let valid_words = await load_dictionary(`/dictionary/solution_words.json`);
    let generated_letters = generate_letters();
    let board_information = generate_board_information(generated_letters);
    let filtered_words = await filter_word_based_on_generated_letters(valid_words, board_information);
    
    if (filtered_words.length === 0) return { 
        solvable: false, solution: null 
    };
    
    let edges = build_graph_edges(filtered_words, board_information);
    let solution = shortest_chain_of_words_to_solve(edges, board_information.all_mask);
    let solvable = is_board_considered_viable(solution, filtered_words.length);
    
    if (solvable) {
        generate_board_interface(board_information);
        allowed_words = await load_dictionary(`/dictionary/allowable_words.json`);
        allowed_words = await filter_word_based_on_generated_letters(allowed_words, board_information);
        cached_board_information = board_information;
        console.log(`identified ${valid_words.length} valid solution words\nfiltered to ${filtered_words.length} solution words after board validation\nwith ${allowed_words.length} allowable input words`);
    }
    
    return { solvable: solvable, solution: solution };
}
function is_board_considered_viable(solution, allowed_common_words) {
    return !!solution 
        && allowed_common_words >= minimum_allowed_words
        && solution.length <= solution_length_limit;
}
let output = {};
while (!output.solvable) {
    output = await generate_board_data();
}
console.log('generated board shortest solution is:', output.solution);

// ---------------------------------------------------------------------------------------------------------------------    [INPUT MANAGEMENT]

let current_input_chain = [];
let current_word = { word: '', valid: false };
let historical_input_chain = [];
let current_word_chain = [];
let solved_state = false;

function log_letter_press_attempt(letter_information) {
    if (solved_state){
        return;
    }
    
    if (current_input_chain.length >= 1) {
        let last_input = current_input_chain.slice(-1)[0];
        if (letter_information.value.reference === last_input.value.reference) {
            if (current_word_chain.length >= 1 && current_input_chain.length === 1) {
                
                // todo pop the late word in current word chain
                //  clear current input chain
                //  add the letters in that word to the input chain
                
                console.log("[!]\t[", last_input.letter, "] cannot be removed because it is a forced letter");
            } else {
                console.log("[!]\t[", last_input.letter, "] was removed from the input chain");
                remove_letter_from_chain(letter_information);
            }
        }  else if (letter_information.value.side === last_input.value.side) {
            console.log("[!]\tnot allowed to add multiple letters from the same side in a row");
        } else {
            add_letter_to_chain(letter_information);
        }
    } else {
        add_letter_to_chain(letter_information);
    }
}

function generate_and_validate_input_thread(){
    current_word = { word: '', valid: false };

    current_input_chain.forEach(input => {
        current_word.word += input.letter;
    });

    current_word.valid = (allowed_words.includes(current_word.word) && !current_word_chain.includes(current_word.word));
    
    display_current_word();
    handle_button_state();
    //update_temporary_line();
    draw_polyline_for_chain(current_input_chain, 'chain-connector');
}
function add_letter_to_chain(letter_information){
    current_input_chain.push(letter_information);
    historical_input_chain.push(letter_information);

    set_selected(letter_information.button, true);
    generate_and_validate_input_thread();
}
function remove_letter_from_chain(letter_information){
    current_input_chain.pop();
    historical_input_chain.pop();

    set_selected(letter_information.button, false);
    generate_and_validate_input_thread();
}
function validate_if_board_is_satisfied(words, letters) {
    const all_mask = create_bitmask(letters);
    let combined_word_mask = 0;
    for (const word of words) {
        for (const char of word) {
            const index = char.charCodeAt(0) - 'A'.charCodeAt(0);
            combined_word_mask |= (1 << index);
        }
    }
    return (combined_word_mask & all_mask) === all_mask;
}

function enter_word() {
    if (solved_state){
        return;
    }
    
    if (current_word.valid){
        console.log("entered valid word [", current_word.word, "]")
        current_word_chain.push(current_word.word);

        freeze_chain_as_polyline(current_input_chain, 'board-connector--submitted')
        set_submitted_for_chain(current_input_chain);
        
        solved_state = validate_if_board_is_satisfied(current_word_chain, cached_board_information.letters);
        
        if (solved_state) {
            console.log("board has been solved");
            set_solved_for_all_letters();
            handle_button_state();
        } else {
            console.log("board is not solved");
            let last_input = current_input_chain.slice(-1)[0];
            current_input_chain = [];
            add_letter_to_chain(last_input);
        }
    } else {
        console.log("attempted to add invalid word [", current_word.word, "]")
    }
    
    display_word_history();
}
function reset_word() {
    location.reload();
}
// ---------------------------------------------------------------------------------------------------------------------    [GUI MANAGEMENT]
function set_selected(button, selected_state) {
    const state = by_button.get(button);
    if (state) {
        state.selected = !!selected_state
    }
}
function set_submitted_for_chain(input_chain) {
    for (const input_chain_item of input_chain) {
        const state = by_button.get(input_chain_item.button);
        if (state) {
            state.submitted = true;
            state.selected = false;
        }
    }
}
function set_solved_for_all_letters() {
    for (const [button, state] of by_button.entries()) {
        state.selected = false;
        state.submitted = false;
        state.solved = true;
    }
    console.log(by_button)
}
function display_current_word() {
    const container = document.getElementById('current_word');
    container.innerHTML = '';
    container.innerText = current_word.word;
}
function display_word_history(){
    const container = document.getElementById('history_word');
    container.innerHTML = '';
    current_word_chain.forEach(value => {
        container.innerText += `[${value}]`;
    })
}
function handle_button_state() {
    for (const input_button of input_buttons) {
        input_button.button.classList.remove(
            'board-button--submitted-and-selected',
            'board-button--selected',
            'board-button--submitted'
        );
        if (input_button.selected && input_button.submitted) {
            input_button.button.classList.add('board-button--submitted-and-selected');
        } else if (input_button.selected) {
            input_button.button.classList.add('board-button--selected');
        } else if (input_button.submitted) {
            input_button.button.classList.add('board-button--submitted');
        } else if (input_button.solved) {
            input_button.button.classList.add('board-button--solved');
        }
    }
}
// ---------------------------------------------------- [SVG CONNECTIONS]

function svg_element() {
    return document.getElementById('board_svg');
}
function generate_line_element(id = 'button-connector') {
    const svg = svg_element();
    let line = svg.querySelector(`#${id}`);
    if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.id = id;
        line.classList.add('board-connector');
        svg.appendChild(line);
    }
    return line;
}
function get_button_position(button) {
    const svg = svg_element();
    const svgRect = svg.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();

    const cx = btnRect.left + btnRect.width / 2 - svgRect.left;
    const cy = btnRect.top + btnRect.height / 2 - svgRect.top;
    return { x: cx, y: cy };
}

function drawLineBetweenButtons(button_a, button_b, id = 'button-connector') {
    if (!button_a || !button_b) return;

    const a = get_button_position(button_a);
    const b = get_button_position(button_b);

    const line = generate_line_element(id);
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
}

function remove_line(id = 'button-connector') {
    const svg = svg_element();
    const line = svg.querySelector(`#${id}`);
    if (line) line.remove();
}
/*function update_temporary_line() {
    if (current_input_chain.length >= 2) {
        const last = current_input_chain[current_input_chain.length - 1].button;
        const prev = current_input_chain[current_input_chain.length - 2].button;
        drawLineBetweenButtons(prev, last, 'temp-connector');
    } else {
        remove_line('temp-connector');
    }
}*/
function create_poly_line(id = 'chain-connector') {
    const svg = svg_element();
    let polyline = svg.querySelector(`#${id}`);
    if (!polyline) {
        polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.id = id;
        polyline.classList.add('board-connector');
        polyline.setAttribute('fill', 'none');
        svg.appendChild(polyline);
    }
    return polyline;
}
function draw_polyline_for_chain(chain, id = 'chain-connector') {
    if (!chain || chain.length < 2) {
        remove_line(id);
        return;
    }
    const points = chain.map(ci => {
        const p = get_button_position(ci.button);
        return `${p.x},${p.y}`;
    }).join(' ');
    const pl = create_poly_line(id);
    pl.setAttribute('points', points);
}
function freeze_chain_as_polyline(chain, cssClass = 'board-connector') {
    if (chain.length < 2) return;
    const svg = svg_element();
    const id = `word-connector-${current_word_chain.length}`; // unique
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.id = id;
    polyline.classList.add(cssClass);
    polyline.setAttribute('fill', 'none');
    const points = chain.map(ci => {
        const p = get_button_position(ci.button);
        return `${p.x},${p.y}`;
    }).join(' ');
    polyline.setAttribute('points', points);
    svg.appendChild(polyline);
}


