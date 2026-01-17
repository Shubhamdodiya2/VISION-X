// Authentication utility functions
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Authentication state management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
        this.init();
    }

    init() {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateLocalStorage(user);
            this.notifyListeners(user);
        });

        // Check localStorage on page load
        this.checkStoredAuth();
    }

    updateLocalStorage(user) {
        if (user) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userUID', user.uid);
            if (user.displayName) localStorage.setItem('userDisplayName', user.displayName);
            if (user.photoURL) localStorage.setItem('userPhotoURL', user.photoURL);
        } else {
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userUID');
            localStorage.removeItem('userDisplayName');
            localStorage.removeItem('userPhotoURL');
        }
    }

    checkStoredAuth() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (isLoggedIn && auth.currentUser) {
            this.currentUser = auth.currentUser;
            this.updateLocalStorage(auth.currentUser);
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
        // Immediately call with current state
        if (this.currentUser !== null) {
            callback(this.currentUser);
        }
    }

    notifyListeners(user) {
        this.listeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async logout() {
        try {
            await signOut(auth);
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    }

    // Redirect to login if not authenticated
    requireAuth(redirectTo = 'login.html') {
        // Check localStorage first for immediate response
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userUID = localStorage.getItem('userUID');
        
        if (!isLoggedIn || !userUID) {
            console.log('User not authenticated, redirecting to login');
            window.location.href = redirectTo;
            return false;
        }
        
        // Double-check with Firebase auth state
        if (auth.currentUser) {
            return true;
        }
        
        // If Firebase auth is still loading, wait a bit
        setTimeout(() => {
            if (!auth.currentUser && localStorage.getItem('userLoggedIn') === 'true') {
                console.log('Firebase auth not ready, but localStorage says logged in');
                // Don't redirect, let the page load
            } else if (!auth.currentUser) {
                console.log('Firebase auth confirmed user not logged in');
                window.location.href = redirectTo;
            }
        }, 1000);
        
        return true;
    }

    // Redirect to home if already authenticated
    redirectIfAuthenticated(redirectTo = 'index.html') {
        if (this.isLoggedIn()) {
            window.location.href = redirectTo;
            return true;
        }
        return false;
    }
}

// Create global instance
const authManager = new AuthManager();

// Utility functions
export function isUserLoggedIn() {
    return authManager.isLoggedIn();
}

export function getCurrentUser() {
    return authManager.getCurrentUser();
}

export function requireAuth(redirectTo = 'login.html') {
    return authManager.requireAuth(redirectTo);
}

export function redirectIfAuthenticated(redirectTo = 'index.html') {
    return authManager.redirectIfAuthenticated(redirectTo);
}

export function addAuthListener(callback) {
    authManager.addListener(callback);
}

export async function logout() {
    return await authManager.logout();
}

// Auto-redirect for login/signup pages
export function setupAuthRedirect() {
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('signup.html')) {
        redirectIfAuthenticated();
    }
}

// Initialize auth redirect on page load
document.addEventListener('DOMContentLoaded', setupAuthRedirect);

export default authManager;
