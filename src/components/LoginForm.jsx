import { useState } from "react";

export default function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const { email, password } = values;
    // lógica original: redireciona se admin@admin.com / 123
    if (email === "admin@admin.com" && password === "123") {
      // se usar react-router, substitua por navigate('/dashboard')
      window.location.href = "/dashboard";
    } else {
      alert("Email ou senha inválidos");
    }
  }

  return (
    <form id="form-login" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={values.email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="login-password">Senha</label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={values.password}
          onChange={onChange}
          required
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
}
