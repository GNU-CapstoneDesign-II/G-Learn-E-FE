import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchWorkbook = async (workbookId, token) => {
    const res = await axios.get(`${API_BASE_URL}/problem/workbook/${workbookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
};
