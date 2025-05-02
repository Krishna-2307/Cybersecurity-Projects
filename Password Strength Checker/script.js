document.getElementById("passwordInput").addEventListener("input", function () {
    const password = this.value;
    const strength = getStrengthInfo(password);
    const suggestions = getSuggestions(password);

    updateBar(strength);
    updateTimeToCrack(strength.entropy);
    showSuggestions(suggestions);
});


function getStrengthInfo(password) {
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

    if (poolSize === 0 || password.length === 0) {
        return { label: "Very Weak", percent: 0, entropy: 0 };
    }

    const entropy = password.length * Math.log2(poolSize);

    let label = "Very Weak";
    let percent = 20;
    if (entropy < 28) { label = "Very Weak"; percent = 20; }
    else if (entropy < 36) { label = "Weak"; percent = 40; }
    else if (entropy < 60) { label = "Moderate"; percent = 60; }
    else if (entropy < 75) { label = "Strong"; percent = 80; }
    else { label = "Very Strong"; percent = 100; }

    return { label, percent, entropy };
}


function updateBar(strength) {
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');

    if (strength.percent === 0) {
        fill.style.width = `0%`;
        label.style.display = "none";
        return;
    }

    fill.style.width = `${strength.percent}%`;
    label.style.display = "block";
    label.textContent = `Strength: ${strength.label}`;

    let color = "gray";
    if (strength.label === "Very Weak") color = "red";
    else if (strength.label === "Weak") color = "orangered";
    else if (strength.label === "Moderate") color = "orange";
    else if (strength.label === "Strong") color = "yellowgreen";
    else if (strength.label === "Very Strong") color = "green";

    fill.style.backgroundColor = color;
}


function getSuggestions(password) {
    let suggestions = [];
    if (!/[a-z]/.test(password)) suggestions.push("Add lowercase letters");
    if (!/[A-Z]/.test(password)) suggestions.push("Add uppercase letters");
    if (!/[0-9]/.test(password)) suggestions.push("Add numbers");
    if (!/[^A-Za-z0-9]/.test(password)) suggestions.push("Add special characters");
    if (password.length < 12) suggestions.push("Make it longer (at least 12 characters)");
    return suggestions;
}

function showSuggestions(suggestions) {
    const list = document.getElementById("suggestionsList");
    list.innerHTML = "";
    suggestions.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        list.appendChild(li);
    });
}

function updateTimeToCrack(entropy) {
    const guessesPerSecond = 1e9; // 1 billion guesses per second (modern GPU)
    const seconds = Math.pow(2, entropy) / guessesPerSecond;

    const display = document.getElementById("timeToCrack");
    if (entropy === 0) {
        display.style.display = "none";
        return;
    }

    display.style.display = "block";

    // If time to crack exceeds 20 years
    if (seconds > 31536000 * 20) {
        display.textContent = "Estimated time to crack: > 20 years";
    } else {
        display.textContent = `Estimated time to crack: ${formatTime(seconds)}`;
    }
}

function formatTime(seconds) {
    if (seconds < 1) return "< 1 second";
    const units = [
        { label: "year", value: 31536000 },
        { label: "day", value: 86400 },
        { label: "hour", value: 3600 },
        { label: "minute", value: 60 },
        { label: "second", value: 1 }
    ];

    for (let unit of units) {
        if (seconds >= unit.value) {
            const val = Math.floor(seconds / unit.value);
            return `${val} ${unit.label}${val > 1 ? 's' : ''}`;
        }
    }
    return "unknown";
}


function formatTime(seconds) {
    if (seconds < 1) return "< 1 second";
    const units = [
        { label: "year", value: 31536000 },
        { label: "day", value: 86400 },
        { label: "hour", value: 3600 },
        { label: "minute", value: 60 },
        { label: "second", value: 1 }
    ];

    for (let unit of units) {
        if (seconds >= unit.value) {
            const val = Math.floor(seconds / unit.value);
            return `${val} ${unit.label}${val > 1 ? 's' : ''}`;
        }
    }
    return "unknown";
}

