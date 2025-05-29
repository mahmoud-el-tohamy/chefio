import React from "react";
import Link from "next/link";

interface LinkProps {
  href: string;
  text: string;
}

const CustomLink: React.FC<LinkProps> = ({ href, text }) => {
  return (
    <Link legacyBehavior href={href}>
      <a
        className="link"
        style={{ color: "#1FCC79", transition: "all 0.3s ease" }}
      >
        {text}
        <style jsx>{`
          .link:hover {
            color: #2fa040;
            text-decoration: underline;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default CustomLink;
