import { useState } from "react";
import { maskDate } from "../utils/formatters";

export default function RegisterForm() {
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
    confpassword: "",
    nascimento: "",
    genre: "",
    pnumber: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    let v = value;
    if (name === "nascimento") v = maskDate(value);
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const { fullname, email, password, confpassword, pnumber, genre } = values;

    if (password !== confpassword) {
      alert("As senhas não são iguais.");
      return;
    }
    if (
      !fullname ||
      !email ||
      !password ||
      !confpassword ||
      !pnumber ||
      !genre
    ) {
      alert("Preencher todos os campos.");
      return;
    }

    // aqui você integraria com sua API; por enquanto apenas simula
    alert("Cadastro enviado!");
  }

  return (
    <form id="form-register" onSubmit={onSubmit}>
      <h3 className="tituloregister">Crie uma conta:</h3>
      <p className="textoregister">É rápido e fácil!</p>

      <div className="form-group">
        <label htmlFor="fullname">Nome completo</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={values.fullname}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input
          type="email"
          id="register-email"
          name="email"
          value={values.email}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group-password">
        <div className="form-group">
          <label htmlFor="register-password">Senha</label>
          <input
            type="password"
            id="register-password"
            name="password"
            value={values.password}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confpassword">Confirmar senha</label>
          <input
            type="password"
            id="confpassword"
            name="confpassword"
            value={values.confpassword}
            onChange={onChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nascimento">Data de nascimento</label>
        <input
          type="text"
          id="nascimento"
          name="nascimento"
          className="form-control"
          placeholder="dd/mm/aaaa"
          value={values.nascimento}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="genre">Gênero</label>
        <select
          className="genero"
          id="genre"
          name="genre"
          value={values.genre}
          onChange={onChange}
          required
        >
          <option value="" disabled>
            Selecione
          </option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
          <option value="não-informar">Prefiro não informar</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="pnumber">Celular</label>
        <input
          type="tel"
          id="pnumber"
          name="pnumber"
          value={values.pnumber}
          onChange={onChange}
          required
        />
      </div>

      <button className="button-register" type="submit">
        Cadastrar
      </button>
    </form>
  );
}
