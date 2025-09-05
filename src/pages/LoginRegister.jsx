import { useMemo, useState, useCallback } from "react";
import "../styles/home-login.css";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginRegister() {
  // controla o modo (login vs cadastro) e a animação "invertido"
  const [mode, setMode] = useState("login");
  const isRegister = mode === "register";

  const containerClass = ["container-login", isRegister ? "invertido" : ""]
    .filter(Boolean)
    .join(" ");

  const handleToggle = useCallback((e) => {
    e?.preventDefault?.();
    setMode((prev) => (prev === "login" ? "register" : "login"));
  }, []);

  return (
    <div className={containerClass}>
      <aside className="container-login-aside">
        <h1>AgroConecta</h1>
        <p>
          O AgroConecta aproxima quem produz, quem consome e quem transforma a
          agricultura em um futuro melhor.
        </p>
      </aside>

      <main className="container-login-main">
        {/* LOGIN */}
        <section
          id="box-login"
          className={isRegister ? "close" : "register-open"}
        >
          <LoginForm />
        </section>

        {/* CADASTRO */}
        <section
          id="box-register"
          className={isRegister ? "register-open" : "close"}
        >
          <RegisterForm />
        </section>

        {/* Link de alternância */}
        <section
          className="container-register"
          onClick={(e) => e.stopPropagation()}
        >
          <p id="toggle-text">
            {isRegister ? "Já tem uma conta? " : "Não tem uma conta? "}
            <a href="#" id="toggle-link" onClick={handleToggle}>
              {isRegister ? "Login" : "Cadastre-se"}
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
