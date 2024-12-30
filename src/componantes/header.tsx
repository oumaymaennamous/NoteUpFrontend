"use client";  // Ajoutez cette ligne pour marquer le fichier comme un composant côté client

import { useState } from 'react';
import styles from '../Styles/Header.module.css';  // Importez le module CSS

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.headerContainer}>
      <nav className={styles.navbar}>
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">NotesUp</span>
            
          </a>
        </div>
         
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className={styles.navLink}>Product</a>
          <a href="#" className={styles.navLink}>Features</a>
          <a href="#" className={styles.navLink}>Pricing</a>
        </div>
        <div className={styles.actions}>
          <a href="#" className={styles.actionLink}>Log in</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
