import baseUrl from './config';

const handleHttpRequest = async (url, method, body = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        };

        if (body && (method !== 'GET' && method !== 'HEAD')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseUrl}${url}`, options);

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            // Parse the error response
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { 
                    title: response.statusText,
                    status: response.status
                };
            }
            
            return { 
                success: false, 
                error: errorData,
                status: response.status
            };
        }
    } catch (error) {
        console.error('API Request failed:', error);
        return { 
            success: false, 
            error: { 
                title: 'Network error',
                status: 0
            }
        };
    }
};

export default handleHttpRequest;