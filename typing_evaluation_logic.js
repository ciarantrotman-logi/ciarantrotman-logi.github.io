const inputElement = document.getElementById('input');
inputElement.addEventListener('input', onInputChange);
inputElement.addEventListener('focus', startListening);
document.addEventListener('DOMContentLoaded', function() {
    resetListeners();
});
function restartEvaluation(){
    resetListeners();
    submitted = true;
    window.location.href = 'typing_evaluation.html';
}
function start(){
    document.getElementById('introduction').style.display = "none";
    document.getElementById('input-area').style.display = "block";
}
function startListening() {
    listening = true;
}

let mackenziePhrases = [
    "my watch fell in the water",
    "prevailing wind from the east",
    "never too rich and never too thin",
    "breathing is difficult",
    "I can see the rings on Saturn",
    "physics and chemistry are hard",
    "my bank account is overdrawn",
    "elections bring out the best",
    "we are having spaghetti",
    "time to go shopping",
    "a problem with the engine",
    "elephants are afraid of mice",
    "my favorite place to visit",
    "three two one zero blast off",
    "my favorite subject is psychology",
    "circumstances are unacceptable",
    "watch out for low flying objects",
    "if at first you do not succeed",
    "please provide your date of birth",
    "we run the risk of failure",
    "prayer in schools offends some",
    "he is just like everyone else",
    "great disturbance in the force",
    "love means many things",
    "you must be getting old",
    "the world is a stage",
    "can I skate with sister today",
    "neither a borrower nor a lender be",
    "one heck of a question",
    "question that must be answered",
    "beware the ides of March",
    "double double toil and trouble",
    "the power of denial",
    "I agree with you",
    "do not say anything",
    "play it again Sam",
    "the force is with you",
    "you are not a jedi yet",
    "an offer you cannot refuse",
    "are you talking to me",
    "yes you are very smart",
    "all work and no play",
    "hair gel is very greasy",
    "Valium in the economy size",
    "the facts get in the way",
    "the dreamers of dreams",
    "did you have a good time",
    "space is a high priority",
    "you are a wonderful example",
    "do not squander your time",
    "do not drink too much",
    "take a coffee break",
    "popularity is desired by all",
    "the music is better than it sounds",
    "starlight and dewdrop",
    "the living is easy",
    "fish are jumping",
    "the cotton is high",
    "drove my chevy to the levee",
    "but the levee was dry",
    "I took the rover from the shop",
    "movie about a nutty professor",
    "come and see our new car",
    "coming up with killer sound bites",
    "I am going to a music lesson",
    "the opposing team is over there",
    "soon we will return from the city",
    "I am wearing a tie and a jacket",
    "the quick brown fox jumped",
    "all together in one big pile",
    "wear a crown with many jewels",
    "there will be some fog tonight",
    "I am allergic to bees and peanuts",
    "he is still on our team",
    "the dow jones index has risen",
    "my preferred treat is chocolate",
    "the king sends you to the tower",
    "we are subjects and must obey",
    "mom made her a turtleneck",
    "goldilocks and the three bears",
    "we went grocery shopping",
    "the assignment is due today",
    "what you see is what you get",
    "for your information only",
    "a quarter of a century",
    "the store will close at ten",
    "head shoulders knees and toes",
    "vanilla flavored ice cream",
    "frequently asked questions",
    "round robin scheduling",
    "information super highway",
    "my favorite web browser",
    "the laser printer is jammed",
    "all good boys deserve fudge",
    "the second largest country",
    "call for more details",
    "just in time for the party",
    "have a good weekend",
    "video camera with a zoom lens",
    "what a monkey sees a monkey will do",
    "that is very unfortunate",
    "the back yard of our house",
    "this is a very good idea",
    "reading week is just about here",
    "our fax number has changed",
    "thank you for your help",
    "no exchange without a bill",
    "the early bird gets the worm",
    "buckle up for safety",
    "this is too much to handle",
    "protect your environment",
    "world population is growing",
    "the library is closed today",
    "Mary had a little lamb",
    "teaching services will help",
    "we accept personal checks",
    "this is a non profit organization",
    "user friendly interface",
    "healthy food is good for you",
    "hands on experience with a job",
    "this watch is too expensive",
    "the postal service is very slow",
    "communicate through email",
    "the capital of our nation",
    "travel at the speed of light",
    "I do not fully agree with you",
    "gas bills are sent monthly",
    "earth quakes are predictable",
    "life is but a dream",
    "take it to the recycling depot",
    "sent this by registered mail",
    "fall is my favorite season",
    "a fox is a very smart animal",
    "the kids are very excited",
    "parking lot is full of trucks",
    "my bike has a flat tire",
    "do not walk too quickly",
    "a duck quacks to ask for food",
    "limited warranty of two years",
    "the four seasons will come",
    "the sun rises in the east",
    "it is very windy today",
    "do not worry about this",
    "dashing through the snow",
    "want to join us for lunch",
    "stay away from strangers",
    "accompanied by an adult",
    "see you later alligator",
    "make my day you sucker",
    "I can play much better now",
    "she wears too much makeup",
    "my bare face in the wind",
    "batman wears a cape",
    "I hate baking pies",
    "lydia wants to go home",
    "win first prize in the contest",
    "freud wrote of the ego",
    "I do not care if you do that",
    "always cover all the bases",
    "nobody cares anymore",
    "can we play cards tonight",
    "get rid of that immediately",
    "I watched blazing saddles",
    "the sum of the parts",
    "they love to yap about nothing",
    "peek out the window",
    "be home before midnight",
    "he played a pimp in that movie",
    "I skimmed through your proposal",
    "he was wearing a sweatshirt",
    "no more war no more bloodshed",
    "toss the ball around",
    "I will meet you at noon",
    "I want to hold your hand",
    "the children are playing",
    "superman never wore a mask",
    "I listen to the tape everyday",
    "he is shouting loudly",
    "correct your diction immediately",
    "seasoned golfers love the game",
    "he cooled off after she left",
    "my dog sheds his hair",
    "join us on the patio",
    "these cookies are so amazing",
    "I can still feel your presence",
    "the dog will bite you",
    "a most ridiculous thing",
    "where did you get that tie",
    "what a lovely red jacket",
    "do you like to shop on Sunday",
    "I spilled coffee on the carpet",
    "the largest of the five oceans",
    "shall we play a round of cards",
    "olympic athletes use drugs",
    "my mother makes good cookies",
    "do a good deed to someone",
    "quick there is someone knocking",
    "flashing red light means stop",
    "sprawling subdivisions are bad",
    "where did I leave my glasses",
    "on the way to the cottage",
    "a lot of chlorine in the water",
    "do not drink the water",
    "my car always breaks in the winter",
    "santa claus got stuck",
    "public transit is much faster",
    "zero in on the facts",
    "make up a few more phrases",
    "my fingers are very cold",
    "rain rain go away",
    "bad for the environment",
    "universities are too expensive",
    "the price of gas is high",
    "the winner of the race",
    "we drive on parkways",
    "we park in driveways",
    "go out for some pizza and beer",
    "effort is what it will take",
    "where can my little dog be",
    "if you were not so stupid",
    "not quite so smart as you think",
    "do you like to go camping",
    "this person is a disaster",
    "the imagination of the nation",
    "universally understood to be wrong",
    "listen to five hours of opera",
    "an occasional taste of chocolate",
    "victims deserve more redress",
    "the protesters blocked all traffic",
    "the acceptance speech was boring",
    "work hard to reach the summit",
    "a little encouragement is needed",
    "stiff penalty for staying out late",
    "the pen is mightier than the sword",
    "exceed the maximum speed limit",
    "in sharp contrast to your words",
    "this leather jacket is too warm",
    "consequences of a wrong turn",
    "this mission statement is baloney",
    "you will lose your voice",
    "every apple from every tree",
    "are you sure you want this",
    "the fourth edition was better",
    "this system of taxation",
    "beautiful paintings in the gallery",
    "a yard is almost as long as a meter",
    "we missed your birthday",
    "coalition governments never work",
    "destruction of the rain forest",
    "I like to play tennis",
    "acutely aware of her good looks",
    "you want to eat your cake",
    "machinery is too complicated",
    "a glance in the right direction",
    "I just cannot figure this out",
    "please follow the guidelines",
    "an airport is a very busy place",
    "mystery of the lost lagoon",
    "is there any indication of this",
    "the chamber makes important decisions",
    "this phenomenon will never occur",
    "obligations must be met first",
    "valid until the end of the year",
    "file all complaints in writing",
    "tickets are very expensive",
    "a picture is worth many words",
    "this camera takes nice photographs",
    "it looks like a shack",
    "the dog buried the bone",
    "the daring young man",
    "this equation is too complicated",
    "express delivery is very fast",
    "I will put on my glasses",
    "a touchdown in the last minute",
    "the treasury department is broke",
    "a good response to the question",
    "well connected with people",
    "the bathroom is good for reading",
    "the generation gap gets wider",
    "chemical spill took forever",
    "prepare for the exam in advance",
    "interesting observation was made",
    "bank transaction was not registered",
    "your etiquette needs some work",
    "we better investigate this",
    "stability of the nation",
    "house with new electrical panel",
    "our silver anniversary is coming",
    "the presidential suite is very busy",
    "the punishment should fit the crime",
    "sharp cheese keeps the mind sharp",
    "the registration period is over",
    "you have my sympathy",
    "the objective of the exercise",
    "historic meeting without a result",
    "very reluctant to enter",
    "good at addition and subtraction",
    "six daughters and seven sons",
    "a thoroughly disgusting thing to say",
    "sign the withdrawal slip",
    "relations are very strained",
    "the minimum amount of time",
    "a very traditional way to dress",
    "the aspirations of a nation",
    "medieval times were very hard",
    "a security force of eight thousand",
    "there are winners and losers",
    "the voters turfed him out",
    "pay off a mortgage for a house",
    "the collapse of the Roman empire",
    "did you see that spectacular explosion",
    "keep receipts for all your expenses",
    "the assault took six months",
    "get your priorities in order",
    "traveling requires a lot of fuel",
    "longer than a football field",
    "a good joke deserves a good laugh",
    "the union will go on strike",
    "never mix religion and politics",
    "interactions between men and women",
    "where did you get such a silly idea",
    "it should be sunny tomorrow",
    "a psychiatrist will help you",
    "you should visit to a doctor",
    "you must make an appointment",
    "the fax machine is broken",
    "players must know all the rules",
    "a dog is the best friend of a man",
    "would you like to come to my house",
    "February has an extra day",
    "do not feel too bad about it",
    "this library has many books",
    "construction makes traveling difficult",
    "he called seven times",
    "that is a very odd question",
    "a feeling of complete exasperation",
    "we must redouble our efforts",
    "no kissing in the library",
    "that agreement is rife with problems",
    "vote according to your conscience",
    "my favourite sport is racketball",
    "sad to hear that news",
    "the gun discharged by accident",
    "one of the poorest nations",
    "the algorithm is too complicated",
    "your presentation was inspiring",
    "that land is owned by the government",
    "burglars never leave their business card",
    "the fire blazed all weekend",
    "if diplomacy does not work",
    "please keep this confidential",
    "the rationale behind the decision",
    "the cat has a pleasant temperament",
    "our housekeeper does a thorough job",
    "her majesty visited our country",
    "these barracks are big enough",
    "sing the gospel and the blues",
    "he underwent triple bypass surgery",
    "the hopes of a new organization",
    "peering through a small hole",
    "rapidly running short on words",
    "it is difficult to concentrate",
    "give me one spoonful of coffee",
    "two or three cups of coffee",
    "just like it says on the can",
    "companies announce a merger",
    "electric cars need big fuel cells",
    "the plug does not fit the socket",
    "drugs should be avoided",
    "the most beautiful sunset",
    "we dine out on the weekends",
    "get aboard the ship is leaving",
    "the water was monitored daily",
    "he watched in astonishment",
    "a big scratch on the tabletop",
    "salesmen must make their monthly quota",
    "saving that child was an heroic effort",
    "granite is the hardest of all rocks",
    "bring the offenders to justice",
    "every Saturday he folds the laundry",
    "careless driving results in a fine",
    "microscopes make small things look big",
    "a coupon for a free sample",
    "fine but only in moderation",
    "a subject one can really enjoy",
    "important for political parties",
    "that sticker needs to be validated",
    "the fire raged for an entire month",
    "one never takes too many precautions",
    "we have enough witnesses",
    "labour unions know how to organize",
    "people blow their horn a lot",
    "a correction had to be published",
    "I like baroque and classical music",
    "the proprietor was unavailable",
    "be discreet about your meeting",
    "meet tomorrow in the lavatory",
    "suburbs are sprawling up everywhere",
    "shivering is one way to keep warm",
    "dolphins leap high out of the water",
    "try to enjoy your maternity leave",
    "the ventilation system is broken",
    "dinosaurs have been extinct for ages",
    "an inefficient way to heat a house",
    "the bus was very crowded",
    "an injustice is committed every day",
    "the coronation was very exciting",
    "look in the syllabus for the course",
    "rectangular objects have four sides",
    "prescription drugs require a note",
    "the insulation is not working",
    "nothing finer than discovering a treasure",
    "our life expectancy has increased",
    "the cream rises to the top",
    "the high waves will swamp us",
    "the treasurer must balance her books",
    "completely sold out of that",
    "the location of the crime",
    "the chancellor was very boring",
    "the accident scene is a shrine for fans",
    "a tumor is OK provided it is benign",
    "please take a bath this month",
    "rent is paid at the beginning of the month",
    "for murder you get a long prison sentence",
    "a much higher risk of getting cancer",
    "quit while you are ahead",
    "knee bone is connected to the thigh bone",
    "safe to walk the streets in the evening",
    "luckily my wallet was found",
    "one hour is allotted for questions",
    "so you think you deserve a raise",
    "they watched the entire movie",
    "good jobs for those with education",
    "jumping right out of the water",
    "the trains are always late",
    "sit at the front of the bus",
    "do you prefer a window seat",
    "the food at this restaurant",
    "Canada has ten provinces",
    "the elevator door appears to be stuck",
    "raindrops keep falling on my head",
    "spill coffee on the carpet",
    "an excellent way to communicate",
    "with each step forward",
    "faster than a speeding bullet",
    "wishful thinking is fine",
    "nothing wrong with his style",
    "arguing with the boss is futile",
    "taking the train is usually faster",
    "what goes up must come down",
    "be persistent to win a strike",
    "presidents drive expensive cars",
    "the stock exchange dipped",
    "why do you ask silly questions",
    "that is a very nasty cut",
    "what to do when the oil runs dry",
    "learn to walk before you run",
    "insurance is important for bad drivers",
    "traveling to conferences is fun",
    "do you get nervous when you speak",
    "pumping helps if the roads are slippery",
    "parking tickets can be challenged",
    "apartments are too expensive",
    "find a nearby parking spot",
    "gun powder must be handled with care",
    "just what the doctor ordered",
    "a rattle snake is very poisonous",
    "weeping willows are found near water",
    "I cannot believe I ate the whole thing",
    "the biggest hamburger I have ever seen",
    "gamblers eventually lose their shirts",
    "exercise is good for the mind",
    "irregular verbs are the hardest to learn",
    "they might find your comment offensive",
    "tell a lie and your nose will grow",
    "an enlarged nose suggests you are a liar",
    "lie detector tests never work",
    "do not lie in court or else",
    "most judges are very honest",
    "only an idiot would lie in court",
    "important news always seems to be late",
    "please try to be home before midnight",
    "if you come home late the doors are locked",
    "dormitory doors are locked at midnight",
    "staying up all night is a bad idea",
    "you are a capitalist pig",
    "motivational seminars make me sick",
    "questioning the wisdom of the courts",
    "rejection letters are discouraging",
    "the first time he tried to swim",
    "that referendum asked a silly question",
    "a steep learning curve in riding a unicycle",
    "a good stimulus deserves a good response",
    "everybody loses in custody battles",
    "put garbage in an abandoned mine",
    "employee recruitment takes a lot of effort",
    "experience is hard to come by",
    "everyone wants to win the lottery",
    "the picket line gives me the chills"
]
const terminations = ['.', '.', '!', '?'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let paragraphs = [
    {id: "warm-up", phrases: 3},
    {id: "practice", phrases: 6},
    {id: "evaluation", phrases: 24}
];

// let paragraphs = [
//   {id: "practice", phrases: 1},
//   {id: "evaluation", phrases: 1}
// ];

let phraseIndex = 0;
let phrases = [];

generateEvaluationPhrases();

function generateEvaluationPhrases(){
    paragraphs.forEach(paragraph =>{
        let div = document.createElement("div");
        let span = document.createElement("span");
        let id = 'phrase-' + paragraph.id;

        let evaluation = generateParagraph(paragraph.phrases);
        let content = {
            id: id,
            phrase: evaluation
        }

        phrases.push(content);

        span.className = 'typing-visualiser';
        span.id = id;
        span.innerText = evaluation;

        div.appendChild(span);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createElement("br"));
        document.getElementById('evaluation-area').appendChild(div);
    })
}

