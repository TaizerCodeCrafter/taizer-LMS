/**
 * Client-Side Smart Image Compressor
 * Resizes and optimizes images in-browser via off-screen HTML5 Canvas.
 * Reduces 5MB-15MB camera/high-res photos down to ~60KB - 150KB while
 * maintaining crisp retina display quality.
 */

export const compressImageFile = (
  file,
  {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.82,
    preferWebp = true
  } = {}
) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    // SVG vector graphics shouldn't be rasterized on canvas
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    // PDF documents cannot be rasterized on an image canvas; return raw data URL
    if (file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    // Check if browser supports Canvas & Image
    if (typeof window === "undefined" || !window.FileReader) {
      return reject(new Error("FileReader not supported in this environment"));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale proportionally if larger than maximum constraints
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const bestRatio = Math.min(widthRatio, heightRatio);

            width = Math.round(width * bestRatio);
            height = Math.round(height * bestRatio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d", { alpha: true });
          if (!ctx) {
            return resolve(readerEvent.target.result);
          }

          // High-quality downsampling interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Determine optimal output format
          let mimeType = "image/jpeg";

          if (file.type === "image/png" || file.type === "image/webp") {
            // Test if browser supports webp canvas export (retains alpha channel + high compression)
            mimeType = preferWebp ? "image/webp" : "image/png";
          }

          let dataUrl = canvas.toDataURL(mimeType, quality);

          // If webp is not supported or returns image/png fallback check
          if (preferWebp && !dataUrl.startsWith("data:image/webp") && file.type === "image/png") {
            dataUrl = canvas.toDataURL("image/png");
          }

          resolve(dataUrl);
        } catch (canvasErr) {
          console.warn("Canvas compression failed, falling back to original:", canvasErr);
          resolve(readerEvent.target.result);
        }
      };

      img.onerror = () => {
        console.warn("Image load failed for compression, using raw data url");
        resolve(readerEvent.target.result);
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Calculate approximate byte size of a Base64 data URL
 */
export const getDataUrlSizeKB = (dataUrl) => {
  if (!dataUrl || typeof dataUrl !== "string") return 0;
  if (!dataUrl.startsWith("data:")) return 0;
  const stringLength = dataUrl.length - (dataUrl.indexOf(",") + 1);
  const sizeInBytes = (stringLength * 3) / 4;
  return Math.round(sizeInBytes / 1024);
};
