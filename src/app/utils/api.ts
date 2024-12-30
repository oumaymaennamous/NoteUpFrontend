import axios from "axios";

// Créer une instance d'Axios pour gérer les appels API
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/admin",  // Base URL de votre API admin
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,  // Ajout du token JWT pour l'authentification
  },
});

// Fonction pour récupérer les filières
const fetchFilieres = async () => {
  try {
    const response = await axiosInstance.get("/filieres");
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des filières.");
  }
};

export { axiosInstance, fetchFilieres };
