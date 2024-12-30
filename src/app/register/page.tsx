"use client";

import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import styles from "./Register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cin, setCin] = useState("");
  const [message, setMessage] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/register", {
        email,
        password,
        cin,
        role: "professeur", // ou autre rôle selon vos besoins
      });

      setMessage(response.data); // Affichez le message retourné par le backend
    } catch (error: any) {
      console.error("Error during registration:", error.response?.data || error.message);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleNext} className={styles.form}>
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
          <div className={styles.inputGroup}>
            <label htmlFor="cin" className={styles.label}>
              CIN
            </label>
            <input
              type="text"
              id="cin"
              className={styles.input}
              value={cin}
              onChange={(e) => setCin(e.target.value)}
              placeholder="Enter your CIN"
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Next
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
