import { useState } from "react";
import "../styles/contato.css";
import Header from "../components/Header";

export default function ContactPage() {
  const [values, setValues] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState([]);

  function onChange(e) {
    const { id, value } = e.target;
    setValues((v) => ({ ...v, [id]: value }));
  }

  function validate(v) {
    const errs = [];
    // Validações iguais às do validacaoForm.js
    // Nome
    if (!v.nome.trim()) {
      errs.push("O campo Nome é obrigatório.");
    } else if (v.nome.trim().split(" ").length < 2) {
      errs.push("Informe pelo menos um nome e um sobrenome.");
    }
    // Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v.email.trim()) {
      errs.push("O campo E-mail é obrigatório.");
    } else if (!regexEmail.test(v.email.trim())) {
      errs.push("Informe um e-mail válido.");
    }
    // Mensagem
    const msg = v.mensagem.trim();
    if (!msg) {
      errs.push("O campo Mensagem é obrigatório.");
    } else if (msg.length < 30 || msg.length > 500) {
      errs.push("A mensagem deve conter entre 30 e 500 caracteres.");
    }
    return errs;
  }

  function onSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (errs.length === 0) {
      alert("Formulário enviado com sucesso!");
      // aqui você pode chamar sua API; por ora só limpamos o form
      setValues({ nome: "", email: "", assunto: "", mensagem: "" });
    }
  }

  return (
    <>
      <Header username="Edson" />
      <div className="titulo">
        <h1>Fale Conosco</h1>
        <p>Tire suas dúvidas, envie sugestões ou fale com a nossa equipe</p>
      </div>

      {/* mantém IDs/classe para casar com seu CSS */}
      <form id="form-contato" onSubmit={onSubmit} noValidate>
        <div className="card-info">
          <div className="form-group">
            <input
              type="text"
              id="nome"
              placeholder="Nome completo"
              value={values.nome}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              value={values.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="assunto"
              placeholder="Assunto"
              value={values.assunto}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              id="mensagem"
              placeholder="Mensagem"
              rows={5}
              value={values.mensagem}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <button type="submit">Enviar</button>

        {/* mesmo elemento de erro do HTML original */}
        <div id="mensagem-erro" style={{ color: "red", marginTop: 10 }}>
          {errors.length > 0 && (
            <div dangerouslySetInnerHTML={{ __html: errors.join("<br>") }} />
          )}
        </div>
      </form>
    </>
  );
}
