const output = document.getElementById("output");
const menu = document.getElementById("menu");
const cursorLine = document.getElementById("cursor-line");
const terminal = document.querySelector(".terminal");
const buttons = document.querySelectorAll("button");
let bootFinished = false;
let commandRunning = false;

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
    if (command === "REPORT") {
        await typeLine("REPORT DATABASE");
        await typeLine("----------------------------------------");
        await typeLine("NO LOCAL REPORTS AVAILABLE.");
        await typeLine("");
        await typeLine("NOTICE:");
        await typeLine("REPORTS HAVE BEEN MOVED TO");
        await typeLine("THE EXTERNAL ARCHIVAL TERMINAL.");
        await typeLine("");
        await typeLine("REFERENCE: EXP-017");
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

    setTimeout(() => {
        commandRunning = false;
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
        scrollToBottom();
    }, 1800);
}

// --- HACKING MINIGAME ---

const WORD_POOL = ["ARCHIVE", "PROTOCOL", "SECURITY", "RESEARCH", "SPECIMEN", "DIRECTIVE"];
const MAX_ATTEMPTS = 4;
const FINAL_CODE = "NRA-ACCESS-9931";
const JUNK_CHARS = "!@#$%^&*()_+-=[]{}\\|;:,.<>/?~";

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
    const answer = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    const sameLength = WORD_POOL.filter(w => w.length === answer.length);
    while (sameLength.length < 6) {
        sameLength.push(sameLength[Math.floor(Math.random() * sameLength.length)]);
    }

    hackState = {
        answer,
        pool: sameLength,
        attemptsLeft: MAX_ATTEMPTS
    };

    renderHackScreen();
}

function renderHackScreen() {
    output.innerHTML = "";

    addLine("ROBCO-STYLE ARCHIVAL DECRYPTION");
    addLine("----------------------------------------");
    addLine(`ATTEMPTS REMAINING: ${hackState.attemptsLeft}`);
    addLine("");

    const wordsToPlace = [...hackState.pool];
    const grid = document.createElement("div");
    grid.id = "hack-grid";

    for (let row = 0; row < 12; row++) {
        const rowText = document.createElement("div");
        rowText.className = "hack-row";

        const addr = document.createElement("span");
        addr.className = "hack-addr";
        addr.textContent = "0x" + (row * 16).toString(16).padStart(4, "0").toUpperCase() + "  ";
        rowText.appendChild(addr);

        let charCount = 0;
        while (charCount < 40) {
            if (wordsToPlace.length > 0 && Math.random() < 0.3) {
                const word = wordsToPlace.splice(Math.floor(Math.random() * wordsToPlace.length), 1)[0];
                const wordSpan = document.createElement("span");
                wordSpan.className = "hack-word";
                wordSpan.textContent = word;
                wordSpan.addEventListener("click", () => guessWord(word));
                rowText.appendChild(wordSpan);
                rowText.appendChild(document.createTextNode(" "));
                charCount += word.length + 1;
            } else {
                const junk = randomJunk(Math.floor(Math.random() * 5) + 3);
                rowText.appendChild(document.createTextNode(junk + " "));
                charCount += junk.length + 1;
            }
        }
        grid.appendChild(rowText);
    }

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
    scrollToBottom();

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
        addLine("");
        addLine("DECRYPTION COMPLETE");
        addLine("----------------------------------------");
        addLine("ACCESS CODE: " + FINAL_CODE);
        addLine("");
        addLine("USE THIS CODE IN THE EXTERNAL ARCHIVAL TERMINAL.");
    } else {
        addLine("");
        addLine("TERMINAL LOCKED");
        addLine("----------------------------------------");
        addLine("TOO MANY FAILED ATTEMPTS.");
        addLine("REBOOT REQUIRED.");
    }

    hackState = null;
    scrollToBottom();

    setTimeout(() => {
        commandRunning = false;
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
        scrollToBottom();
    }, 3000);
}

// --- EVENT WIRING ---

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        showResponse(command);
    });
});

boot();