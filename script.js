const output = document.getElementById("output");
const menu = document.getElementById("menu");
const cursorLine = document.getElementById("cursor-line");
const terminal = document.querySelector(".terminal");

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

let index = 0;
let locked = false;

function typeLine() {
    if (index >= bootText.length) {
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
        return;
    }

    const line = document.createElement("div");
    output.appendChild(line);

    const text = bootText[index];
    let character = 0;

    const interval = setInterval(() => {
        line.textContent += text[character];
        character++;

        if (character >= text.length) {
            clearInterval(interval);
            index++;
            setTimeout(typeLine, 60);
        }
    }, 18);
}

function addText(lines) {
    lines.forEach(text => {
        const element = document.createElement("div");
        element.textContent = text;
        output.appendChild(element);
    });

    terminal.scrollTop = terminal.scrollHeight;
}

function command(name) {
    if (locked) {
        return;
    }

    locked = true;

    addText([
        "",
        "> " + name,
        ""
    ]);

    menu.classList.add("hidden");
    cursorLine.classList.add("hidden");

    if (name === "STATUS") {
        addText([
            "SYSTEM STATUS",
            "----------------------------------------",
            "CORE ................. ONLINE",
            "ARCHIVE .............. DEGRADED",
            "EXTERNAL LINK ........ UNKNOWN",
            "SECURITY ............. ACTIVE",
            "",
            "RETURNING TO MAIN MENU..."
        ]);
    }

    else if (name === "ARCHIVE") {
        addText([
            "ARCHIVE DIRECTORY",
            "----------------------------------------",
            "EXP-001",
            "EXP-002",
            "EXP-003",
            "EXP-004",
            "EXP-017",
            "",
            "[ACCESS RESTRICTED]",
            "",
            "RETURNING TO MAIN MENU..."
        ]);
    }

    else if (name === "REPORT") {
        addText([
            "REPORT DATABASE",
            "----------------------------------------",
            "NO LOCAL REPORTS AVAILABLE.",
            "",
            "NOTICE:",
            "REPORTS HAVE BEEN MOVED TO",
            "THE EXTERNAL ARCHIVAL TERMINAL.",
            "",
            "REFERENCE: EXP-017",
            "",
            "RETURNING TO MAIN MENU..."
        ]);
    }

    else if (name === "PERSONNEL") {
        addText([
            "PERSONNEL DATABASE",
            "----------------------------------------",
            "DIRECTORY UNAVAILABLE.",
            "",
            "ERROR 403",
            "SECURITY CLEARANCE REQUIRED.",
            "",
            "RETURNING TO MAIN MENU..."
        ]);
    }

    setTimeout(() => {
        locked = false;
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
    }, 1800);
}

typeLine();