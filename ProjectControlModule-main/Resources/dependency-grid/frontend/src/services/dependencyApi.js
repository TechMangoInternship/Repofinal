import axios from 'axios';

const API_URL = '/api/dependencies';

const dependencyApi = {
  /**
   * Fetch all dependencies, optionally filtered by search query.
   */
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  /**
   * Create a new dependency.
   */
  create: async (text) => {
    const response = await axios.post(API_URL, { text });
    return response.data;
  },

  /**
   * Update an existing dependency.
   */
  update: async (id, text) => {
    const response = await axios.put(`${API_URL}/${id}`, { text });
    return response.data;
  },

  /**
   * Delete a dependency.
   */
  remove: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default dependencyApi;
