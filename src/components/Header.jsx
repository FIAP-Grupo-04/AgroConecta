import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from 'react-router-dom' // se quiser SPA

export default function Header() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  // const navigate = useNavigate()

  const username = "Edson";
  const navLinks = [
    { id: "sobre", label: "Sobre", href: "#", disabled: true },
    { id: "termos", label: "Termos", href: "#", disabled: true },
    { id: "contato", label: "Contato", href: "/contato" },
  ];
  function onLogout() {
    // navigate('/') // se usa react-router
    window.location.href = "/";
  }

  // fecha ao clicar fora
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="dashboard-header">
      <div className="container-header">
        <a href="/dashboard" className="logo">
          AgroConecta
        </a>

        <nav>
          <ul>
            {(navLinks ?? []).map((link) => (
              <li key={link.id}>
                <a
                  id={link.id}
                  className={`dashboard-footer-link ${
                    link.disabled ? "desactive" : ""
                  }`}
                  href={link.href}
                  onClick={(e) => link.disabled && e.preventDefault()}
                  aria-disabled={link.disabled || undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ===== User menu ===== */}
        <div className="menu-user">
          <div className="user-menu">
            <button
              ref={btnRef}
              className="user-menu-button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span>Olá, {username}</span>
              <img src="/images/circle-user.png" alt="" aria-hidden="true" />
            </button>

            {open && (
              <div
                ref={popRef}
                role="menu"
                className="user-menu-popover"
                aria-label="Menu do usuário"
              >
                {/* Se quiser mais opções, adicione aqui */}
                {/* <button role="menuitem" onClick={() => navigate('/perfil')}>Meu Perfil</button> */}
                <button role="menuitem" onClick={onLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
