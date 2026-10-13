import { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/api';
import LazyImageEditor from '../ImageEditor/LazyImageEditor';

/** Mirrors the server allowlist in server/src/middleware/upload.js. */
const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp,image/avif';

export default function ImageUploadPicker({
  value,
  onChange,
  label = 'Image',
  cropRatio = 'free',
  cropShape = 'rect',
  editorTheme,
  variant = 'editor',
}) {
  const isCard = variant === 'card';
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const uploadButtonRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [pendingFile, setPendingFile] = useState(null);

  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  // A picked file goes through the image editor first; the input is reset so
  // picking the same file again reopens it.
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) setPendingFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiFetch('/api/images', {
        method: 'POST',
        token: token || null,
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.url);
      setUrlInput(data.url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrlInput(newUrl);
    onChange(newUrl);
  };

  return (
    <div className={isCard ? 'card-upload' : 'editor-control'}>
      <label className={isCard ? 'journal-input-label' : undefined}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {value ? (
          <div className={isCard ? 'card-upload-thumb' : undefined} style={isCard ? undefined : { width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div className={isCard ? 'card-upload-thumb' : undefined} style={isCard ? undefined : { width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', flexShrink: 0 }}>
            <ImageIcon size={18} />
          </div>
        )}

        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="/uploads/my-image.webp or https://..."
          className={isCard ? 'journal-form-input' : 'editor-text-input'}
          style={{ flex: 1 }}
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={ACCEPTED_IMAGE_TYPES}
          style={{ display: 'none' }}
        />

        <button
          ref={uploadButtonRef}
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={isCard ? 'card-upload-btn' : 'editor-btn editor-btn-ghost'}
          style={isCard ? undefined : { padding: '8px 12px' }}
          title="Upload image from computer"
        >
          {uploading ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
        </button>
      </div>

      {pendingFile && (
        <LazyImageEditor
          file={pendingFile}
          recommendedRatio={cropRatio}
          cropShape={cropShape}
          editorTheme={editorTheme}
          returnFocusRef={uploadButtonRef}
          onConfirm={(f) => {
            setPendingFile(null);
            uploadFile(f);
          }}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </div>
  );
}
