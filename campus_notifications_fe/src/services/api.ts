import axios from 'axios';

const BASE_URL = '/evaluation-service';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async () => {
    const authData = {
      email: "ap0902@srmist.edu.in",
      name: "adhil p sajeedh",
      rollNo: "ra2311028020022",
      accessCode: "QkbpxH",
      clientID: "c38ef7a1-d14b-4489-91a9-a9ae6db12dea",
      clientSecret: "gfatQvhYVHgJYqxM"
    };
    const response = await axios.post(`${BASE_URL}/auth`, authData);
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  }
};

export interface AppNotification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export const notificationService = {
  getNotifications: async (limit?: number, page?: number, notificationType?: string) => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (notificationType && notificationType !== 'All') params.notification_type = notificationType;

    const response = await api.get('/notifications', { params });
    return response.data.notifications as AppNotification[];
  }
};
