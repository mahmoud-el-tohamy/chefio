"use client";
import Image from "next/image";
import React from "react";

interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
}

export default function Avatar({ src, alt = "Avatar", size = 40 }: AvatarProps) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "10%",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
