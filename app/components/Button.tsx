import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={className ? `${className} button` : "button"}
      style={{
        backgroundColor: "var(--primary-color)",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        border: "none",
        transition: "all 0.3s ease",
      }}
    >
      {text}
      <style jsx>{`
        .button:hover {
          background-color: #1fcc79;
          transform: scale(1.05);
        }
      `}</style>
    </button>
  );
};

export default Button;
