// Authentication handling for PharmaSys

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // For demo purposes, accept any login
                const userInfo = {
                    id: 1,
                    name: "John Doe",
                    role: "Admin",
                    token: "demo_token_" + Date.now()
                };
                
                this.currentUser = userInfo;
                this.saveUserToStorage(userInfo);
                resolve(userInfo);
            }, 1000);
        });
    }

    logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.currentUser = null;
                this.clearUserFromStorage();
                resolve();
            }, 500);
        });
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    saveUserToStorage(userInfo) {
        try {
            localStorage.setItem("pharmaUserInfo", JSON.stringify(userInfo));
        } catch (error) {
            console.error("Failed to save user info to localStorage:", error);
        }
    }

    loadUserFromStorage() {
        try {
            const storedUser = localStorage.getItem("pharmaUserInfo");
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error("Failed to load user info from localStorage:", error);
            this.currentUser = null;
        }
    }

    clearUserFromStorage() {
        try {
            localStorage.removeItem("pharmaUserInfo");
        } catch (error) {
            console.error("Failed to clear user info from localStorage:", error);
        }
    }

    // Validate user input
    validateLoginForm(username, password) {
        const errors = [];
        
        if (!username || username.trim().length < 3) {
            errors.push("Username must be at least 3 characters long");
        }
        
        if (!password || password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Check user permissions
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const userRole = this.currentUser.role.toLowerCase();
        const permissions = {
            'admin': ['view', 'edit', 'delete', 'manage_users'],
            'pharmacist': ['view', 'edit'],
            'assistant': ['view']
        };
        
        return permissions[userRole]?.includes(permission) || false;
    }
}

// Create global auth instance
window.authManager = new AuthManager();
