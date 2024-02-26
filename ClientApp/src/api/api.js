import baseUrl from './config';

const handleCustomerHttpRequest = async (url, method, body) => {
    try {
        const response = await fetch(`${baseUrl}/customer/${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            return { success: true, data: await response.json() };
        } else {
            return { success: false, error: 'Failed to fetch data' };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
};

export default handleCustomerHttpRequest;