// Define creatures with default values
const creatures = {
    goblin: { name: "Goblin", defaultHP: 10, defaultAC: 15 },
    skeleton: { name: "Skeleton", defaultHP: 8, defaultAC: 15 },
    giantBoar: { name: "Giant Boar", defaultHP: 15, defaultAC: 15 },
    wizard: { name: "Wizard", defaultHP: 12, defaultAC: 15 }
};

// Load the creature panel and generate creatures dynamically
function loadCreaturePanel() {
    const creaturePanel = document.getElementById("creaturePanel");
    for (let id in creatures) {
        const creature = creatures[id];
        creaturePanel.innerHTML += `
            <div class="creature" id="${id}">
                ${creature.name}<br>
                HP: <input type="number" id="${id}Health" value="${creature.defaultHP}"><br>
                AC: <input type="number" id="${id}AC" value="${creature.defaultAC}"><br>
                <button draggable="true" ondragstart="drag(event)" data-id="${id}">Drag ${creature.name}</button>
            </div>
        `;
    }
}

// Allow the drop event to happen
function allowDrop(event) {
    event.preventDefault();
}

// Capture the id of the creature being dragged
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.getAttribute("data-id"));
}

// Handle the drop event and place the dragged creature onto the battle stage
function drop(event) {
    event.preventDefault();
    const creatureId = event.dataTransfer.getData("text/plain");

    // Get health and AC from the input fields
    const health = document.getElementById(creatureId + "Health").value;
    const ac = document.getElementById(creatureId + "AC").value;

    // Create a new creature element with controls
    const creatureElement = document.createElement("div");
    creatureElement.classList.add("battle-creature");
    creatureElement.innerHTML = `
        <div>
            ${capitalize(creatureId)}<br>
            HP: <span class="health">${health}</span><br>
            AC: <span class="ac">${ac}</span>
        </div>
    `;

    // Add controls for health management
    const controls = document.createElement("div");
    const increaseButton = document.createElement("button");
    increaseButton.innerText = "+";
    increaseButton.onclick = () => updateHealth(creatureElement, 1);

    const decreaseButton = document.createElement("button");
    decreaseButton.innerText = "-";
    decreaseButton.onclick = () => updateHealth(creatureElement, -1);

    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.onclick = () => removeCreature(creatureElement);

    controls.appendChild(increaseButton);
    controls.appendChild(decreaseButton);
    controls.appendChild(removeButton);
    creatureElement.appendChild(controls);

    // Add the creature to the battle stage
    document.getElementById("battleStage").appendChild(creatureElement);

    // Save creature state in localStorage
    saveCreatureState();
}

// Update health of a creature
function updateHealth(creatureElement, amount) {
    const healthSpan = creatureElement.querySelector(".health");
    let currentHealth = parseInt(healthSpan.innerText);
    currentHealth += amount;

    if (currentHealth <= 0) {
        removeCreature(creatureElement);
    } else {
        healthSpan.innerText = currentHealth;
        saveCreatureState();
    }
}

// Remove a creature from the battle stage
function removeCreature(creatureElement) {
    creatureElement.remove();
    saveCreatureState();
}

// Save the current state of the battle stage to localStorage
function saveCreatureState() {
    const battleStage = document.getElementById("battleStage");
    const creatures = battleStage.querySelectorAll(".battle-creature");

    const creatureData = [];
    creatures.forEach(creature => {
        const id = creature.getAttribute("id");
        const health = creature.querySelector(".health").innerText;
        const ac = creature.querySelector(".ac").innerText;
        creatureData.push({ id, health, ac });
    });

    localStorage.setItem("creatureData", JSON.stringify(creatureData));
}

// Load the saved state from localStorage
function loadSavedState() {
    const creatureData = JSON.parse(localStorage.getItem("creatureData"));
    if (creatureData) {
        creatureData.forEach(data => {
            const creatureElement = document.createElement("div");
            creatureElement.classList.add("battle-creature");
            creatureElement.innerHTML = `
                <div>
                    ${capitalize(data.id)}<br>
                    HP: <span class="health">${data.health}</span><br>
                    AC: <span class="ac">${data.ac}</span>
                </div>
            `;

            // Add controls
            const controls = document.createElement("div");
            const increaseButton = document.createElement("button");
            increaseButton.innerText = "+";
            increaseButton.onclick = () => updateHealth(creatureElement, 1);

            const decreaseButton = document.createElement("button");
            decreaseButton.innerText = "-";
            decreaseButton.onclick = () => updateHealth(creatureElement, -1);

            const removeButton = document.createElement("button");
            removeButton.innerText = "Remove";
            removeButton.onclick = () => removeCreature(creatureElement);

            controls.appendChild(increaseButton);
            controls.appendChild(decreaseButton);
            controls.appendChild(removeButton);
            creatureElement.appendChild(controls);

            document.getElementById("battleStage").appendChild(creatureElement);
        });
    }
}

// Helper function to capitalize creature names
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initiative sorting function
function sortInitiative() {
    const initiativeData = [
        { name: "Angel", value: parseInt(document.getElementById("initiativeAngel").value) },
        { name: "Naly", value: parseInt(document.getElementById("initiativeNaly").value) },
        { name: "JD", value: parseInt(document.getElementById("initiativeJD").value) },
        { name: "Roxy", value: parseInt(document.getElementById("initiativeRoxy").value) },
        { name: "Creatures", value: parseInt(document.getElementById("initiativeCreatures").value) }
    ];

    // Sort by initiative (highest to lowest)
    initiativeData.sort((a, b) => b.value - a.value);

    // Update the order of initiative on the UI
    const initiativeOrderList = document.getElementById("initiativeOrder");
    initiativeOrderList.innerHTML = ''; // Clear current list

    initiativeData.forEach(entry => {
        if (!isNaN(entry.value)) { // Check if the input is a number
            const listItem = document.createElement("li");
            listItem.innerText = `${entry.name}: ${entry.value}`;
            initiativeOrderList.appendChild(listItem);
        }
    });
}

// Initialize creature panel and load saved state on page load
window.onload = function () {
    loadCreaturePanel();
    loadSavedState();
}
``
