import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/admin', // URL du backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour inclure les cookies si Spring Security est configuré
}

);
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // Ou utilisez un autre mécanisme de stockage pour le token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Intercepteur pour gérer les erreurs de réponse
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Si le statut est 401 (non autorisé), vous pouvez rediriger l'utilisateur vers la page de login, par exemple
      if (error.response && error.response.status === 401) {
        // Rediriger vers la page de connexion ou afficher un message d'erreur
        console.log('Session expirée ou utilisateur non autorisé. Rediriger vers la page de login.');
      }
      return Promise.reject(error);
    }
);
export default axiosInstance;
