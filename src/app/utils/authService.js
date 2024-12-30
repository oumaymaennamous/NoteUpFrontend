import axios from "axios";

export const login = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login2", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data || "Erreur lors de la connexion");
  }
};
