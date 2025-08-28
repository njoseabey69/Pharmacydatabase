// Utility functions for PharmaSys

class Utils {
    // Date formatting utilities
    static formatDate(date, format = 'medium') {
        const d = new Date(date);
        const formats = {
            'short': d.toLocaleDateString(),
            'medium': d.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            'long': d.toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            'iso': d.toISOString().split('T')[0]
        };
        return formats[format] || formats.medium;
    }

    static formatDateTime(date) {
        const d = new Date(date);
        return d.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
        
        return this.formatDate(date);
    }

    // Number formatting utilities
    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static formatNumber(number, decimals = 2) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    // Validation utilities
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static isValidDate(date) {
        return !isNaN(Date.parse(date));
    }

    // String utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static truncate(str, length = 50, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    }

    // Array utilities
    static unique(array) {
        return [...new Set(array)];
    }

    static sortBy(array, key, direction = 'asc') {
        return array.sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            // Handle dates
            if (this.isValidDate(aValue) && this.isValidDate(bValue)) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    static filterBy(array, filters) {
        return array.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (value === '' || value === null || value === undefined) return true;
                return item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase());
            });
        });
    }

    // Object utilities
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static mergeObjects(...objects) {
        return objects.reduce((merged, obj) => {
            return { ...merged, ...obj };
        }, {});
    }

    // Storage utilities
    static getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    }

    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // DOM utilities
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // File utilities
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    // Math utilities
    static calculatePercentage(part, total) {
        if (total === 0) return 0;
        return (part / total) * 100;
    }

    static round(number, decimals = 2) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    // Color utilities
    static getStatusColor(status) {
        const colors = {
            'active': 'success',
            'inactive': 'secondary',
            'pending': 'warning',
            'completed': 'success',
            'cancelled': 'danger',
            'low': 'warning',
            'critical': 'danger',
            'normal': 'success'
        };
        return colors[status.toLowerCase()] || 'secondary';
    }

    static getStatusBadge(status) {
        const color = this.getStatusColor(status);
        return `<span class="badge bg-${color}">${this.capitalize(status)}</span>`;
    }

    // Time utilities
    static getBusinessDays(startDate, endDate) {
        let count = 0;
        const curDate = new Date(startDate);
        const end = new Date(endDate);
        
        while (curDate <= end) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        
        return count;
    }

    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Error handling
    static handleError(error, context = '') {
        console.error(`Error${context ? ' in ' + context : ''}:`, error);
        
        const userMessage = error.message || 'An unexpected error occurred';
        return {
            success: false,
            error: userMessage,
            details: error
        };
    }

    // Random utilities
    static generateId(length = 8) {
        return Math.random().toString(36).substr(2, length);
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Performance monitoring
    static measurePerformance(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    // Accessibility utilities
    static setFocus(element) {
        if (element && typeof element.focus === 'function') {
            element.focus();
        }
    }

    static announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer') || 
                          this.createScreenReaderAnnouncer();
        announcer.textContent = message;
    }

    static createScreenReaderAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        announcer.setAttribute('aria-live', 'polite');
        document.body.appendChild(announcer);
        return announcer;
    }
}

// Make utilities globally available
window.utils = Utils;
