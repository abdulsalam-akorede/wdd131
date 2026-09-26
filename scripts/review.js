// Get the current number of reviews from localStorage
let reviewCount = Number(localStorage.getItem("reviewCount")) || 0;

// Add one to the review count
reviewCount++;

// Save the updated count back to localStorage
localStorage.setItem("reviewCount", reviewCount);

// Display the review count on the page
document.querySelector("#reviewCount").textContent = reviewCount;