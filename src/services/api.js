import { mockSearchResults, mockOccupations, mockSynonyms, mockAuditLogs, mockAnalytics } from './mockData';

// Simulate API delay for realistic behavior
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API Service Layer
 * 
 * This service abstracts all backend interactions.
 * Currently uses mock data, but can be easily replaced with real API calls.
 * 
 * To replace with real backend:
 * 1. Update the base URL
 * 2. Replace mock returns with actual HTTP calls (using axios or fetch)
 * 3. Handle authentication tokens if needed
 */

const API_BASE_URL = '/api'; // This would be your actual backend URL

// In-memory storage for frontend-only features
let localSynonyms = [...mockSynonyms];
let localAuditLogs = [...mockAuditLogs];

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

    // Mock implementation
    const occupation = mockOccupations.find(occ => occ.ncoCode === ncoCode);

    if (!occupation) {
        throw new Error('Occupation not found');
    }

    return occupation;

    // Real implementation would be:
    // const response = await axios.get(`${API_BASE_URL}/occupations/${ncoCode}`);
    // return response.data;
}

/**
 * Get all synonym mappings
 * @returns {Promise<Array>} - Array of synonym objects
 */
export async function getSynonyms() {
    await delay(300);

    // Mock implementation - returns local state
    return [...localSynonyms];

    // Real implementation would be:
    // const response = await axios.get(`${API_BASE_URL}/synonyms`);
    // return response.data;
}

/**
 * Add a new synonym mapping
 * @param {string} synonym - The synonym text
 * @param {string} ncoCode - Target NCO code
 * @param {string} occupation - Occupation title
 * @returns {Promise<Object>} - Created synonym object
 */
export async function addSynonym(synonym, ncoCode, occupation) {
    await delay(300);

    // Mock implementation - update local state
    const newSynonym = {
        id: Date.now(),
        synonym,
        ncoCode,
        occupation,
    };

    localSynonyms.push(newSynonym);
    addAuditLog('SYNONYM_ADD', `Added synonym: "${synonym}" → ${ncoCode} (${occupation})`);

    return newSynonym;

    // Real implementation would be:
    // const response = await axios.post(`${API_BASE_URL}/synonyms`, { synonym, ncoCode, occupation });
    // return response.data;
}

/**
 * Remove a synonym mapping
 * @param {number} synonymId - ID of synonym to remove
 * @returns {Promise<void>}
 */
export async function removeSynonym(synonymId) {
    await delay(300);

    // Mock implementation - update local state
    const synonym = localSynonyms.find(s => s.id === synonymId);
    localSynonyms = localSynonyms.filter(s => s.id !== synonymId);

    if (synonym) {
        addAuditLog('SYNONYM_REMOVE', `Removed synonym: "${synonym.synonym}"`);
    }

    // Real implementation would be:
    // await axios.delete(`${API_BASE_URL}/synonyms/${synonymId}`);
}

/**
 * Get audit logs
 * @param {string} filter - Optional filter by action type
 * @returns {Promise<Array>} - Array of audit log entries
 */
export async function getAuditLogs(filter = null) {
    await delay(300);

    // Mock implementation
    let logs = [...localAuditLogs].reverse(); // Most recent first

    if (filter && filter !== 'ALL') {
        logs = logs.filter(log => log.action === filter);
    }

    return logs;

    // Real implementation would be:
    // const response = await axios.get(`${API_BASE_URL}/audit-logs`, { params: { filter } });
    // return response.data;
}

/**
 * Get analytics data
 * @returns {Promise<Object>} - Analytics object with various metrics
 */
export async function getAnalytics() {
    await delay(400);

    // Mock implementation
    return { ...mockAnalytics };

    // Real implementation would be:
    // const response = await axios.get(`${API_BASE_URL}/analytics`);
    // return response.data;
}

/**
 * Log a selection (called when enumerator selects an occupation)
 * @param {string} ncoCode - Selected occupation code
 * @param {string} title - Selected occupation title
 * @returns {Promise<void>}
 */
export async function logSelection(ncoCode, title) {
    await delay(200);

    addAuditLog('SELECTION', `Selected occupation: ${ncoCode} - ${title}`);

    // Real implementation would be:
    // await axios.post(`${API_BASE_URL}/selections`, { ncoCode, title });
}

/**
 * Log an override (called when admin overrides a selection)
 * @param {string} fromCode - Original occupation code
 * @param {string} toCode - Override occupation code
 * @returns {Promise<void>}
 */
export async function logOverride(fromCode, toCode) {
    await delay(200);

    addAuditLog('OVERRIDE', `Override: Changed from ${fromCode} to ${toCode}`);

    // Real implementation would be:
    // await axios.post(`${API_BASE_URL}/overrides`, { fromCode, toCode });
}

// Helper function to add audit logs (frontend only)
function addAuditLog(action, details) {
    const log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        user: 'current_user', // In real app, this would come from auth context
        details,
    };

    localAuditLogs.push(log);
}
