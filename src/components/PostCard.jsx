import { useMemo, useState } from "react";

export default function PostCard({
  index,
  authorName,
  authorSubtitle,
  content,
  topics = "",
  comments = [],
  onAddComment,
  onClickTag,
  id,
  likes = 0,
  likedByMe = false,
  onToggleLike,
  teste,
}) {
  const [value, setValue] = useState("");
  const tags = useMemo(
    () =>
      topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [topics]
  );

  function submit(e) {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    const now = new Date().toISOString().slice(0, 10);
    onAddComment(index, { name: "Edson", data: now, content: text });
    setValue("");
  }

  return (
    <article className="social-page-section-article">
      <div className="social-page-section-article-header">
        <img
          src="/images/circle-user.png"
          alt={authorName}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <strong className="social-page-section-article-header-name">
            {authorName}
          </strong>
          <br />
          <span className="social-page-section-article-header-name-subtitle">
            {authorSubtitle}
          </span>
        </div>
      </div>

      <div
        className="social-page-section-article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="topic-tags" data-topics={topics}>
        {tags.map((t) => (
          <span key={t} className="topic-tag" onClick={() => onClickTag?.(t)}>
            #{t}
          </span>
        ))}
      </div>

      <div
        className="post-actions"
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <button
          type="button"
          className={`like-button${likedByMe ? " liked" : ""}`}
          aria-pressed={likedByMe}
          onClick={() => onToggleLike?.(id)}
        >
          <i className={`fas fa-heart${likedByMe ? "" : "-o"}`} aria-hidden />
          <span>{likedByMe ? " Curtido" : " Curtir"}</span>
        </button>
        <span className="like-count" aria-live="polite">
          {likes}
        </span>
      </div>

      <div className="comments-section" id={`comments-section-${index}`}>
        <h4>Comentários</h4>
        <ul className="comments-list">
          {(comments || [])
            .filter((c) => (c?.content || "").trim() !== "")
            .map((c, i, arr) => (
              <li
                key={i}
                className={`comment-item${
                  i === arr.length - 1 ? " new-comment-highlight" : ""
                }`}
              >
                <div className="comment-header">
                  <span className="comment-author">{c.name}</span>
                  <span className="comment-date">{c.data}</span>
                </div>
                <div className="comment-content">{c.content}</div>
              </li>
            ))}
        </ul>
      </div>

      <form className="add-comment-form" onSubmit={submit}>
        <div className="add-comment-form-header">
          <textarea
            className="add-comment-form-textarea"
            name="content"
            placeholder="Escreva um comentário..."
            required
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit">Comentar</button>
      </form>
    </article>
  );
}
