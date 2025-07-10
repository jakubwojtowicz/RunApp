import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/history">Running history</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
