import {getAuthToken} from './tokenAuth.js';

/**
 * @param {string} baseUrl – example: 'tasks'
 * @param {string|number} id
 */
export async function deleteById(baseUrl, id) {
    const url = `http://127.0.0.1:8000/api/${baseUrl}/${id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Delete failed');
    }
    return true;
}


export async function updateById(baseUrl, id, data, method = 'PATCH') {
    const url = `http://127.0.0.1:8000/api/${baseUrl}/${id}`;
    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Update failed');
    }
    return await response.json();
}
