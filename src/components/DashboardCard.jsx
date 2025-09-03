import React from "react";

export default function DashboardCard({
  imgSrc,
  title,
  text,
  onClick,
  disabled,
}) {
  const Tag = onClick && !disabled ? "button" : "button";
  const handle = () => {
    if (!disabled && onClick) onClick();
  };

  return (
    <div className="dashboard-card">
      <img src={imgSrc} alt={title} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Tag
        className={disabled ? "desactive" : undefined}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          handle();
        }}
        aria-disabled={disabled || undefined}
      >
        Acessar
      </Tag>
    </div>
  );
}
