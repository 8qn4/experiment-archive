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

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const command = button.dataset.command;
        showResponse(command);
    });
});

boot();