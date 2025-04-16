import React from 'react';
import Image, { ImageProps } from 'next/image';

const CustomImage: React.FC<ImageProps> = (props) => {
  // Consider it an avatar if it's a small square image
  const isAvatar = props.width === props.height && Number(props.width) <= 100;

  if (isAvatar) {
    return (
      <Image
        width={props.width}
        height={props.height}
        className={props.className}
        src="/Images/anonymous.png"
        alt={props.alt || 'User avatar'}
        priority={true}
      />
    );
  }

  return <Image {...props} />;
};

export default CustomImage; 