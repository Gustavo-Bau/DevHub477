import { useCallback, useRef } from 'react';

export default function ImageUpload({ images, onChange }) {
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const nextImages = Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      onChange([...images, ...nextImages]);
    },
    [images, onChange],
  );

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files?.length) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        className="upload-dropzone"
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={(event) => {
            if (event.target.files?.length) handleFiles(event.target.files);
          }}
        />
        <p style={{ margin: 0, fontWeight: 700 }}>Arraste e solte imagens aqui</p>
        <p className="muted" style={{ margin: 0 }}>ou clique para selecionar arquivos</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={openFileDialog} style={{ marginTop: '0.85rem' }}>
          Selecionar imagens
        </button>
      </div>

      {images.length > 0 && (
        <div className="upload-preview-grid" style={{ marginTop: '1rem' }}>
          {images.map((image, index) => (
            <div key={image.id} className={`upload-thumb ${image.primary ? 'active' : ''}`}>
              <img src={image.previewUrl} alt={`Upload ${index + 1}`} />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(images.filter((item) => item.id !== image.id));
                }}
                aria-label="Remover imagem"
              >
                ×
              </button>
              {index === 0 && <span className="upload-badge">Imagem principal</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
