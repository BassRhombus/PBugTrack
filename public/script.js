// Main application script
document.addEventListener("DOMContentLoaded", function() {
    // App state
    let allBugs = [];
    let caughtBugs = {};
    
    // DOM elements
    const tableBody = document.querySelector("#bug-table tbody");
    const searchInput = document.getElementById("searchInput");
    const clearButton = document.getElementById("clearSearch");
    const toggleSwitch = document.getElementById("checkbox");
    const themeLabel = document.querySelector(".theme-label");
    
    // Initialize the application
    initTheme();
    loadCaughtBugs();
    loadBugs();
    setupEventListeners();
    
    // Theme management
    function initTheme() {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            toggleSwitch.checked = true;
            themeLabel.textContent = "Light Mode";
        }
    }
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            themeLabel.textContent = "Light Mode";
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
            themeLabel.textContent = "Dark Mode";
        }
    }
    
    // Bug data management
    function loadCaughtBugs() {
        if (localStorage.getItem("caughtBugs")) {
            try {
                caughtBugs = JSON.parse(localStorage.getItem("caughtBugs"));
            } catch (e) {
                console.error("Error parsing caught bugs data:", e);
                localStorage.removeItem("caughtBugs");
            }
        }
    }
    
    function loadBugs() {
        fetch("bugs.json")
            .then(response => response.json())
            .then(bugs => {
                allBugs = bugs;
                displayBugs(bugs);
            })
            .catch(error => {
                console.error("Error fetching bugs:", error);
                displayBugs([]);
            });
    }
    
    // UI functions
    function displayBugs(bugs) {
        tableBody.innerHTML = "";
        
        bugs.forEach(bug => {
            const row = document.createElement("tr");
            
            // Add bug info cells
            [bug.name, bug.location, bug.igTime, bug.timeOfDay].forEach(text => {
                const cell = document.createElement("td");
                cell.textContent = text;
                row.appendChild(cell);
            });
            
            // Add caught checkbox cell
            const caughtCell = document.createElement("td");
            const label = document.createElement("label");
            label.className = "checkbox-container";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = !!caughtBugs[bug.name];
            
            checkbox.addEventListener("change", function() {
                if (this.checked) {
                    caughtBugs[bug.name] = true;
                } else {
                    delete caughtBugs[bug.name];
                }
                localStorage.setItem("caughtBugs", JSON.stringify(caughtBugs));
            });
            
            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            
            label.appendChild(checkbox);
            label.appendChild(checkmark);
            caughtCell.appendChild(label);
            row.appendChild(caughtCell);
            
            tableBody.appendChild(row);
        });
    }
    
    function searchBugs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filteredBugs = allBugs;
        
        if (searchTerm !== "") {
            const searchTerms = searchTerm.split(" ").filter(term => term.length > 0);
            filteredBugs = allBugs.filter(bug => {
                const bugData = `${bug.name} ${bug.location} ${bug.timeOfDay} ${bug.igTime}`.toLowerCase();
                return searchTerms.every(term => bugData.includes(term));
            });
        }
        
        displayBugs(filteredBugs);
        
        // Show/hide no results message
        const noResultsMsg = document.getElementById("no-results") || createNoResultsElement();
        if (filteredBugs.length === 0 && searchTerm !== "") {
            noResultsMsg.style.display = "block";
            noResultsMsg.textContent = `No bugs found matching "${searchInput.value}"`;
        } else {
            noResultsMsg.style.display = "none";
        }
    }
    
    function createNoResultsElement() {
        const noResults = document.createElement("div");
        noResults.id = "no-results";
        noResults.style.cssText = "text-align: center; padding: 20px; color: #666; display: none;";
        tableBody.parentNode.insertBefore(noResults, tableBody.nextSibling);
        return noResults;
    }
    
    // Event setup
    function setupEventListeners() {
        toggleSwitch.addEventListener("change", switchTheme);
        searchInput.addEventListener("input", searchBugs);
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            displayBugs(allBugs);
        });
    }
});

// Fix the reference error by defining displayBugs globally
window.onload = function() {
    console.log("Window fully loaded - final check");
};