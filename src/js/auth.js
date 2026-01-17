import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const authSection = document.getElementById("authSection");
const userSection = document.getElementById("userSection");
const logoutBtn = document.getElementById("logoutBtn");

// Function to update UI based on auth state
function updateAuthUI(user) {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        
        // Update localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userUID', user.uid);
        if (user.displayName) localStorage.setItem('userDisplayName', user.displayName);
        if (user.photoURL) localStorage.setItem('userPhotoURL', user.photoURL);
        
        // Update UI
        if (authSection) authSection.style.display = "none";
        if (userSection) userSection.style.display = "flex";
        
        // Update profile image if available
        const profileImg = document.getElementById("profileImg");
        if (profileImg) {
            if (user.photoURL) {
                profileImg.src = user.photoURL;
                localStorage.setItem('userPhotoURL', user.photoURL);
            } else {
                // Use default profile image
                profileImg.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                localStorage.removeItem('userPhotoURL');
            }
        }
    } else {
        // User is signed out
        console.log("User is signed out");
        
        // Clear localStorage
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userUID');
        localStorage.removeItem('userDisplayName');
        localStorage.removeItem('userPhotoURL');
        
        // Update UI
        if (authSection) authSection.style.display = "flex";
        if (userSection) userSection.style.display = "none";
    }
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
});

// Check localStorage on page load for immediate UI update
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userUID = localStorage.getItem('userUID');
    const userDisplayName = localStorage.getItem('userDisplayName');
    const userPhotoURL = localStorage.getItem('userPhotoURL');
    
    if (isLoggedIn && userEmail && userUID) {
        // Create a mock user object from localStorage
        const mockUser = {
            email: userEmail,
            uid: userUID,
            displayName: userDisplayName,
            photoURL: userPhotoURL
        };
        
        updateAuthUI(mockUser);
        
        // Also update profile image immediately
        const profileImg = document.getElementById("profileImg");
        if (profileImg && userPhotoURL) {
            profileImg.src = userPhotoURL;
        }
    }
});

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            
            // Clear all localStorage
            localStorage.clear();
            
            // Redirect to homepage
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Error signing out. Please try again.");
        }
    });
}

// Export function for other modules to use
export { updateAuthUI };