function choosePhrase() {
    currentPhrase = phrases[phraseIndex].phrase;
    visualiseCharacterValidity();
}

function generateParagraph(i){
    let generated = '';
    for (let j = 0; j < i; j++) {
        generated += sentenceCase(mackenziePhrases[getRandomInt(0, mackenziePhrases.length - 1)]);
        generated += terminations[getRandomInt(0, terminations.length - 1)];
        if (j < i - 1 ){
            generated += " ";
        }
    }
    return generated;
}

function sentenceCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let startTime;
let endTime;
let timeTaken;

let currentPhrase;
let currentInput = '';

let accuracy = 100;
let mistakes = 0;

let totalKeys = 0;
let totalCharacters = 0;

let wordsPerMinute = 0;
let charactersPerMinute = 0;

let correctedErrorCount = 0;
let deletedCharacterCount = 0;
let previousErrorCount = 0;

let typingEfficiency = 0;
let correctionEfficiency = 0;

let totalKeystrokeDuration = 0;
let totalKeystrokeSpacing = 0;
let totalKeyTransitionDuration = 0;

let durationMean = 0;
let spacingMean = 0;
let transitionMean = 0;

let durationVariance = 0;
let spacingVariance = 0;
let timingVariance = 0;

let listening = false;
let started = false;
let finished = false;

