const output = document.getElementById("output");
const menu = document.getElementById("menu");
const cursorLine = document.getElementById("cursor-line");

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

function command(name) {
    const response = document.createElement("div");

    response.textContent = `> ${name}`;
    output.appendChild(response);

    if (name === "STATUS") {
        addText([
            "",
            "SYSTEM STATUS",
            "----------------------------------------",
            "CORE ................. ONLINE",
            "ARCHIVE .............. DEGRADED",
            "EXTERNAL LINK ........ UNKNOWN",
            "SECURITY ............. ACTIVE",
            "",
        ]);
    }

    if (name === "ARCHIVE") {
        addText([
            "",
            "ARCHIVE DIRECTORY",
            "----------------------------------------",
            "EXP-001",
            "EXP-002",
            "EXP-003",
            "EXP-004",
            "EXP-017",
            "[ACCESS RESTRICTED]",
            "",
        ]);
    }

    if (name === "REPORT") {
        addText([
            "",
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
        ]);
    }

    if (name === "PERSONNEL") {
        addText([
            "",
            "PERSONNEL DATABASE",
            "----------------------------------------",
            "DIRECTORY UNAVAILABLE.",
            "",
            "ERROR 403",
            "SECURITY CLEARANCE REQUIRED.",
            "",
        ]);
    }
}

function addText(lines) {
    lines.forEach(line => {
        const element = document.createElement("div");
        element.textContent = line;
        output.appendChild(element);
    });

    window.scrollTo(0, document.body.scrollHeight);
}

typeLine();