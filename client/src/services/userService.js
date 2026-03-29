import { apiGet, apiPost } from '../utils/api';

export const userService = {
    async getAllUsers() {
        return apiGet('/users');
    },
    async registerUser(userData) {
        return apiPost('/users/register', userData);
    },
    async updateUser(userData) {
        return apiPost('/users/update', userData);
    },
    async deleteUser(code, role) {
        return apiPost('/users/delete', { code, role });
    },
    async getJudges() {
        return apiGet('/users/judges');
    },
    async getStenos() {
        return apiGet('/users/stenos');
    }
};
