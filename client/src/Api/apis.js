import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const api = {
    login: async (username, password, role) => {
        try{
            const response = await axios.post(`${apiUrl}/login`, { username, password, role });
            return response.data;
        }catch(error){
            const response = error.response;
            console.error('Error login user:', response);
            return response ;
        }
    },
    fetchAccounts: async (token) => {
        const response = await axios.post(`${apiUrl}/banker/accounts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    fetchTransaction: async (user_id, token) => {
        const response = await axios.post(`${apiUrl}/transaction`, { user_id , token });
        return response.data;
    },
    handleTransaction: async (user_id, transaction_type, amount, token) => {
        const response = await axios.post(`${apiUrl}/customer/transaction`, { user_id, transaction_type, amount, token });
        return response.data;
    }
}

export default api;