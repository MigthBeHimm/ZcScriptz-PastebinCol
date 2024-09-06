// Load pastes on page load
window.onload = function () {
    loadSavedPastes();
};

// Save a new paste to localStorage
document.getElementById('pasteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const pasteText = document.getElementById('pasteText').value;
    const pasteTitle = document.getElementById('pasteTitle').value || "Untitled Paste";
    const pastePassword = document.getElementById('pastePassword').value;

    if (pasteText.trim() !== '' && pastePassword.trim() !== '') {
        // Create a paste object with password
        const newPaste = {
            id: Date.now(), // Unique ID for each paste
            title: pasteTitle,
            text: pasteText,
            password: pastePassword // Password to protect the paste
        };

        // Get existing pastes or create a new array
        let pastes = JSON.parse(localStorage.getItem('pastes')) || [];
        pastes.push(newPaste);

        // Save the updated pastes array to localStorage
        localStorage.setItem('pastes', JSON.stringify(pastes));

        // Clear the form and display updated pastes
        document.getElementById('pasteText').value = '';
        document.getElementById('pasteTitle').value = '';
        document.getElementById('pastePassword').value = '';
        displayPastes();
    } else {
        alert('Please enter a paste and a password.');
    }
});

// Display all saved pastes
function displayPastes() {
    const pastesContainer = document.getElementById('pastesContainer');
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];

    // Clear current displayed pastes
    pastesContainer.innerHTML = '';

    pastes.forEach(paste => {
        // Create a paste container
        const pasteElement = document.createElement('div');
        pasteElement.classList.add('paste-item');
        pasteElement.innerHTML = `
            <h3>${paste.title}</h3>
            <pre>${paste.text}</pre>
            <button onclick="copyToClipboard('${paste.id}')">Copy to Clipboard</button>
            <button onclick="viewRaw('${paste.id}')">View Raw</button>
            <button onclick="downloadPaste('${paste.id}')">Download as .txt</button>
            <button onclick="promptForPassword('${paste.id}')">Delete Paste</button>
        `;
        pastesContainer.appendChild(pasteElement);
    });
}

// Load saved pastes on page load
function loadSavedPastes() {
    displayPastes();
}

// Copy paste content to clipboard
function copyToClipboard(id) {
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    const paste = pastes.find(p => p.id === parseInt(id));
    if (paste) {
        navigator.clipboard.writeText(paste.text).then(() => {
            alert('Text copied to clipboard!');
        });
    }
}

// View raw content in a new window
function viewRaw(id) {
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    const paste = pastes.find(p => p.id === parseInt(id));
    if (paste) {
        const rawWindow = window.open('', '_blank');
        rawWindow.document.write('<pre>' + paste.text + '</pre>');
        rawWindow.document.close();
    }
}

// Download paste content as a .txt file
function downloadPaste(id) {
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    const paste = pastes.find(p => p.id === parseInt(id));
    if (paste) {
        const blob = new Blob([paste.text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${paste.title}.txt`;
        link.click();
    }
}

// Prompt for password before deleting a paste
function promptForPassword(id) {
    const enteredPassword = prompt('Please enter the password to delete this paste:');
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    const paste = pastes.find(p => p.id === parseInt(id));

    if (paste) {
        // Check if the entered password matches the paste's password
        if (enteredPassword === paste.password) {
            deletePaste(id);
        } else {
            alert('Incorrect password. You cannot delete this paste.');
        }
    }
}

// Delete a paste
function deletePaste(id) {
    let pastes = JSON.parse(localStorage.getItem('pastes')) || [];
    pastes = pastes.filter(p => p.id !== parseInt(id));

    // Save the updated pastes array to localStorage
    localStorage.setItem('pastes', JSON.stringify(pastes));

    // Update the displayed pastes
    displayPastes();
}

// Search through published content
function searchContent() {
    const searchText = document.getElementById('searchText').value.toLowerCase();
    const pastes = JSON.parse(localStorage.getItem('pastes')) || [];

    // Loop through pastes and highlight matches
    const pastesContainer = document.getElementById('pastesContainer');
    const pasteItems = pastesContainer.querySelectorAll('.paste-item');

    pastes.forEach((paste, index) => {
        if (paste.text.toLowerCase().includes(searchText)) {
            pasteItems[index].style.backgroundColor = '#ffff99'; // Highlight search
        } else {
            pasteItems[index].style.backgroundColor = ''; // Reset background
        }
    });
}
