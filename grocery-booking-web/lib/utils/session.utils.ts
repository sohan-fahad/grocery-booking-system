const getToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('token');
}

const setToken = (token: string) => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem('token', token);
}

const removeToken = () => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.removeItem('token');
}

export const SessionUtils = {
    getToken,
    setToken,
    removeToken,
}