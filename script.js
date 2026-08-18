const output = document.getElementById("output");
const terminal = document.getElementById("terminal");
const promptRow = document.getElementById("prompt-row");
const input = document.getElementById("cmd-input");

let bootFinished = false;
let busy = false;
let solved = false;

const bootText = [
    "this terminal was left running.",
    "",
    "there's no menu. type what you want to do.",
    "type HELP if you're stuck.",
    ""
];

// --- helpers ---

function addLine(text, cls) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.textContent = text;
    output.appendChild(line);
}

async function typeLine(text, speed = 16, cls) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
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
        await typeLine(text, 18);
        await new Promise(resolve => setTimeout(resolve, 80));
    }
    bootFinished = true;
    promptRow.classList.remove("hidden");
    input.focus();
}

// --- content ---

const SECTIONS = {
    help: [
        "log",
        "personnel",
        "archive",
        "status",
        "clear",
        "",
        "that's what's here. the rest, you'll have to find yourself."
    ],
    log: [
        "no title. dated only by entry count.",
        "",
        "ENTRY 14 —",
        "she stopped signing them near the end. i think she knew",
        "someone else would end up reading this.",
        "",
        "ENTRY 22 —",
        "everything she locked, she keyed to her own badge —",
        "not the day. the first pair of numbers only.",
        "",
        "ENTRY 31 —",
        "if you find the archive fragment, don't read it aloud.",
        "she was specific about that. never said why."
    ],
    personnel: [
        "one file left un-purged. most of it didn't survive.",
        "",
        "NAME ..................... [REDACTED]",
        "ROLE ..................... [REDACTED]",
        "DOB ...................... 03.22",
        "BADGE ISSUED ............. 09.17",
        "LAST REVIEW .............. 11.05",
        "",
        "everything else: gone."
    ],
    archive: [
        "EXP-017 — fragment recovered. encoded. uncorrected.",
        "",
        "BQN BCXYYNM UXPPRWP JOCNA FNNT CQANN",
        "FQJC RB UNOC RB ORUNM DWMNA XENAFJCLQ",
        "MX WXC BYNJT CQRB WJVN",
        "",
        "that's all of it. make of it what you will."
    ],
    status: [
        "core .......... running, barely.",
        "everything else .......... quiet."
    ]
};

const DEAD_END_LINES = [
    "nothing.",
    "static.",
    "that means nothing here.",
    "the terminal doesn't answer that.",
    "...",
    "quiet."
];

// SHA-256 of the correct passphrase, uppercased. Kept hashed so it
// isn't sitting in the page source as plain text.
const TARGET_HASH = "e1ca2870940ef1e379931dca73c84b916c7db5c20a55d5694f68e18d95de7fc";
const FINAL_CODE = "NRA-ACCESS-9931";

async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// --- input handling ---

input.addEventListener("keydown", async event => {
    if (event.key !== "Enter") return;
    if (!bootFinished || busy) return;

    const raw = input.value.trim();
    if (!raw) return;

    busy = true;
    input.disabled = true;

    await typeLine("");
    await typeLine("> " + raw);
    await typeLine("");

    await handleCommand(raw);

    input.value = "";
    input.disabled = false;
    busy = false;
    scrollToBottom();
    if (bootFinished) input.focus();
});

async function handleCommand(raw) {
    const word = raw.toLowerCase();

    if (word === "clear") {
        output.innerHTML = "";
        return;
    }

    if (SECTIONS[word]) {
        for (const line of SECTIONS[word]) {
            await typeLine(line);
        }
        return;
    }

    if (solved) {
        await typeLine("it's already open.", 16, "dim");
        return;
    }

    const hash = await sha256Hex(raw.toUpperCase());
    if (hash === TARGET_HASH) {
        solved = true;
        await typeLine("...");
        await typeLine("");
        await typeLine("it unlocks.");
        await typeLine("");
        await typeLine("ACCESS CODE: " + FINAL_CODE);
        await typeLine("");
        await typeLine("use it wherever it was you were meant to use it.", 16, "dim");
        return;
    }

    const filler = DEAD_END_LINES[Math.floor(Math.random() * DEAD_END_LINES.length)];
    await typeLine(filler, 16, "dim");
}

boot();