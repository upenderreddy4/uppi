document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const experience = document.getElementById('experience').value;

    try {
        const response = await fetch('http://127.0.0.1:8000/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, experience }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('responseMessage').innerText = result.message;

        // Fetch and display the updated list of users
        fetchUsers();
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
});

async function fetchUsers() {
    try {
        const response = await fetch('http://127.0.0.1:8000/users/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.email}) - ${user.experience} years of experience`;
            userList.appendChild(li);

            // Add update and delete buttons
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => updateUser(user.email);
            li.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteUser(user.email);
            li.appendChild(deleteButton);
        });
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
}

// Fetch and display the list of users on page load
fetchUsers();

async function updateUser(email) {
    const name = prompt('Enter new name:');
    const experience = prompt('Enter new experience:');
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, experience }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('responseMessage').innerText = result.message;

        // Fetch and display the updated list of users
        fetchUsers();
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
}

async function deleteUser(email) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/${email}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        document.getElementById('responseMessage').innerText = result.message;

        // Fetch and display the updated list of users
        fetchUsers();
    } catch (error) {
        document.getElementById('responseMessage').innerText = `Error: ${error.message}`;
    }
}