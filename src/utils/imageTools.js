const DEFAULT_MAX_SIDE = 900;
const DEFAULT_QUALITY = 0.78;

export const optimizeImageFile = (file, options = {}) => new Promise((resolve) => {
  if (!file) {
    resolve('');
    return;
  }

  const maxSide = options.maxSide || DEFAULT_MAX_SIDE;
  const quality = options.quality || DEFAULT_QUALITY;
  const reader = new FileReader();

  reader.onloadend = () => {
    const original = reader.result;
    const image = new window.Image();

    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    image.onerror = () => resolve(original);
    image.src = original;
  };

  reader.onerror = () => resolve('');
  reader.readAsDataURL(file);
});
