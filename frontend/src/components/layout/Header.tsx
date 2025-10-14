import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo e Título */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔰</span>
          </div>
          <div className={styles.title}>
            <h1 className={styles.mainTitle}>Sistema de Ocorrências</h1>
            <p className={styles.subtitle}>Corpo de Bombeiros</p>
          </div>
        </div>

        {/* Navegação */}
        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${
              location.pathname === '/' ? styles.navLinkActive : ''
            }`}
          >
            <span>📋</span>
            <span className={styles.navText}>Ocorrências</span>
          </Link>
          
          <Link
            to="/nova-ocorrencia"
            className={`${styles.navLink} ${
              location.pathname === '/nova-ocorrencia' ? styles.navLinkActive : ''
            }`}
          >
            <span>➕</span>
            <span className={styles.navText}>Nova Ocorrência</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;