const millisecondsToSeconds = 1000.0;
const secondsToMinutes = 60.0;
const charactersToWords = 5.0;

function onInputChange() {
    if (listening && !started){
        startTime = new Date();
        started = true;
    }
    if (!finished)
    {
        if (currentInput !== currentPhrase.slice(0, currentInput.length)) {
            mistakes++;
            keyEvents[keyEvents.length - 2].correct = false;
        }
        currentInput = inputElement.value;
        calculatePerformance();
        visualiseCharacterValidity();
    }
    if (currentInput.length >= currentPhrase.length)
    {
        phraseIndex++;
        if (phraseIndex < paragraphs.length){
            calculatePerformance();
            parseMetrics();
            resetListeners();
            choosePhrase();
        }
        else {
            finished = true;
            proceed();
        }
    }
}

function proceed(){
    calculatePerformance();
    parseMetrics(true);
    submitted = true;
    window.location.href = 'subjective_evaluation.html';
}

function checkCapsLock(event){
    let capsLock = event.getModifierState && event.getModifierState('CapsLock');
    document.getElementById('caps-lock-warning').style.display
        = capsLock
        ? 'block'
        : 'none';
}

function calculatePerformance(){
    evaluateTypingPerformance();
    evaluateEfficiency();
    calculateVariance();
}

