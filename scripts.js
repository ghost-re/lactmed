// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
// Function to get the value of a cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}
// Get the theme toggle button element
var themeToggle = document.getElementById('theme-toggle');
// Read the theme state from the cookie and apply it
var themeState = getCookie('themeState');
if (themeState === 'dark') {
    document.body.classList.add('dark-theme');
}
// Add event listener to the theme toggle button
themeToggle.addEventListener('click', function() {
    // Toggle the dark-theme class on the body element
    document.body.classList.toggle('dark-theme');
    // Get the current theme state
    var currentThemeState = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    // Save the theme state in a cookie with a 1-year expiration
    setCookie('themeState', currentThemeState, 365);
});
// Function to load JSON data using fetch API
async function loadJSON() {
    try {
        const response = await fetch('pregnancyAndLactation.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON file:', error);
        return null;
    }
}
// Function to populate the dropdown with keys from JSON
function populateDropdown(data) {
    const select = document.getElementById('keySelect');
    select.innerHTML = ''; // Clear previous options
    for (const key in data) {
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        select.add(option);
    }
}

function displayContent(data, key) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content
    const items = data[key];
    if (Array.isArray(items)) {
        items.forEach(item => {
            Object.entries(item).forEach(([title, titleContent]) => {
                if (title == 'Summary of Use during Lactation') { // Check if title is "Summary of Use during Lactation"
                    const p = document.createElement('p');
                    p.innerHTML = `
                <p>${titleContent}</p>
        `;
                    contentDiv.appendChild(p);
                }
            });
        });
    } else {
        // Handle non-array data
        Object.entries(items).forEach(([title, titleContent]) => {
            if (title == 'Summary of Use during Lactation') { // Check if title is "Summary of Use during Lactation"
                const p = document.createElement('p');
                p.innerHTML = `
                <p>${titleContent}</p>
    `;
                contentDiv.appendChild(p);
            }
        });
    }
}
// Function to filter dropdown options based on search input
function filterDropdown(searchTerm) {
    const select = document.getElementById('keySelect');
    const options = Array.from(select.querySelectorAll('option'));
    options.forEach(option => {
        const text = option.text.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
}
// Function to handle dropdown change event
async function handleKeyChange() {
    const key = this.value;
    const data = await loadJSON();
    if (data) {
        displayContent(data, key);
    }
}
// Function to handle search input change event
function handleSearchChange() {
    const searchTerm = this.value;
    filterDropdown(searchTerm);
    const select = document.getElementById('keySelect');
    // Display content for the first matching option
    const matchingOption = Array.from(select.options).find(option => option.style.display !== 'none');
    if (matchingOption) {
        select.value = matchingOption.value;
        handleKeyChange.call(select); // Trigger content update
    }
}
// Initialization
window.onload = async function() {
    const data = await loadJSON();
    if (data) {
        populateDropdown(data);
        // Display content for the first key by default
        const firstKey = Object.keys(data)[0];
        displayContent(data, firstKey);
        // Add event listener to dropdown
        const select = document.getElementById('keySelect');
        select.addEventListener('change', handleKeyChange);
        // Add event listener to search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', handleSearchChange);
    }
};