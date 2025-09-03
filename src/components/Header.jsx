import React from "react";

export default function Header({ username = "Usuário", navLinks = [] }) {
  function onLogout() {
    // comportamento do logout.js
    window.location.href = "/";
    // ou, com react-router: navigate('/')
  }

  return (
    <header className="dashboard-header">
      <div className="container-header">
        <a href="/dashboard" className="logo">
          AgroConecta
        </a>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  id={link.id}
                  className={`dashboard-footer-link ${
                    link.disabled ? "desactive" : ""
                  }`}
                  href={link.href}
                  onClick={(e) => {
                    if (link.disabled) e.preventDefault(); // dashboard.js
                  }}
                  aria-disabled={link.disabled || undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-user">
          <button className="logout-button" onClick={onLogout}>
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
          <button className="user-area" id="user-area">
            <span>Olá, {username}</span>
            <img src="/images/circle-user.png" alt="User" />
          </button>
        </div>
      </div>
    </header>
  );
}
