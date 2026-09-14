import React from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getProductImageAdjustments = (product = {}) => ({
  zoom: clamp(Number(product.imageZoom ?? 1), 0.65, 2.2),
  x: clamp(Number(product.imageX ?? 0), -70, 70),
  y: clamp(Number(product.imageY ?? 0), -70, 70),
});

const ProductImage = ({
  product,
  src,
  alt = '',
  className = '',
  style = {},
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const { zoom, x, y } = getProductImageAdjustments(product);

  return (
    <img
      src={src || product?.image}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={className}
      style={{
        objectFit: 'contain',
        transform: `translate(${x}%, ${y}%) scale(${zoom})`,
        transformOrigin: 'center',
        transition: 'transform 0.28s ease',
        ...style,
      }}
      {...props}
    />
  );
};

export default ProductImage;