function resetListeners(){
    inputElement.value = '';
    currentInput = '';
    
    startTime = new Date();
    endTime = new Date();
    timeTaken = 0;

    accuracy = 100;
    mistakes = 0;

    keyEvents.length = 0;

    totalKeys = 0;
    totalCharacters = 0;

    wordsPerMinute = 0;
    charactersPerMinute = 0;

    correctedErrorCount = 0;
    deletedCharacterCount = 0;
    previousErrorCount = 0;

    typingEfficiency = 0;
    correctionEfficiency = 0;

    totalKeystrokeDuration = 0;
    totalKeystrokeSpacing = 0;
    totalKeyTransitionDuration = 0;

    durationMean = 0;
    spacingMean = 0;
    transitionMean = 0;

    durationVariance = 0;
    spacingVariance = 0;
    timingVariance = 0;
}


function visualiseCharacterValidity(){
    let visualiser = document.getElementById(phrases[phraseIndex].id);
    visualiser.textContent = null;
    currentPhrase.split('').forEach(char => {
        const charSpan = document.createElement('span');
        if (char === '\n') {
            charSpan.innerHTML = '<br>';
        } else {
            charSpan.textContent = char;
        }
        visualiser.appendChild(charSpan);
    })
    let referenceCharacter = inputElement.value.split('');
    let quoteSpanArray = visualiser.querySelectorAll('span');
    quoteSpanArray.forEach((char, index) => {
        let checkedCharacter = referenceCharacter[index]
        if (checkedCharacter == null) {
            resetCharacter(char);
            if (index === inputElement.value.length) {
                currentCharacter(char);
            }
            else {
                inactiveCharacter(char);
            }
        } else if (checkedCharacter === char.innerText) {
            correctCharacter(char);
        } else {
            incorrectCharacter(char);
        }
    })
}
function resetCharacter(char){
    char.classList.remove('correct-char');
    char.classList.remove('incorrect-char');
    char.classList.remove('current-char');
}
function currentCharacter(char){
    char.classList.add('current-char');
    char.classList.remove('inactive-char');
}
function inactiveCharacter(char){
    char.classList.remove('current-char');
    char.classList.add('inactive-char');
}
function correctCharacter(char){
    char.classList.add('correct-char');
    char.classList.remove('incorrect-char');
}
function incorrectCharacter(char){
    char.classList.add('incorrect-char');
    char.classList.remove('correct-char');
    char.classList.remove('current-char');
}

