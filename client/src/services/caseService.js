import { apiGet, apiPost } from '../utils/api';

export const caseService = {
  async getAllCases() {
    return apiGet('/cases');
  },

  async createCase(caseData) {
    return apiPost('/cases/add', caseData);
  },

  async updateCase(caseData) {
    return apiPost('/cases/update', caseData);
  },

  async deleteCase(caseCode) {
    return apiPost('/cases/delete', { case_code: caseCode });
  },

  async getUnscheduledHearings() {
    return apiGet('/hearings/unscheduled');
  },

  async scheduleHearing(hearingData) {
    return apiPost('/hearings/schedule', hearingData);
  },

  async getStenoHearings() {
    return apiGet('/hearings/steno');
  },

  async getJudgeHearings() {
    return apiGet('/hearings/judge');
  },

  getDownloadReportUrl() {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/cases/download`;
  }
};
