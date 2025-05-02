export const setAuthData = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
};

export const getAuthToken = () => {
    return localStorage.getItem('access_token');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const authHeaders = () => ({
    'Authorization': `Bearer ${getAuthToken()}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});