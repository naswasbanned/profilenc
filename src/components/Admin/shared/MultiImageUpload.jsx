import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, ArrowLeft, ArrowRight, Plus } from 'lucide-react';

/**
 * MultiImageUpload — Upload and manage multiple images for experience, gallery, etc.
 *
 * Props:
 *   values   — array of image URLs (strings)
 *   onChange — (newUrlsArray) => void
 *   token    — JWT auth token
 */
export default function MultiImageUpload({ values = [], onChange, token }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const inputRef = useRef(null);

  const images = Array.isArray(values) ? values.filter(Boolean) : [];

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    const uploadedUrls = [];
    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (fileList.length === 0) {
      setError('Please select valid image files.');
      setUploading(false);
      return;
    }

    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/images', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          setError(data.error || 'One or more uploads failed');
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }
    } catch {
      setError('Upload failed. Please check connection and file size.');
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, idx) => idx !== index));
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  const handleAddManual = () => {
    const trimmed = manualUrl.trim();
    if (trimmed) {
      onChange([...images, trimmed]);
      setManualUrl('');
    }
  };

  return (
    <div className="multi-image-upload-container">
      {/* Upload Dropzone */}
      <div
        className={`image-upload-dropzone multi-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="multi-upload-progress">
            <Loader2 size={22} className="spin" />
            <span>Uploading images…</span>
          </div>
        ) : (
          <div className="multi-upload-prompt">
            <Upload size={20} />
            <span>Click or drag & drop images here (supports multiple)</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && <div className="image-upload-error">{error}</div>}

      {/* Thumbnails list */}
      {images.length > 0 && (
        <div className="multi-image-grid">
          {images.map((url, i) => (
            <div key={i} className="multi-image-card">
              <div className="multi-image-preview-wrapper">
                <img src={url} alt={`Upload ${i + 1}`} className="multi-image-thumb" />
                <div className="multi-image-actions">
                  {i > 0 && (
                    <button
                      type="button"
                      className="multi-image-btn move"
                      onClick={() => handleMove(i, i - 1)}
                      title="Move Left / Earlier"
                    >
                      <ArrowLeft size={12} />
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      className="multi-image-btn move"
                      onClick={() => handleMove(i, i + 1)}
                      title="Move Right / Later"
                    >
                      <ArrowRight size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="multi-image-btn delete"
                    onClick={() => handleRemove(i)}
                    title="Remove Image"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
              <input
                type="text"
                className="admin-field-input multi-image-url-input"
                value={url}
                onChange={(e) => {
                  const updated = [...images];
                  updated[i] = e.target.value;
                  onChange(updated);
                }}
                placeholder="Image URL"
              />
            </div>
          ))}
        </div>
      )}

      {/* Manual URL input adder */}
      <div className="multi-image-manual-row">
        <input
          type="text"
          className="admin-field-input"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddManual())}
          placeholder="Or paste external image URL and press Add…"
        />
        <button
          type="button"
          className="admin-url-add-btn"
          onClick={handleAddManual}
          style={{ marginTop: 0, height: '36px', whiteSpace: 'nowrap' }}
        >
          <Plus size={14} /> Add URL
        </button>
      </div>
    </div>
  );
}
