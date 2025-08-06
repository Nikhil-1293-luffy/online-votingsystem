document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5000'; // Base URL for the Flask API
    const statusMessage = document.getElementById('status-message');

    // --- Form Event Listeners ---

    // Add Candidate
    document.getElementById('add-candidate-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const candidateId = document.getElementById('candidate-id').value;
        const name = document.getElementById('candidate-name').value;
        const position = document.getElementById('candidate-position').value;
        const response = await apiRequest('/api/add_candidate', { candidate_id: candidateId, name, position });
        updateStatus(response.message, !response.success);
        if (response.success) {
            e.target.reset();
            fetchResults();
        }
    });

    // Add Voter
    document.getElementById('add-voter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const voterId = document.getElementById('voter-id').value;
        const name = document.getElementById('voter-name').value;
        const response = await apiRequest('/api/add_voter', { voter_id: voterId, name });
        updateStatus(response.message, !response.success);
        if (response.success) e.target.reset();
    });

    // Cast Vote
    document.getElementById('cast-vote-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const voterId = document.getElementById('vote-voter-id').value;
        const candidateId = document.getElementById('vote-candidate-id').value;
        const response = await apiRequest('/api/cast_vote', { voter_id: voterId, candidate_id: candidateId });
        updateStatus(response.message, !response.success);
        if (response.success) {
            e.target.reset();
            fetchResults();
        }
    });

    // --- Helper Functions ---
    async function apiRequest(endpoint, body = null, method = 'POST') {
        try {
            const config = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) {
                config.body = JSON.stringify(body);
            }
            const response = await fetch(API_URL + endpoint, config);
            if (!response.ok) {
                // Try to get error message from server, otherwise use default
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            updateStatus(error.message, true);
            return { success: false, message: error.message };
        }
    }
    
    function updateStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'red' : 'green';
    }

    async function fetchResults() {
        const results = await apiRequest('/api/results', null, 'GET');
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = ''; // Clear previous results

        if (Object.keys(results).length === 0) {
            resultsContainer.innerHTML = '<p>No candidates have been registered yet.</p>';
            return;
        }

        for (const position in results) {
            const positionBlock = document.createElement('div');
            positionBlock.className = 'position-block';
            
            const title = document.createElement('h3');
            title.textContent = position;
            positionBlock.appendChild(title);
            
            const candidateList = document.createElement('ul');
            results[position].forEach(candidate => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <span class="candidate-name">${candidate.name} (${candidate.candidate_id})</span>
                    <span class="vote-count">${candidate.vote_count} Votes</span>
                `;
                candidateList.appendChild(item);
            });
            
            positionBlock.appendChild(candidateList);
            resultsContainer.appendChild(positionBlock);
        }
    }

    // --- Initial Load ---
    fetchResults(); // Fetch results when the page loads
    setInterval(fetchResults, 10000); // And refresh them every 10 seconds
});
