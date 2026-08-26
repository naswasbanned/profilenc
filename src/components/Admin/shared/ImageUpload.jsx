import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

/**
 * ImageUpload — Click or drag-drop to upload an image.
 *
 * Props:
 *   value    — current image URL (string)
 *   onChange — (newUrl) => void
 *   token    — JWT auth token
 */
export default function ImageUpload({ value, onChange, token }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        setUploading(false);
        return;
      }

      onChange(data.url);
    } catch {
      setError('Upload failed. Check connection.');
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      upload(file);
    }
  };

  const handleFileSelect = (e) => {
    upload(e.target.files[0]);
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="image-upload-container">
      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" />
          <div className="image-upload-preview-actions">
            <button
              type="button"
              className="image-upload-remove"
              onClick={handleRemove}
              title="Remove image"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              className="image-upload-replace"
              onClick={() => inputRef.current?.click()}
              title="Replace image"
            >
              <Upload size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`image-upload-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <Loader2 size={24} className="spin" />
          ) : (
            <>
              <ImageIcon size={24} />
              <span>Click or drag image</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <div className="image-upload-error">{error}</div>}

      {/* Fallback: manual URL input */}
      <input
        type="text"
        className="admin-field-input image-upload-url-input"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL…"
      />
    </div>
  );
}
