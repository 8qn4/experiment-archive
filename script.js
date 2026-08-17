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

function showResponse(command) {
    if (!bootFinished || commandRunning) {
        return;
    }

    commandRunning = true;

    menu.classList.add("hidden");
    cursorLine.classList.add("hidden");

    addLine("");
    addLine("> " + command);
    addLine("");

    if (command === "STATUS") {
        addLine("SYSTEM STATUS");
        addLine("----------------------------------------");
        addLine("CORE ................. ONLINE");
        addLine("ARCHIVE .............. DEGRADED");
        addLine("EXTERNAL LINK ........ UNKNOWN");
        addLine("SECURITY ............. ACTIVE");
    }

    if (command === "ARCHIVE") {
        addLine("ARCHIVE DIRECTORY");
        addLine("----------------------------------------");
        addLine("EXP-001");
        addLine("EXP-002");
        addLine("EXP-003");
        addLine("EXP-004");
        addLine("EXP-017");
        addLine("");
        addLine("[ACCESS RESTRICTED]");
    }

    if (command === "REPORT") {
        addLine("REPORT DATABASE");
        addLine("----------------------------------------");
        addLine("NO LOCAL REPORTS AVAILABLE.");
        addLine("");
        addLine("NOTICE:");
        addLine("REPORTS HAVE BEEN MOVED TO");
        addLine("THE EXTERNAL ARCHIVAL TERMINAL.");
        addLine("");
        addLine("REFERENCE: EXP-017");
    }

    if (command === "PERSONNEL") {
        addLine("PERSONNEL DATABASE");
        addLine("----------------------------------------");
        addLine("DIRECTORY UNAVAILABLE.");
        addLine("");
        addLine("ERROR 403");
        addLine("SECURITY CLEARANCE REQUIRED.");
    }

    addLine("");
    addLine("RETURNING TO MAIN MENU...");

    scrollToBottom();

    setTimeout(() => {
        commandRunning = false;
        menu.classList.remove("hidden");
        cursorLine.classList.remove("hidden");
        scrollToBottom();
    }, 1800);
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        showResponse(command);
    });
});

boot();