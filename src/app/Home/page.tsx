"use client";

import styles from './Home.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>NoteUp.</h1>
        <p className={styles.description}>
          Welcome to the most innovative platform! Your gateway to streamlined user experiences and efficient solutions.
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.card} onClick={() => window.location.href = '/Login'}>
          <h2>Login</h2>
          <p>Access your personalized dashboard</p>
        </div>
        <div className={styles.card} onClick={() => window.location.href = '/register'}>
          <h2>Register</h2>
          <p>Create an account to get started</p>
        </div>
        <div className={styles.card} onClick={() => window.location.href = '/user'}>
          <h2>About</h2>
          <p>Learn more about our application</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
