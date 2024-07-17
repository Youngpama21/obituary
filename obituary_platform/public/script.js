document.getElementById('obituaryForm').addEventListener('submit', function(event) {
    // Simple form validation
    const name = document.getElementById('name').value.trim();
    const dateOfBirth = document.getElementById('date_of_birth').value;
    const dateOfDeath = document.getElementById('date_of_death').value;
    const content = document.getElementById('content').value.trim();
    const author = document.getElementById('author').value.trim();
  
    if (!name || !dateOfBirth || !dateOfDeath || !content || !author) {
      alert('Please fill in all fields');
      event.preventDefault();
    }
  });
  