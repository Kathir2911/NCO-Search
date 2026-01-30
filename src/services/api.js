import { mockSearchResults, mockOccupations, mockSynonyms, mockAuditLogs, mockAnalytics } from './mockData';
import axios from 'axios';

// Simulate API delay for realistic behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API Service Layer
 * 
 * This service abstracts all backend interactions.
 * Currently uses mock data for search features, real backend for authentication.
 */

const API_BASE_URL = '/api'; // This would be your actual backend URL

// In-memory storage for frontend-only features
let localSynonyms = [...mockSynonyms];
let localAuditLogs = [...mockAuditLogs];

// Backend API URL for authentication
// Backend API URL for authentication - empty string means use relative paths (perfect for Vercel/proxies)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Search for occupations based on query
 * @param {string} query - Search query (job title/description)
 * @returns {Promise<Array>} - Array of matching occupations with confidence scores
 */
export async function searchOccupations(query) {
    await delay();

    // Mock implementation
    const results = mockSearchResults(query);

    // Log the search in audit logs
    addAuditLog('SEARCH', `Searched for: "${query}"`);

    return results;

    // Real implementation would be:
    // const response = await axios.post(`${API_BASE_URL}/search`, { query });
    // return response.data;
}

/**
 * Get detailed information about a specific occupation
 * @param {string} ncoCode - NCO code
 * @returns {Promise<Object>} - Detailed occupation information
 */
export async function getOccupationDetails(ncoCode) {
    await delay();
    const occupation = mockOccupations.find(occ => occ.ncoCode === ncoCode);
    if (!occupation) {
        throw new Error('Occupation not found');
    }

    addAuditLog('VIEW_DETAIL', `Viewed details for: ${occupation.title} (${ncoCode})`);

    return occupation;
}

/**
 * Get all synonyms/mappings
 * @returns {Promise<Array>} - List of all synonym mappings
 */
export async function getSynonyms() {
    await delay(300);
    return localSynonyms;
}

/**
 * Add a new synonym mapping
 * @param {Object} synonym - { term, ncoCode, addedBy }
 * @returns {Promise<Object>} - Created synonym
 */
export async function addSynonym(synonym) {
    await delay(400);
    const newSynonym = {
        id: Date.now(),
        ...synonym,
        dateAdded: new Date().toISOString(),
    };
    localSynonyms.push(newSynonym);

    addAuditLog('ADD_SYNONYM', `Added synonym: "${synonym.term}" → ${synonym.ncoCode}`);

    return newSynonym;
}

/**
 * Delete a synonym mapping
 * @param {number} synonymId - ID of the synonym to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteSynonym(synonymId) {
    await delay(300);
    const index = localSynonyms.findIndex(s => s.id === synonymId);
    if (index !== -1) {
        const deleted = localSynonyms[index];
        localSynonyms.splice(index, 1);

        addAuditLog('DELETE_SYNONYM', `Deleted synonym: "${deleted.term}"`);

        return true;
    }
    return false;
}

/**
 * Get analytics data
 * @returns {Promise<Object>} - Analytics data
 */
export async function getAnalytics() {
    await delay(500);
    return mockAnalytics;
}

/**
 * Get audit logs
 * @returns {Promise<Array>} - Audit log entries
 */
export async function getAuditLogs() {
    await delay(300);
    return [...localAuditLogs].reverse(); // Most recent first
}

/**
 * ===================================================
 * AUTHENTICATION SERVICES
 * ===================================================
 */

/**
 * Enumerator Authentication - OTP via Twilio
 */
export async function requestOTP(phone) {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/request-otp`, { phone });
        console.log('✅ OTP sent successfully');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message || 'Failed to send OTP. Please try again.';
        console.error('❌ OTP Request Error:', message);
        throw new Error(typeof message === 'object' ? JSON.stringify(message) : message);
    }
}

export async function verifyOTP(phone, otp) {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, { phone, otp });
        console.log('✅ OTP verified successfully');
        return response.data.user; // Returns { phone, role, name, token }
    } catch (error) {
        const message = error.response?.data?.error || error.message || 'OTP verification failed. Please try again.';
        console.error('❌ OTP Verification Error:', message);
        throw new Error(typeof message === 'object' ? JSON.stringify(message) : message);
    }
}

/**
 * Admin Authentication - Mock for now
 */
export async function loginAdmin(email, password) {
    await delay(800);
    // Mock admin login
    if (email === 'admin@nco.gov.in' && password === 'admin123') {
        const adminUser = {
            id: 'admin_01',
            email,
            role: 'ADMIN',
            name: 'System Admin',
            token: 'mock-admin-token-' + Date.now()
        };
        return adminUser;
    }
    throw new Error('Invalid admin credentials');
}

export async function verifyAdminOTP(email, otp) {
    await delay(800);
    // Mock admin OTP verification
    if (otp === '123456') {
        const adminUser = {
            id: 'admin_01',
            email,
            role: 'ADMIN',
            name: 'System Admin',
            token: 'mock-admin-token-' + Date.now()
        };
        return adminUser;
    }
    throw new Error('Invalid OTP');
}

export async function logout() {
    await delay(300);
    return true;
}

/**
 * Log selection of an occupation
 */
export async function logSelection(ncoCode, title) {
    addAuditLog('SELECTION', `Selected occupation: ${ncoCode} - ${title}`);
    return true;
}

/**
 * Log admin override action
 */
export async function logOverride(fromCode, toCode, reason) {
    addAuditLog('OVERRIDE', `Override: Changed from ${fromCode} to ${toCode}. Reason: ${reason}`);
    return true;
}

// Helper function to add audit logs (frontend only)
function addAuditLog(action, details) {
    const savedUser = localStorage.getItem('nco-user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;

    const log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        user: userObj ? userObj.name : 'Public User',
        details,
    };

    localAuditLogs.push(log);
}
