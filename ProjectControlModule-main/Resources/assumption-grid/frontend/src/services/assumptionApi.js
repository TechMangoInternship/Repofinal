import axios from 'axios';

const API_URL = '/api/assumptions';

const assumptionApi = {
  /**
   * Fetch all assumptions, optionally filtered by search query.
   */
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  /**
   * Create a new assumption.
   */
  create: async (text) => {
    const response = await axios.post(API_URL, { text });
    return response.data;
  },

  /**
   * Update an existing assumption.
   */
  update: async (id, text) => {
    const response = await axios.put(`${API_URL}/${id}`, { text });
    return response.data;
  },

  /**
   * Delete an assumption.
   */
  remove: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default assumptionApi;
