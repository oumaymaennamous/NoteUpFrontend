"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import styles from "./Login.module.css";
import { useRouter } from 'next/navigation';  // Utilisation du hook useRouter

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);  // Etat pour vérifier si le composant est monté côté client
  const router = useRouter();  // Le hook useRouter ne sera utilisé que côté client

  // Vérification si le composant est monté côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", { email, password });
      const token = response.data; // Récupérer le token JWT

      // Sauvegarder le token dans le stockage local (localStorage ou sessionStorage)
      localStorage.setItem("token", token);

      // Décoder le JWT pour extraire le rôle
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role; // Le rôle unique

      // Rediriger l'utilisateur selon son rôle
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole ==="ROLE_Professeur") {
        router.push("/user");
      } else {
        console.log("no auto")
        router.push("/"); // Redirection vers la page d'accueil ou erreur
      }

    } catch (error: any) {
      console.error("Error during login:", error.response?.data || error.message);
      setMessage("Connexion invalide.");
    }
  };

  if (!isClient) {
    return null; // Ne pas afficher le composant avant qu'il ne soit monté côté client
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Log In
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
