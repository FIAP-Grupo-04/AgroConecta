import { useEffect, useRef } from "react";

export default function NewPostModal({ open, onClose, onPublish }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      authorSubtitle: form["post-author-subtitle"].value,
      content: form["post-content"].value,
      topics: form["post-topics"].value,
    };
    if (!data.content) {
      alert("Conteúdo da Publicação é obrigatório!");
      return;
    }
    onPublish?.(data);
    form.reset();
  }

  return (
    <dialog id="new-post" ref={ref}>
      <h2>Criar Nova Publicação</h2>
      <form id="new-post-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="post-author-subtitle">Subtítulo do Autor:</label>
          <input
            type="text"
            id="post-author-subtitle"
            name="post-author-subtitle"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="post-content">Conteúdo da Publicação:</label>
          <textarea id="post-content" name="post-content" rows={8} required />
        </div>
        <div className="form-group">
          <label htmlFor="post-topics">Tópicos (separados por vírgula):</label>
          <input
            type="text"
            id="post-topics"
            name="post-topics"
            placeholder="Ex: Soja, Manejo de Solo"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="publish-post-button">
            Publicar
          </button>
          <button
            type="button"
            className="close-modal-button"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </form>
    </dialog>
  );
}
