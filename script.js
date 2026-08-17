const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    button.addEventListener("click", function() {
        alert("YOU CLICKED: " + this.textContent);
    });
});