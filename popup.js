

// Get the form element and the add button
const form = document.querySelector('form');
const addButton = document.querySelector('#add-activity');

// Counter for activity fields
let counter = 1;

// Event listener for the add button
addButton.addEventListener('click', () => {
  // Create a new activity field with a unique ID and increment the counter
  const newActivityField = `
    <div>
      <label for="activity${counter + 1}">Activity Name:</label>
      <input type="text" id="activity${counter + 1}" name="activity${counter + 1}">
    </div>
  `;
  // Add the new activity field to the form
  form.insertAdjacentHTML('beforeend', newActivityField);
  // Increment the counter
  counter++;
});
