const output = document.getElementById("output");
const menu = document.getElementById("menu");
const cursorLine = document.getElementById("cursor-line");
const terminal = document.querySelector(".terminal");
const buttons = document.querySelectorAll("button");
let bootFinished = false;
let commandRunning = false;

// tracks progress through the ARG chain
let decryptionKey = null;   // set once DECRYPT is solved
let reportSubmitted = false; // set once the correct key is submitted in REPORT

const bootText = [
    "NORTHERN RESEARCH AUTHORITY",
    "ARCHIVAL COMPUTING SYSTEM",
    "",
    "INITIALIZING...",
    "",
    "MEMORY CHECK ............ OK",
    "SYSTEM CHECK ............ OK",
    "ARCHIVE CHECK ........... WARNING",
    "",
    "----------------------------------------",
    "ARCHIVAL TERMINAL // UNIT 04",
    "----------------------------------------",
    "",
    "SECURITY PROTOCOL: ACTIVE",
    "USER AUTHENTICATION: REQUIRED",
    "",
    "WELCOME, AUTHORIZED PERSONNEL.",
    ""
];

function addLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);
}

async function typeLine(text, speed = 18) {
    const line = document.createElement("div");
    output.appendChild(line);
    for (const character of text) {
        line.textContent += character;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    scrollToBottom();
}

function scrollToBottom() {
    terminal.scrollTop = terminal.scrollHeight;
}

async function boot() {
    for (const text of bootText) {
        const line = document.createElement("div");
        output.appendChild(line);
        for (const character of text) {
            line.textContent += character;
            await new Promise(resolve => setTimeout(resolve, 18));
        }
        await new Promise(resolve => setTimeout(resolve, 60));
        scrollToBottom();
    }
    bootFinished = true;
    menu.classList.remove("hidden");
    cursorLine.classList.remove("hidden");
}

function returnToMenu(delay = 1800) {
    setTimeout(() => {
        commandRunning = false;
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
        scrollToBottom();
    }, delay);
}

async function showResponse(command) {
    if (!bootFinished || commandRunning) {
        return;
    }
    commandRunning = true;
    menu.classList.add("hidden");
    cursorLine.classList.add("hidden");

    if (command === "DECRYPT") {
        startHack();
        return; // finishHack() handles returning to the main menu
    }

    if (command === "REPORT") {
        await runReportFlow();
        return; // runReportFlow() handles returning to the main menu
    }

    await typeLine("");
    await typeLine("> " + command);
    await typeLine("");

    if (command === "STATUS") {
        await typeLine("SYSTEM STATUS");
        await typeLine("----------------------------------------");
        await typeLine("CORE ................. ONLINE");
        await typeLine("ARCHIVE .............. DEGRADED");
        await typeLine("EXTERNAL LINK ........ UNKNOWN");
        await typeLine("SECURITY ............. ACTIVE");
    }
    if (command === "ARCHIVE") {
        await typeLine("ARCHIVE DIRECTORY");
        await typeLine("----------------------------------------");
        await typeLine("EXP-001");
        await typeLine("EXP-002");
        await typeLine("EXP-003");
        await typeLine("EXP-004");
        await typeLine("EXP-017");
        await typeLine("");
        await typeLine("[ACCESS RESTRICTED]");
    }
    if (command === "PERSONNEL") {
        await typeLine("PERSONNEL DATABASE");
        await typeLine("----------------------------------------");
        await typeLine("DIRECTORY UNAVAILABLE.");
        await typeLine("");
        await typeLine("ERROR 403");
        await typeLine("SECURITY CLEARANCE REQUIRED.");
    }

    await typeLine("");
    await typeLine("RETURNING TO MAIN MENU...");
    returnToMenu();
}

// --- HACKING MINIGAME ---

// Longer words + more decoys + fewer attempts = harder than before
const WORD_POOL = [
    "SPECIMEN", "DIRECTIVE", "CONTAINED", "RESEARCH",
    "PROTOCOL", "SUBLEVEL", "QUARANTINE", "FACILITY",
    "CLEARANCE", "OVERWATCH"
];
const MAX_ATTEMPTS = 3;
const JUNK_CHARS = "!@#$%^&*_+-=|;:,.<>/?~";
const BRACKET_PAIRS = ["()", "[]", "<>", "{}"];

let hackState = null;

function randomJunk(length) {
    let s = "";
    for (let i = 0; i < length; i++) {
        s += JUNK_CHARS[Math.floor(Math.random() * JUNK_CHARS.length)];
    }
    return s;
}

function likeness(guess, answer) {
    let count = 0;
    for (let i = 0; i < answer.length; i++) {
        if (guess[i] === answer[i]) count++;
    }
    return count;
}

function startHack() {
    // pick an answer, then find every other word of the exact same length as decoys
    const byLength = {};
    WORD_POOL.forEach(w => {
        byLength[w.length] = byLength[w.length] || [];
        byLength[w.length].push(w);
    });
    const validLengths = Object.keys(byLength).filter(len => byLength[len].length >= 4);
    const chosenLength = validLengths[Math.floor(Math.random() * validLengths.length)];
    const candidates = byLength[chosenLength];
    const answer = candidates[Math.floor(Math.random() * candidates.length)];

    hackState = {
        answer,
        pool: [...candidates],
        attemptsLeft: MAX_ATTEMPTS,
        dudsAvailable: 2 // clicking a bracket pair removes a wrong word, doesn't cost an attempt
    };

    renderHackScreen();
}

function renderHackScreen() {
    output.innerHTML = "";

    addLine("ROBCO-STYLE ARCHIVAL DECRYPTION");
    addLine("----------------------------------------");
    addLine(`ATTEMPTS REMAINING: ${hackState.attemptsLeft}`);
    addLine("TIP: MATCHING BRACKET PAIRS REMOVE A DUD ENTRY");
    addLine("");

    buildHackGrid();
}

function buildHackGrid() {
    const existingGrid = document.getElementById("hack-grid");
    if (existingGrid) existingGrid.remove();

    const wordsToPlace = [...hackState.pool];
    const grid = document.createElement("div");
    grid.id = "hack-grid";

    const rowCount = 14;
    const bracketRows = new Set();
    while (bracketRows.size < hackState.dudsAvailable && bracketRows.size < rowCount) {
        bracketRows.add(Math.floor(Math.random() * rowCount));
    }

    for (let row = 0; row < rowCount; row++) {
        const rowText = document.createElement("div");
        rowText.className = "hack-row";

        const addr = document.createElement("span");
        addr.className = "hack-addr";
        addr.textContent = "0x" + (row * 16).toString(16).padStart(4, "0").toUpperCase() + "  ";
        rowText.appendChild(addr);

        let charCount = 0;
        let bracketPlaced = false;

        while (charCount < 44) {
            if (wordsToPlace.length > 0 && Math.random() < 0.28) {
                const word = wordsToPlace.splice(Math.floor(Math.random() * wordsToPlace.length), 1)[0];
                const wordSpan = document.createElement("span");
                wordSpan.className = "hack-word";
                wordSpan.textContent = word;
                wordSpan.addEventListener("click", () => guessWord(word));
                rowText.appendChild(wordSpan);
                rowText.appendChild(document.createTextNode(" "));
                charCount += word.length + 1;
            } else if (bracketRows.has(row) && !bracketPlaced && Math.random() < 0.3) {
                const pair = BRACKET_PAIRS[Math.floor(Math.random() * BRACKET_PAIRS.length)];
                const bracketSpan = document.createElement("span");
                bracketSpan.className = "hack-bracket";
                bracketSpan.textContent = pair;
                bracketSpan.addEventListener("click", () => removeDud(bracketSpan));
                rowText.appendChild(bracketSpan);
                rowText.appendChild(document.createTextNode(" "));
                charCount += pair.length + 1;
                bracketPlaced = true;
            } else {
                const junk = randomJunk(Math.floor(Math.random() * 5) + 3);
                rowText.appendChild(document.createTextNode(junk + " "));
                charCount += junk.length + 1;
            }
        }
        grid.appendChild(rowText);
    }

    // make sure every word actually made it onto the grid somewhere
    wordsToPlace.forEach(word => {
        const rows = grid.querySelectorAll(".hack-row");
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const wordSpan = document.createElement("span");
        wordSpan.className = "hack-word";
        wordSpan.textContent = word;
        wordSpan.addEventListener("click", () => guessWord(word));
        randomRow.appendChild(document.createTextNode(" "));
        randomRow.appendChild(wordSpan);
    });

    output.appendChild(grid);
    scrollToBottom();
}

function removeDud(bracketSpan) {
    if (!hackState || hackState.dudsAvailable <= 0) return;

    const wrongWords = hackState.pool.filter(w => w !== hackState.answer);
    if (wrongWords.length === 0) return;

    const removed = wrongWords[Math.floor(Math.random() * wrongWords.length)];
    hackState.pool = hackState.pool.filter(w => w !== removed);
    hackState.dudsAvailable--;

    bracketSpan.classList.add("hack-bracket-used");
    bracketSpan.replaceWith(document.createTextNode("[USED]"));

    const feedback = document.createElement("div");
    feedback.className = "hack-feedback";
    feedback.textContent = `DUD REMOVED > "${removed}" PURGED FROM POOL`;
    output.appendChild(feedback);
    scrollToBottom();

    buildHackGrid();
}

function guessWord(word) {
    if (!hackState) return;

    if (word === hackState.answer) {
        finishHack(true);
        return;
    }

    hackState.attemptsLeft--;

    if (hackState.attemptsLeft <= 0) {
        finishHack(false);
        return;
    }

    const score = likeness(word, hackState.answer);
    const feedback = document.createElement("div");
    feedback.className = "hack-feedback";
    feedback.textContent = `ENTRY DENIED > LIKENESS=${score}/${hackState.answer.length}`;
    output.appendChild(feedback);

    const attemptsLine = document.createElement("div");
    attemptsLine.className = "hack-feedback";
    attemptsLine.textContent = `ATTEMPTS REMAINING: ${hackState.attemptsLeft}`;
    output.appendChild(attemptsLine);
    scrollToBottom();
}

function finishHack(success) {
    const grid = document.getElementById("hack-grid");
    if (grid) grid.remove();

    if (success) {
        decryptionKey = hackState.answer;
        addLine("");
        addLine("DECRYPTION COMPLETE");
        addLine("----------------------------------------");
        addLine("DECRYPTION KEY: " + decryptionKey);
        addLine("");
        addLine("SUBMIT THIS KEY VIA [ REPORT DATABASE ]");
    } else {
        addLine("");
        addLine("TERMINAL LOCKED");
        addLine("----------------------------------------");
        addLine("TOO MANY FAILED ATTEMPTS.");
        addLine("REBOOT REQUIRED.");
    }

    hackState = null;
    scrollToBottom();
    returnToMenu(3000);
}

// --- REPORT SUBMISSION FLOW ---

const FINAL_CODE = "NRA-ACCESS-9931";

async function runReportFlow() {
    if (reportSubmitted) {
        await typeLine("");
        await typeLine("> REPORT");
        await typeLine("");
        await typeLine("REPORT ALREADY SUBMITTED.");
        await typeLine("ACCESS CODE: " + FINAL_CODE);
        await typeLine("");
        await typeLine("RETURNING TO MAIN MENU...");
        returnToMenu();
        return;
    }

    await typeLine("");
    await typeLine("> REPORT");
    await typeLine("");
    await typeLine("REPORT DATABASE");
    await typeLine("----------------------------------------");

    if (!decryptionKey) {
        await typeLine("NO LOCAL REPORTS AVAILABLE.");
        await typeLine("");
        await typeLine("NOTICE:");
        await typeLine("A DECRYPTION KEY IS REQUIRED TO FILE A REPORT.");
        await typeLine("USE [ DECRYPT ] TO OBTAIN ONE.");
        await typeLine("");
        await typeLine("REFERENCE: EXP-017");
        await typeLine("");
        await typeLine("RETURNING TO MAIN MENU...");
        returnToMenu();
        return;
    }

    await typeLine("ENTER DECRYPTION KEY TO FILE REPORT:");
    scrollToBottom();

    const submitted = await promptForKey();

    if (submitted.toUpperCase() === decryptionKey) {
        reportSubmitted = true;
        await typeLine("");
        await typeLine("VALIDATING...");
        await typeLine("");
        await typeLine("REPORT SUBMITTED!");
        await typeLine("----------------------------------------");
        await typeLine("ACCESS CODE: " + FINAL_CODE);
        await typeLine("");
        await typeLine("USE THIS CODE IN THE EXTERNAL ARCHIVAL TERMINAL.");
    } else {
        await typeLine("");
        await typeLine("KEY REJECTED.");
        await typeLine("REPORT NOT FILED.");
    }

    await typeLine("");
    await typeLine("RETURNING TO MAIN MENU...");
    returnToMenu();
}

function promptForKey() {
    return new Promise(resolve => {
        const wrapper = document.createElement("div");
        wrapper.className = "report-input-row";

        const prompt = document.createElement("span");
        prompt.textContent = "> ";
        wrapper.appendChild(prompt);

        const input = document.createElement("input");
        input.type = "text";
        input.className = "report-input";
        input.autocomplete = "off";
        input.spellcheck = false;
        wrapper.appendChild(input);

        output.appendChild(wrapper);
        scrollToBottom();
        input.focus();

        function submit() {
            const value = input.value.trim();
            wrapper.remove();
            resolve(value);
        }

        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                submit();
            }
        });

        // allow tapping away from the field to still submit on mobile
        input.addEventListener("blur", () => {
            if (document.body.contains(wrapper)) {
                submit();
            }
        });
    });
}

// --- EVENT WIRING ---

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        showResponse(command);
    });
});

boot();