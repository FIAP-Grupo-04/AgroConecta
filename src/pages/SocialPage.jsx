import { useEffect, useMemo, useState, useCallback } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import PostList from "../components/PostList";
import NewPostModal from "../components/NewPostModal";
import "../styles/social-page.css";

export default function SocialPage() {
  const [topics, setTopics] = useState([]);
  const [posts, setPosts] = useState([]); // todos os posts
  const [query, setQuery] = useState(""); // busca
  const [topic, setTopic] = useState(""); // filtro por tópico
  const [openModal, setOpenModal] = useState(false);

  // carregar dados dos JSONs
  useEffect(() => {
    async function load() {
      const [tres, pres] = await Promise.all([
        fetch("/data/topics.json"),
        fetch("/data/social-posts.json"),
      ]);
      const t = await tres.json();
      const raw = await pres.json();

      const saved = JSON.parse(localStorage.getItem("social_likes") || "{}");

      const withIds = raw.map((p, idx) => {
        const id = p.id ?? String(idx); // usa do JSON ou índice
        const savedState = saved[id] || {};
        return {
          id,
          ...p,
          likes: p.likes ?? savedState.likes ?? 0,
          likedByMe: savedState.likedByMe ?? false,
        };
      });

      setTopics(Array.isArray(t) ? t : []);
      setPosts(withIds);
    }
    load();
  }, []);

  const toggleLike = useCallback((postId) => {
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== postId) return p;
        const likedByMe = !p.likedByMe;
        const likes = (p.likes || 0) + (likedByMe ? 1 : -1);
        return { ...p, likedByMe, likes };
      });
      // persiste só o necessário
      const store = next.reduce((acc, p) => {
        acc[p.id] = { likedByMe: p.likedByMe, likes: p.likes };
        return acc;
      }, {});
      localStorage.setItem("social_likes", JSON.stringify(store));
      return next;
    });
  }, []);

  // filtra posts por tópico + busca (conteúdo, autor, subtítulo ou tópicos)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const inTopic = !topic || (post.topics || "").includes(topic);
      if (!q) return inTopic;
      const content = (post.content || "").toLowerCase();
      const author = (post.authorName || "").toLowerCase();
      const subtitle = (post.authorSubtitle || "").toLowerCase();
      const topicsText = (post.topics || "").toLowerCase();
      const inSearch =
        content.includes(q) ||
        author.includes(q) ||
        subtitle.includes(q) ||
        topicsText.includes(q);
      return inTopic && inSearch;
    });
  }, [posts, query, topic]);

  const addPost = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const addComment = useCallback((idx, comment) => {
    setPosts((prev) =>
      prev.map((p, i) => {
        if (i !== idx) return p;
        const next = { ...p };
        const list = Array.isArray(next.coments) ? [...next.coments] : [];
        // remove placeholder vazio do JSON
        const cleaned = list.filter((c) => (c?.content || "").trim() !== "");
        cleaned.push(comment);
        next.coments = cleaned;
        return next;
      })
    );
  }, []);

  return (
    <div className="social-page-container">
      <Header username="Edson" />

      <main className="social-page-main">
        <aside className="social-page-cards">
          <button
            className="new-post-button"
            onClick={() => setOpenModal(true)}
          >
            <i className="fas fa-plus" /> Nova Publicação
          </button>

          <FilterBar
            topics={topics}
            topic={topic}
            onChangeTopic={setTopic}
            query={query}
            onChangeQuery={setQuery}
            onClear={() => setTopic("")}
          />
        </aside>

        <section className="social-page-section">
          {topic && (
            <div id="selected-topic-display">Tópico Selecionado: {topic}</div>
          )}

          <PostList
            posts={filtered}
            onAddComment={addComment}
            onClickTag={setTopic}
            onToggleLike={toggleLike}
          />
        </section>
      </main>

      <NewPostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onPublish={(data) => {
          addPost({
            authorName: "Edson",
            authorSubtitle: data.authorSubtitle,
            content: data.content,
            topics: data.topics,
            coments: [],
          });
          setOpenModal(false);
        }}
      />
    </div>
  );
}