let keyEvents = [];

document.addEventListener('keydown', function(event) {
    checkCapsLock(event);
    inputElement.focus();
    let i = inputElement.value.length;
    inputElement.setSelectionRange(i, i);
    if (!finished){
        characterCheck(event);
        keydownAnalysis(event);
    }
});
function characterCheck(event){
    totalKeys++;
    if (event.key.length === 1) {
        totalCharacters++;
    }
    if (event.key === 'Backspace') {
        deletedCharacterCount++;
    }
}
function keydownAnalysis(event){
    if (event.key.length === 1){
        let previous = keyEvents[keyEvents.length-1];
        logKey(event, previous);
        spacing(previous);
        transition(previous);
    }
}
function logKey(event, previous){
    let target = currentPhrase.charAt(inputElement.value.length);
    keyEvents.push({
        keydown: event,
        keyup: null,
        target: target,
        correct: target === event.key,
        duration: 0,
        spacing: 0,
        transition: 0,
        previous: previous
    });
}
function spacing(previous){
    if (previous === undefined || 
        previous.previous === undefined){
        return;
    }
    previous.spacing = calculateSpacing(previous);
    totalKeystrokeSpacing += previous.spacing;
}
function transition(previous){
    if (previous === undefined || 
        previous.previous === undefined || 
        previous.previous.keyup === null){
        return;
    }
    previous.transition = calculateTransition(previous);
    totalKeyTransitionDuration += previous.transition;
}
document.addEventListener('keyup', function(event) {
    checkCapsLock(event);
    duration(event);
});
function duration(event){
    let active = keyEvents.filter(key => 
        (key.keyup === null) && 
        (key.keydown.code === event.code));
    active.forEach(key => {
        key.keyup = event;
        key.duration = calculateDuration(key);
        totalKeystrokeDuration += key.duration;
    });
}
function calculateDuration(event){
    return event.keyup.timeStamp - event.keydown.timeStamp;
}
function calculateSpacing(event){
    return event.keydown.timeStamp - event.previous.keydown.timeStamp;
}
function calculateTransition(event){
    return event.keydown.timeStamp - event.previous.keyup.timeStamp;
}
function calculateVariance() {
    calculateDurationVariance();
    calculateSpacingVariance();
    calculateTransitionVariance();
}
function calculateDurationVariance() {
    let sum = 0;
    keyEvents.forEach(key => {
        if(!isNaN(key.duration)) {
            let diff = (key.duration - durationMean);
            sum += (diff * diff);
        }
    })
    durationVariance = sum / (totalCharacters - 1);
}
function calculateSpacingVariance() {
    let sum = 0;
    keyEvents.forEach(key => {
        if (!isNaN(key.spacing)) {
            let diff = (key.spacing - spacingMean);
            sum += (diff * diff);
        }
    })
    spacingVariance = sum / (totalCharacters - 1);
}
function calculateTransitionVariance() {
    let sum = 0;
    keyEvents.forEach(key => {
        if(!isNaN(key.transition)) {
            let diff = (key.transition - transitionMean);
            sum += (diff * diff);
        }
    })
    timingVariance = sum / (totalCharacters - 1);
}
function evaluateEfficiency() {
    let typingInefficiency = (totalCharacters / currentInput.length) * 100.0;
    typingEfficiency = 100.0 - Math.abs((typingInefficiency) - 100.0);
    correctionEfficiency = (correctedErrorCount / deletedCharacterCount) * 100.0;
}
function evaluateTypingPerformance() {
    wordsPerMinute = Math.round(((currentInput.length / charactersToWords) / timeTaken) * secondsToMinutes);
    charactersPerMinute = Math.round((currentInput.length / timeTaken) * secondsToMinutes);
    accuracy = checkAccuracy(currentPhrase, currentInput);
}
function checkAccuracy(toReference, toCheck) {
    let errors = 0;
    for (let i = 0; i < toCheck.length; i++) {
        if (toReference[i] !== toCheck[i]) {
            errors++;
        }
    }
    if (errors < previousErrorCount) {
        correctedErrorCount++;
    }
    previousErrorCount = errors;
    return 100.0 - ((errors / toCheck.length) * 100.0);
}
setInterval(function() {
    if (!finished && started){
        endTime = new Date();
        timeTaken = ((endTime - startTime) / millisecondsToSeconds);
        durationMean = totalKeystrokeDuration / totalKeys;
        spacingMean = totalKeystrokeSpacing / totalKeys;
        transitionMean = totalKeyTransitionDuration / totalKeys;
    }
})
function parseMetrics(store = false){
    let metrics = [
        {id: 'target-phrase',               value: currentPhrase},
        {id: 'entered-phrase',              value: currentInput},
        {id: 'time-taken',                  value: timeTaken},
        {id: 'words-per-minute',            value: wordsPerMinute},
        {id: 'characters-per-minute',       value: charactersPerMinute},
        {id: 'total-characters-typed',      value: totalCharacters},
        {id: 'total-keys-pressed',          value: totalKeys},
        {id: 'corrected-error-count',       value: correctedErrorCount},
        {id: 'deleted-character-count',     value: deletedCharacterCount},
        {id: 'accuracy',                    value: accuracy},
        {id: 'typing-efficiency',           value: typingEfficiency},
        {id: 'correction-efficiency',       value: correctionEfficiency},
        {id: 'mean-keystroke-duration',     value: durationMean},
        {id: 'mean-keystroke-spacing',      value: spacingMean},
        {id: 'mean-key-transition',         value: transitionMean},
        {id: 'keystroke-duration-variance', value: durationVariance},
        {id: 'keystroke-spacing-variance',  value: spacingVariance},
        {id: 'key-transition-variance',     value: timingVariance}
    ]
    metrics.forEach(metric => {
        console.log(metric.id, ":", metric.value)
        if (store){
            sessionStorage.setItem(metric.id, metric.value);
        }
    })
}

let submitted = false;

window.addEventListener('beforeunload', function (event) {
    if (!submitted) {
        let warningMessage = 'Your data has not been submitted yet. Are you sure you want to leave?';
        event.returnValue = warningMessage;
        return warningMessage;
    }
});

choosePhrase();