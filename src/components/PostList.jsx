import PostCard from "./PostCard";

export default function PostList({
  posts,
  onAddComment,
  onClickTag,
  onToggleLike,
}) {
  if (!posts.length)
    return <p style={{ color: "#666" }}>Nenhuma publicação encontrada.</p>;

  return (
    <>
      {posts.map((post, idx) => (
        <PostCard
          key={idx}
          id={post?.id}
          likes={post?.likes}
          likedByMe={post?.likedByMe}
          onToggleLike={onToggleLike}
          index={idx}
          authorName={post?.authorName}
          authorSubtitle={post?.authorSubtitle}
          content={post?.content}
          topics={post?.topics}
          comments={post?.coments}
          onAddComment={onAddComment}
          onClickTag={onClickTag}
        />
      ))}
    </>
  );
}
