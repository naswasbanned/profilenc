import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import {
  X,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Star,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Code,
  Link2,
  Minus,
  Sparkles,
  Eye,
  PenTool,
  Clock,
  Layout,
  BookOpen,
  Video,
  Film,
} from 'lucide-react';
import ImageUploadPicker from './ImageUploadPicker';
import { TechIcon, POPULAR_TECH_PRESETS, resolveTechIcon } from '../../utils/techIconUtils';

export default function BlockEditorModal({
  block,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(block.data || {})));
  const [title, setTitle] = useState(block.title || '');
  const [subtitle, setSubtitle] = useState(block.subtitle || '');
  const [icon, setIcon] = useState(block.icon || 'default');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleItemChange = (idx, field, val) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, items };
    });
  };

  const handleAddItem = (defaultItem) => {
    setFormData((prev) => {
      const items = [...(prev.items || []), defaultItem];
      return { ...prev, items };
    });
    setExpandedIndex((formData.items?.length || 0));
  };

  const handleRemoveItem = (idx) => {
    setFormData((prev) => {
      const items = (prev.items || []).filter((_, i) => i !== idx);
      return { ...prev, items };
    });
  };

  const handleAddBullet = (itemIdx) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      const item = { ...(items[itemIdx] || {}) };
      const bullets = [...(item.bullets || []), ''];
      items[itemIdx] = { ...item, bullets };
      return { ...prev, items };
    });
  };

  const handleBulletChange = (itemIdx, bulletIdx, val) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      const item = { ...(items[itemIdx] || {}) };
      const bullets = [...(item.bullets || [])];
      bullets[bulletIdx] = val;
      items[itemIdx] = { ...item, bullets };
      return { ...prev, items };
    });
  };

  const handleRemoveBullet = (itemIdx, bulletIdx) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      const item = { ...(items[itemIdx] || {}) };
      const bullets = (item.bullets || []).filter((_, bIdx) => bIdx !== bulletIdx);
      items[itemIdx] = { ...item, bullets };
      return { ...prev, items };
    });
  };

  const handleAddAction = () => {
    setFormData((prev) => {
      const actions = [...(prev.actions || []), { label: 'Get in Touch', url: 'mailto:hello@example.com', primary: true }];
      return { ...prev, actions };
    });
  };

  const handleActionChange = (idx, field, val) => {
    setFormData((prev) => {
      const actions = [...(prev.actions || [])];
      actions[idx] = { ...actions[idx], [field]: val };
      return { ...prev, actions };
    });
  };

  const handleRemoveAction = (idx) => {
    setFormData((prev) => {
      const actions = (prev.actions || []).filter((_, i) => i !== idx);
      return { ...prev, actions };
    });
  };

  const handleAddSocial = () => {
    setFormData((prev) => {
      const socials = [...(prev.socials || []), { platform: 'Github', label: 'GitHub', url: 'https://github.com' }];
      return { ...prev, socials };
    });
  };

  const handleSocialChange = (idx, field, val) => {
    setFormData((prev) => {
      const socials = [...(prev.socials || [])];
      socials[idx] = { ...socials[idx], [field]: val };
      return { ...prev, socials };
    });
  };

  const handleRemoveSocial = (idx) => {
    setFormData((prev) => {
      const socials = (prev.socials || []).filter((_, i) => i !== idx);
      return { ...prev, socials };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...block,
      title,
      subtitle,
      icon,
      data: formData,
    });
    onClose();
  };

  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  return (
    <div className="editor-modal-backdrop" onClick={handleBackdropClick}>
      {hintVisible && (
        <div className="modal-double-click-hint">
          <span>Click once more outside to close (or use ✕)</span>
        </div>
      )}
      <motion.div
        className="editor-modal-dialog modal-lg"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="editor-modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
              Edit {block.type?.replace('_', ' ')} Block
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Customize content, alignments, and items visually
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="editor-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Common Section Header (for non-hero blocks) */}
            {block.type !== 'hero' && (
              <div className="editor-form-grid-3">
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Section Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Featured Projects"
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  />
                </div>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Subtitle (optional)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Selected client works"
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  />
                </div>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Section Icon / Logo</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="editor-select"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  >
                    <option value="default">Default Icon (Auto)</option>
                    <option value="none">No Icon (Just Text)</option>
                    <option value="Sparkles">Sparkles ✨</option>
                    <option value="Code2">Code & Dev 💻</option>
                    <option value="Briefcase">Briefcase / Career 💼</option>
                    <option value="Layers">Layers / Cards 🗂️</option>
                    <option value="Cpu">CPU / Hardware ⚙️</option>
                    <option value="Gamepad2">Gamepad / Gaming 🎮</option>
                    <option value="BookOpen">Book / Journal 📖</option>
                    <option value="Film">Film / Cinema 🎬</option>
                    <option value="Music">Music / Audio 🎵</option>
                    <option value="Star">Star / Highlights ⭐</option>
                    <option value="Heart">Heart / Favorites ❤️</option>
                    <option value="Zap">Zap / Energy ⚡</option>
                    <option value="Globe">Globe / Web 🌐</option>
                    <option value="Award">Award / Achievements 🏆</option>
                    <option value="Terminal">Terminal / CLI &gt;_</option>
                    <option value="Folder">Folder / Projects 📁</option>
                    <option value="Coffee">Coffee / Life ☕</option>
                    <option value="Shield">Shield / Security 🛡️</option>
                    <option value="Activity">Activity / Stats 📊</option>
                    <option value="Flame">Flame / Trending 🔥</option>
                    <option value="Rocket">Rocket / Launch 🚀</option>
                  </select>
                </div>
              </div>
            )}

            {/* --- HERO FORM --- */}
            {block.type === 'hero' && (
              <>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Hero Layout & Alignment</label>
                  <select
                    value={formData.align || 'center'}
                    onChange={(e) => handleFieldChange('align', e.target.value)}
                    className="editor-select"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  >
                    <option value="center">Middle (Centered Avatar, Text & Buttons)</option>
                    <option value="left">Left Aligned (Avatar, Text & Buttons on Left)</option>
                    <option value="right">Right Aligned (Avatar, Text & Buttons on Right)</option>
                    <option value="split-left">Split Layout (Avatar on Left Side, Bio & CTAs on Right)</option>
                    <option value="split-right">Split Layout (Bio & CTAs on Left Side, Avatar on Right)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="editor-control">
                    <label style={{ color: '#e2e8f0' }}>Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Alex Rivers"
                      className="editor-text-input full-width"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                      required
                    />
                  </div>
                  <div className="editor-control">
                    <label style={{ color: '#e2e8f0' }}>Tagline / Role</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => handleFieldChange('tagline', e.target.value)}
                      placeholder="e.g. Full-Stack Engineer"
                      className="editor-text-input full-width"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    />
                  </div>
                </div>

                <ImageUploadPicker
                  label="Avatar Image"
                  value={formData.avatarUrl || ''}
                  onChange={(url) => handleFieldChange('avatarUrl', url)}
                />

                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Status Pill Badge (optional)</label>
                  <input
                    type="text"
                    value={formData.statusBadge || ''}
                    onChange={(e) => handleFieldChange('statusBadge', e.target.value)}
                    placeholder="e.g. Available for Freelance"
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  />
                </div>

                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Bio / Summary</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    placeholder="Brief description about yourself..."
                    className="editor-text-input full-width"
                    rows={3}
                    style={{ resize: 'vertical', color: '#f1f5f9', background: '#06070a' }}
                  />
                </div>

                {/* Action Buttons (Get in Touch / Contact / Links) */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                      Action & Contact Buttons ({(formData.actions || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="editor-btn"
                      style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '5px 12px', fontSize: '0.78rem' }}
                    >
                      <Plus size={13} /> Add Action Button
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.actions || []).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="editor-form-row-action"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: '#06070a',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <input
                          type="text"
                          value={act.label || ''}
                          onChange={(e) => handleActionChange(aIdx, 'label', e.target.value)}
                          placeholder="Button Label (e.g. Get in Touch)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={act.url || ''}
                          onChange={(e) => handleActionChange(aIdx, 'url', e.target.value)}
                          placeholder="URL / Email (e.g. mailto:...)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleActionChange(aIdx, 'primary', !act.primary)}
                          className={`editor-btn ${act.primary ? 'editor-btn-save' : 'editor-btn-ghost'}`}
                          style={{ fontSize: '0.75rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
                          title="Toggle highlighted primary button styling"
                        >
                          {act.primary ? 'Primary' : 'Secondary'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAction(aIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete button"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social & Profile Links */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                      Social & Profile Links ({(formData.socials || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="editor-btn"
                      style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '5px 12px', fontSize: '0.78rem' }}
                    >
                      <Plus size={13} /> Add Social Link
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.socials || []).map((soc, sIdx) => (
                      <div
                        key={sIdx}
                        className="editor-form-row-social"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: '#06070a',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <select
                          value={soc.platform || 'Github'}
                          onChange={(e) => handleSocialChange(sIdx, 'platform', e.target.value)}
                          className="editor-select full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        >
                          <option value="Github">GitHub</option>
                          <option value="Linkedin">LinkedIn</option>
                          <option value="Twitter">Twitter / X</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Youtube">YouTube</option>
                          <option value="Mail">Email</option>
                          <option value="Globe">Website / Link</option>
                        </select>
                        <input
                          type="text"
                          value={soc.label || ''}
                          onChange={(e) => handleSocialChange(sIdx, 'label', e.target.value)}
                          placeholder="Label (e.g. GitHub)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={soc.url || ''}
                          onChange={(e) => handleSocialChange(sIdx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(sIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* --- SERVICES / COMMISSION FORM --- */}
            {(block.type === 'services' || block.type === 'commission') && (
              <>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Grid Columns</label>
                  <select
                    value={formData.columns || 2}
                    onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                    className="editor-select"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  >
                    <option value={1}>1 Column (Full Width Stack)</option>
                    <option value={2}>2 Columns (Recommended)</option>
                    <option value={3}>3 Columns (Compact Tiers)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                    Services & Commission Tiers ({(formData.items || []).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        id: `svc-${Date.now()}`,
                        title: 'New Service',
                        price: '$500',
                        period: 'project',
                        status: 'Available',
                        deliveryTime: '1-2 weeks',
                        featured: false,
                        description: 'Clear description of the service deliverables and scope.',
                        features: ['High quality delivery', 'Revisions included', 'Commercial usage'],
                        ctaLabel: 'Book Service',
                        ctaUrl: 'mailto:hello@example.com',
                      })
                    }
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Service Tier
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((svc, idx) => (
                    <div
                      key={idx}
                      style={{
                        borderRadius: '10px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Tier #{idx + 1}: {svc.title || 'Untitled Tier'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleItemChange(idx, 'featured', !svc.featured)}
                            className={`editor-btn ${svc.featured ? 'editor-btn-save' : 'editor-btn-ghost'}`}
                            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          >
                            {svc.featured ? '★ Featured Tier' : 'Make Featured'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Service Name</label>
                          <input
                            type="text"
                            value={svc.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Full-Stack Web App"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Price</label>
                          <input
                            type="text"
                            value={svc.price || ''}
                            onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                            placeholder="e.g. $1,200 or $50/hr"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Billing Period</label>
                          <input
                            type="text"
                            value={svc.period || ''}
                            onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                            placeholder="e.g. project / mo / hr"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Availability / Status</label>
                          <input
                            type="text"
                            value={svc.status || ''}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            placeholder="e.g. Available / 2 Slots Left"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Delivery / Turnaround</label>
                          <input
                            type="text"
                            value={svc.deliveryTime || ''}
                            onChange={(e) => handleItemChange(idx, 'deliveryTime', e.target.value)}
                            placeholder="e.g. 1-2 weeks"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <ImageUploadPicker
                        label="Service Sample / Preview Image (Optional)"
                        value={svc.imageUrl || svc.coverUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'imageUrl', url)}
                      />

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Service Description</label>
                        <textarea
                          value={svc.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="What this service covers..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          rows={2}
                        />
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Included Deliverables / Features (one per line)</label>
                        <textarea
                          value={Array.isArray(svc.features) ? svc.features.join('\n') : svc.features || ''}
                          onChange={(e) => handleItemChange(idx, 'features', e.target.value.split('\n'))}
                          placeholder="✓ Responsive UI Design&#10;✓ Frontend & Backend Integration&#10;✓ Free 14-day Support"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          rows={3}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Button Label</label>
                          <input
                            type="text"
                            value={svc.ctaLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'ctaLabel', e.target.value)}
                            placeholder="e.g. Book Commission"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Button Link / Action</label>
                          <input
                            type="text"
                            value={svc.ctaUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'ctaUrl', e.target.value)}
                            placeholder="mailto:you@example.com or URL"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- CARDS GRID FORM --- */}
            {block.type === 'cards_grid' && (
              <>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Grid Columns</label>
                  <select
                    value={formData.columns || 2}
                    onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                    className="editor-select"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                  >
                    <option value={1}>1 Column (Stack)</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Cards ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ id: `card-${Date.now()}`, title: 'New Card', description: '', badge: '', tags: [], linkUrl: '', actionLabel: 'View' })}
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Card
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(formData.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="editor-item-card"
                    >
                      <div className="editor-item-card-header">
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Card #{idx + 1}: {item.title || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="editor-form-row-2">
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="Card Title"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => handleItemChange(idx, 'badge', e.target.value)}
                          placeholder="Badge (e.g. Featured)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>

                      <ImageUploadPicker
                        label="Card Thumbnail Image"
                        value={item.image || item.imageUrl || item.coverImage || ''}
                        onChange={(url) => {
                          handleItemChange(idx, 'image', url);
                          handleItemChange(idx, 'imageUrl', url);
                        }}
                      />

                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Description..."
                        className="editor-text-input full-width"
                        style={{ color: '#f1f5f9', background: '#06070a' }}
                        rows={2}
                      />

                      <input
                        type="text"
                        value={Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''}
                        onChange={(e) => handleItemChange(idx, 'tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                        placeholder="Tags (comma separated, e.g. React, Node.js)"
                        className="editor-text-input full-width"
                        style={{ color: '#f1f5f9', background: '#06070a' }}
                      />

                      <div className="editor-form-row-2">
                        <input
                          type="text"
                          value={item.linkUrl || ''}
                          onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                          placeholder="Link URL (https://...)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={item.actionLabel || ''}
                          onChange={(e) => handleItemChange(idx, 'actionLabel', e.target.value)}
                          placeholder="Button Label (e.g. View Project)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- SKILLS FORM --- */}
            {block.type === 'skills' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, margin: 0 }}>
                      Skills & Tech Stack Badges ({(formData.items || []).length})
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Auto-detects official brand icons for Go, Next.js, React, Rust, Python, Docker, and any tech stack.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ name: 'Go', category: 'Backend', tier: 'Proficient', color: '#00ADD8', icon: 'go' })}
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Skill Badge
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(formData.items || []).map((skill, idx) => {
                    const resolved = resolveTechIcon(skill.name, skill.icon, skill.color);
                    return (
                      <div
                        key={idx}
                        style={{
                          borderRadius: '10px',
                          background: '#06070a',
                          border: '1px solid rgba(255,255,255,0.08)',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <TechIcon
                                name={skill.name}
                                icon={skill.icon}
                                color={skill.color || '#00f0aa'}
                                size={18}
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', display: 'block' }}>
                                {skill.name || 'Untitled Skill'}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                Icon: {resolved.slug || 'auto-match'} {skill.category ? `• ${skill.category}` : ''}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="color"
                              value={skill.color || resolved.color || '#00f0aa'}
                              onChange={(e) => handleItemChange(idx, 'color', e.target.value)}
                              title="Badge Theme Color"
                              style={{ width: '30px', height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.2fr 1fr', gap: '8px' }}>
                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.72rem', marginBottom: '3px', display: 'block' }}>Tech / Skill Name</label>
                            <input
                              type="text"
                              value={skill.name || ''}
                              onChange={(e) => {
                                const newName = e.target.value;
                                handleItemChange(idx, 'name', newName);
                                // Auto-fill matching brand color if current color is default or unchanged
                                const match = POPULAR_TECH_PRESETS.find((p) => p.name.toLowerCase() === newName.trim().toLowerCase());
                                if (match && (!skill.color || skill.color === '#00f0aa' || skill.color === '#00d4ff')) {
                                  handleItemChange(idx, 'color', match.color);
                                }
                              }}
                              placeholder="e.g. Go, Next.js, Rust"
                              className="editor-text-input full-width"
                              style={{ color: '#f1f5f9', background: '#090a0f' }}
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.72rem', marginBottom: '3px', display: 'block' }}>Category</label>
                            <input
                              type="text"
                              value={skill.category || ''}
                              onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                              placeholder="e.g. Languages, Frontend"
                              className="editor-text-input full-width"
                              style={{ color: '#f1f5f9', background: '#090a0f' }}
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.72rem', marginBottom: '3px', display: 'block' }}>Badge Icon</label>
                            <select
                              value={skill.icon || ''}
                              onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                              className="editor-select full-width"
                              style={{ color: '#f1f5f9', background: '#090a0f' }}
                            >
                              <option value="">Auto-Detect ({resolved.slug || 'brand'})</option>
                              <optgroup label="Popular Languages">
                                <option value="go">Go / Golang</option>
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="rust">Rust</option>
                                <option value="cplusplus">C++</option>
                                <option value="csharp">C#</option>
                                <option value="php">PHP</option>
                                <option value="openjdk">Java</option>
                                <option value="kotlin">Kotlin</option>
                                <option value="swift">Swift</option>
                                <option value="dart">Dart</option>
                                <option value="ruby">Ruby</option>
                              </optgroup>
                              <optgroup label="Frameworks & Frontend">
                                <option value="nextdotjs">Next.js</option>
                                <option value="react">React</option>
                                <option value="vuedotjs">Vue.js</option>
                                <option value="svelte">Svelte</option>
                                <option value="angular">Angular</option>
                                <option value="astro">Astro</option>
                                <option value="tailwindcss">Tailwind CSS</option>
                                <option value="bootstrap">Bootstrap</option>
                                <option value="html5">HTML5</option>
                                <option value="css3">CSS3</option>
                              </optgroup>
                              <optgroup label="Backend & Cloud">
                                <option value="nodedotjs">Node.js</option>
                                <option value="bun">Bun</option>
                                <option value="laravel">Laravel</option>
                                <option value="django">Django</option>
                                <option value="fastapi">FastAPI</option>
                                <option value="springboot">Spring Boot</option>
                                <option value="docker">Docker</option>
                                <option value="kubernetes">Kubernetes</option>
                                <option value="amazonwebservices">AWS</option>
                                <option value="googlecloud">Google Cloud</option>
                                <option value="linux">Linux</option>
                              </optgroup>
                              <optgroup label="Databases">
                                <option value="postgresql">PostgreSQL</option>
                                <option value="mysql">MySQL</option>
                                <option value="mongodb">MongoDB</option>
                                <option value="redis">Redis</option>
                                <option value="supabase">Supabase</option>
                                <option value="firebase">Firebase</option>
                              </optgroup>
                              <optgroup label="Creative & Mobile">
                                <option value="flutter">Flutter</option>
                                <option value="figma">Figma</option>
                                <option value="blender">Blender</option>
                                <option value="unity">Unity</option>
                                <option value="unrealengine">Unreal Engine</option>
                              </optgroup>
                            </select>
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ color: '#cbd5e1', fontSize: '0.72rem', marginBottom: '3px', display: 'block' }}>Proficiency</label>
                            <select
                              value={skill.tier || 'Proficient'}
                              onChange={(e) => handleItemChange(idx, 'tier', e.target.value)}
                              className="editor-select full-width"
                              style={{ color: '#f1f5f9', background: '#090a0f' }}
                            >
                              <option value="Expert">Expert</option>
                              <option value="Proficient">Proficient</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Beginner">Beginner</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* --- TIMELINE FORM --- */}
            {block.type === 'timeline' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Timeline Items ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        id: `item-${Date.now()}`,
                        role: 'Role / Milestone Title',
                        company: 'Company or Institution',
                        location: 'Remote',
                        period: '2023 - Present',
                        description: 'Summary of the role, project, or milestone.',
                        bullets: [
                          'Key achievement or responsibility point',
                        ],
                        images: [],
                        tags: [],
                      })
                    }
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Timeline Item
                  </button>
                </div>

                {(formData.items || []).length === 0 && (
                  <div
                    style={{
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: '#06070a',
                      borderRadius: '10px',
                      border: '1px dashed rgba(255,255,255,0.12)',
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 14px' }}>
                      No timeline entries yet. Add your first career, project, or education milestone.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddItem({
                          id: `item-${Date.now()}`,
                          role: 'Software Engineer',
                          company: 'Company / Project',
                          location: 'Remote',
                          period: '2023 - Present',
                          description: 'Description of key deliverables and milestones.',
                          bullets: ['Built core features', 'Improved performance'],
                          images: [],
                          tags: ['React'],
                        })
                      }
                      className="editor-btn editor-btn-save"
                      style={{ padding: '8px 18px', margin: '0 auto' }}
                    >
                      <Plus size={15} /> Add First Timeline Entry
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        borderRadius: '10px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                          Timeline Entry #{idx + 1}: {item.role || item.title || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete timeline item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Role & Company Inputs */}
                      <div className="editor-form-row-2">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Role / Milestone Title</label>
                          <input
                            type="text"
                            value={item.role || item.title || ''}
                            onChange={(e) => {
                              handleItemChange(idx, 'role', e.target.value);
                              handleItemChange(idx, 'title', e.target.value);
                            }}
                            placeholder="e.g. Senior Software Engineer"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#090a0f' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Company / Organization</label>
                          <input
                            type="text"
                            value={item.company || ''}
                            onChange={(e) => handleItemChange(idx, 'company', e.target.value)}
                            placeholder="e.g. Acme Labs"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#090a0f' }}
                          />
                        </div>
                      </div>

                      {/* Period & Location Inputs */}
                      <div className="editor-form-row-2">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Period / Date</label>
                          <input
                            type="text"
                            value={item.period || ''}
                            onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                            placeholder="e.g. 2022 - Present / Oct 2023"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#090a0f' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Location / Mode (optional)</label>
                          <input
                            type="text"
                            value={item.location || ''}
                            onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                            placeholder="e.g. Remote / New York, NY"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#090a0f' }}
                          />
                        </div>
                      </div>

                      {/* Summary Description */}
                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Overview Description</label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Brief summary of your responsibilities or milestone context..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#090a0f' }}
                          rows={2}
                        />
                      </div>

                      {/* --- TIMELINE POINTS / BULLETS LIST --- */}
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f0aa' }}>
                            Timeline Points & Key Achievements ({(item.bullets || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddBullet(idx)}
                            className="editor-btn"
                            style={{
                              background: 'rgba(0, 240, 170, 0.12)',
                              color: '#00f0aa',
                              border: '1px solid rgba(0,240,170,0.3)',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Plus size={13} /> Add Point
                          </button>
                        </div>

                        {(item.bullets || []).length === 0 ? (
                          <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic', padding: '4px 0' }}>
                            No bullet points yet. Click "+ Add Point" to add specific responsibilities or achievements.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(item.bullets || []).map((bullet, bIdx) => (
                              <div
                                key={bIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#00f0aa', fontWeight: 800, fontSize: '0.9rem', userSelect: 'none' }}>•</span>
                                <input
                                  type="text"
                                  value={typeof bullet === 'string' ? bullet : ''}
                                  onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                                  placeholder={`Achievement / Timeline Point #${bIdx + 1}`}
                                  className="editor-text-input full-width"
                                  style={{ color: '#f1f5f9', background: '#090a0f', fontSize: '0.82rem' }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBullet(idx, bIdx)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                  title="Delete point"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Multiple Milestone Photos / Work Samples */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
                            Milestone Photos & Work Samples ({((Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : [])).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentImages = Array.isArray(item.images) ? [...item.images] : item.imageUrl ? [item.imageUrl] : [];
                              handleItemChange(idx, 'images', [...currentImages, '']);
                            }}
                            className="editor-btn"
                            style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            <Plus size={12} /> Add Photo
                          </button>
                        </div>

                        {((Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : [])).map((img, iIdx) => (
                          <div
                            key={iIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px',
                              borderRadius: '6px',
                              background: '#090a0f',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <ImageUploadPicker
                              label={`Photo #${iIdx + 1}`}
                              value={typeof img === 'string' ? img : img.src || ''}
                              onChange={(url) => {
                                const currentImages = Array.isArray(item.images) ? [...item.images] : item.imageUrl ? [item.imageUrl] : [];
                                currentImages[iIdx] = url;
                                handleItemChange(idx, 'images', currentImages);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentImages = (Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : []).filter((_, i) => i !== iIdx);
                                handleItemChange(idx, 'images', currentImages);
                              }}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '18px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Tags / Tech Used</label>
                        <input
                          type="text"
                          value={Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''}
                          onChange={(e) => handleItemChange(idx, 'tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                          placeholder="Tags (comma separated, e.g. React, TypeScript, Docker)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#090a0f' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- MEDIA REVIEWS FORM --- */}
            {block.type === 'media_reviews' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Review Items ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ id: `rev-${Date.now()}`, title: 'Title', rating: 5, status: 'Completed', notes: '', genre: '' })}
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Review Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(formData.items || []).map((rev, idx) => (
                    <div
                      key={idx}
                      className="editor-item-card"
                    >
                      <div className="editor-item-card-header">
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Review #{idx + 1}: {rev.title || 'Untitled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Media Title</label>
                        <input
                          type="text"
                          value={rev.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Cyberpunk 2077 / Interstellar"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>

                      <div className="editor-form-row-3">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Genre / Badge</label>
                          <input
                            type="text"
                            value={Array.isArray(rev.genre) ? rev.genre.join(', ') : rev.genre || ''}
                            onChange={(e) => handleItemChange(idx, 'genre', e.target.value)}
                            placeholder="e.g. Action RPG"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Rating</label>
                          <select
                            value={rev.rating || 5}
                            onChange={(e) => handleItemChange(idx, 'rating', Number(e.target.value))}
                            className="editor-select full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>
                            ))}
                          </select>
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Status</label>
                          <input
                            type="text"
                            value={rev.status || ''}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            placeholder="e.g. Completed"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <ImageUploadPicker
                        label="Media Cover Image"
                        value={rev.coverImage || rev.imageUrl || rev.image || ''}
                        onChange={(url) => {
                          handleItemChange(idx, 'coverImage', url);
                          handleItemChange(idx, 'imageUrl', url);
                          handleItemChange(idx, 'image', url);
                        }}
                      />

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.78rem', marginBottom: '4px', display: 'block' }}>Review Notes</label>
                        <textarea
                          value={rev.notes || ''}
                          onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                          placeholder="Review / Notes..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- SPECS GRID FORM --- */}
            {block.type === 'specs_grid' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Specs & Gear ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ category: 'Category', name: 'Item Name', detail: '', icon: 'Cpu' })}
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Spec Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(formData.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="editor-item-card"
                    >
                      <div className="editor-item-card-header">
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                          Spec #{idx + 1}: {item.category || 'Hardware'} - {item.name || 'Component'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete spec item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="editor-form-row-3">
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                          placeholder="Category (e.g. GPU)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={item.name || ''}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          placeholder="Name (e.g. RTX 4060)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                        <input
                          type="text"
                          value={item.detail || ''}
                          onChange={(e) => handleItemChange(idx, 'detail', e.target.value)}
                          placeholder="Detail (e.g. 8GB GDDR6)"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- JOURNAL FORM --- */}
            {block.type === 'journal' && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  background: 'rgba(0, 240, 170, 0.05)',
                  border: '1px solid rgba(0, 240, 170, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0aa', fontWeight: 600, fontSize: '0.9rem' }}>
                  <BookOpen size={16} /> Journal & Articles Management
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  Journal entries are managed directly on the profile canvas. Use the <strong>"+ Quick Add Entry"</strong> button and entry card actions on the Journal block in your profile editor to write, edit, or delete articles.
                </p>
              </div>
            )}

            {/* --- STACKED DECK FORM --- */}
            {block.type === 'stacked_deck' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Deck Images ({(formData.images || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const images = [...(formData.images || []), '/images/projects/template.png'];
                      handleFieldChange('images', images);
                    }}
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Image
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(formData.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <ImageUploadPicker
                        label={`Image #${idx + 1}`}
                        value={typeof img === 'string' ? img : img.src}
                        onChange={(url) => {
                          const images = [...(formData.images || [])];
                          images[idx] = url;
                          handleFieldChange('images', images);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const images = (formData.images || []).filter((_, i) => i !== idx);
                          handleFieldChange('images', images);
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '20px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- GALLERY FORM --- */}
            {block.type === 'gallery' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Grid Columns</label>
                    <select
                      value={formData.columns || 3}
                      onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value={2}>2 Columns (Large Cards)</option>
                      <option value={3}>3 Columns (Balanced Grid)</option>
                      <option value={4}>4 Columns (Compact Grid)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Photo Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || 'square'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value="square">Square (1:1)</option>
                      <option value="wide">Landscape / Wide (16:10)</option>
                      <option value="tall">Portrait / Tall (4:5)</option>
                      <option value="natural">Natural Aspect Ratio</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                    Gallery Photos ({(formData.items || []).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        id: `photo-${Date.now()}`,
                        src: '/images/projects/template.png',
                        title: 'New Photo',
                        caption: '',
                        description: '',
                        location: '',
                        date: '',
                        tag: '',
                      })
                    }
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Photo
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      style={{
                        borderRadius: '10px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Photo #{idx + 1}: {photo.title || 'Untitled Photo'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <ImageUploadPicker
                        label="Photo Image"
                        value={typeof photo === 'string' ? photo : photo.src || photo.url || photo.imageUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'src', url)}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Photo Title / Name</label>
                          <input
                            type="text"
                            value={photo.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Kyoto Sunset"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Tag / Category</label>
                          <input
                            type="text"
                            value={photo.tag || ''}
                            onChange={(e) => handleItemChange(idx, 'tag', e.target.value)}
                            placeholder="e.g. Photography / 3D Art"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Location (optional)</label>
                          <input
                            type="text"
                            value={photo.location || ''}
                            onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                            placeholder="e.g. Tokyo, Japan"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Date / Year (optional)</label>
                          <input
                            type="text"
                            value={photo.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="e.g. 2026 or Oct 2025"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Description (shown in full photo modal)</label>
                        <textarea
                          value={photo.description || photo.caption || ''}
                          onChange={(e) => {
                            handleItemChange(idx, 'description', e.target.value);
                            handleItemChange(idx, 'caption', e.target.value);
                          }}
                          placeholder="Photo background story, camera settings, or notes..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          rows={2}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Link Label</label>
                          <input
                            type="text"
                            value={photo.linkLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'linkLabel', e.target.value)}
                            placeholder="e.g. View on Unsplash"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Link URL (optional)</label>
                          <input
                            type="text"
                            value={photo.linkUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                            placeholder="https://..."
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- EVENTS / CALENDAR FORM --- */}
            {(block.type === 'events' || block.type === 'calendar') && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Default View</label>
                    <select
                      value={formData.defaultView || 'list'}
                      onChange={(e) => handleFieldChange('defaultView', e.target.value)}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value="list">Schedule Feed (Timeline List)</option>
                      <option value="calendar">Monthly Calendar View</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Show Filter Tabs</label>
                    <select
                      value={formData.showFilters !== false ? 'yes' : 'no'}
                      onChange={(e) => handleFieldChange('showFilters', e.target.value === 'yes')}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value="yes">Yes (All / Upcoming / Live / Past)</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                    Events & Streams ({(formData.items || []).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        id: `evt-${Date.now()}`,
                        title: 'New Event / Stream',
                        date: new Date().toISOString().split('T')[0],
                        startTime: '19:00',
                        endTime: '21:00',
                        time: '19:00 - 21:00 UTC',
                        platform: 'Online Stream',
                        location: 'Twitch / YouTube',
                        type: 'Stream',
                        status: 'Upcoming',
                        description: 'Event agenda summary and key discussion points.',
                        topics: ['Design', 'Coding'],
                        linkLabel: 'Join Event',
                        linkUrl: 'https://twitch.tv',
                      })
                    }
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Event
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      style={{
                        borderRadius: '10px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Event #{idx + 1}: {evt.title || 'Untitled Event'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Event Title</label>
                        <input
                          type="text"
                          value={evt.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Live Coding: Profile Architecture"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Event Date (YYYY-MM-DD)</label>
                          <input
                            type="text"
                            value={evt.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="2026-08-28"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Time String</label>
                          <input
                            type="text"
                            value={evt.time || ''}
                            onChange={(e) => handleItemChange(idx, 'time', e.target.value)}
                            placeholder="19:00 - 21:00 UTC"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Status Pill</label>
                          <select
                            value={evt.status || 'Upcoming'}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            className="editor-select"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Live Now">🔴 Live Now</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Sold Out">Sold Out</option>
                            <option value="Completed / Past">Completed / Past</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Event Type</label>
                          <select
                            value={evt.type || 'Stream'}
                            onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                            className="editor-select"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          >
                            <option value="Stream">Live Stream</option>
                            <option value="Meetup">Meetup / Community</option>
                            <option value="Conference">Conference / Keynote</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Launch">Product Launch</option>
                          </select>
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Location / Streaming Platform</label>
                          <input
                            type="text"
                            value={evt.location || evt.platform || ''}
                            onChange={(e) => {
                              handleItemChange(idx, 'location', e.target.value);
                              handleItemChange(idx, 'platform', e.target.value);
                            }}
                            placeholder="e.g. Twitch / YouTube or San Francisco, CA"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Event Description / Agenda</label>
                        <textarea
                          value={evt.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="What will happen during this event..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          rows={2}
                        />
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Topics / Tags (comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(evt.topics) ? evt.topics.join(', ') : evt.topics || ''}
                          onChange={(e) => handleItemChange(idx, 'topics', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                          placeholder="React, CSS, Frontend"
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Button Label</label>
                          <input
                            type="text"
                            value={evt.linkLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'linkLabel', e.target.value)}
                            placeholder="e.g. Watch Stream / RSVP"
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Button URL</label>
                          <input
                            type="text"
                            value={evt.linkUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                            placeholder="https://..."
                            className="editor-text-input"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- FEATURED VIDEO FORM --- */}
            {(block.type === 'featured_video' || block.type === 'video') && (
              <>
                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Video URL (YouTube, Vimeo, Streamable, Loom, or Direct MP4/WebM)</label>
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/... or /uploads/..."
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    Supports standard YouTube links, Shorts, Vimeo, Streamable, Loom, or uploaded video URLs.
                  </span>
                </div>

                <ImageUploadPicker
                  label="Custom Video Poster / Cover Image (Optional)"
                  value={formData.posterUrl || ''}
                  onChange={(url) => handleFieldChange('posterUrl', url)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Video Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="e.g. Welcome to My Creative Studio"
                      className="editor-text-input full-width"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    />
                  </div>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Badge / Tagline</label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      placeholder="e.g. Featured Intro"
                      className="editor-text-input full-width"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    />
                  </div>
                </div>

                <div className="editor-control">
                  <label style={{ color: '#e2e8f0' }}>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Brief description of the video content or project context..."
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a' }}
                    rows={2}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Video Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || '16:9'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value="16:9">Widescreen 16:9 (Standard)</option>
                      <option value="21:9">Cinematic 21:9 (Ultrawide)</option>
                      <option value="4:3">Classic 4:3</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ color: '#e2e8f0', marginBottom: '8px' }}>Playback Options</label>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.autoplay)}
                          onChange={(e) => handleFieldChange('autoplay', e.target.checked)}
                        />
                        Autoplay
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.muted !== false}
                          onChange={(e) => handleFieldChange('muted', e.target.checked)}
                        />
                        Muted
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(formData.loop)}
                          onChange={(e) => handleFieldChange('loop', e.target.checked)}
                        />
                        Loop
                      </label>
                    </div>
                  </div>
                </div>

                {/* Call-to-Action Action Buttons */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                      Action Buttons ({(formData.actions || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="editor-btn"
                      style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '4px 10px', fontSize: '0.74rem' }}
                    >
                      <Plus size={13} /> Add Button
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.actions || []).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 2fr auto auto',
                          gap: '8px',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: '#06070a',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <input
                          type="text"
                          value={act.label || ''}
                          onChange={(e) => handleActionChange(aIdx, 'label', e.target.value)}
                          placeholder="Label (e.g. YouTube)"
                          className="editor-text-input"
                          style={{ color: '#f1f5f9', background: '#06070a', margin: 0 }}
                        />
                        <input
                          type="text"
                          value={act.url || ''}
                          onChange={(e) => handleActionChange(aIdx, 'url', e.target.value)}
                          placeholder="URL (https://...)"
                          className="editor-text-input"
                          style={{ color: '#f1f5f9', background: '#06070a', margin: 0 }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(act.primary)}
                            onChange={(e) => handleActionChange(aIdx, 'primary', e.target.checked)}
                          />
                          Primary
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveAction(aIdx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* --- VIDEO GALLERY FORM --- */}
            {block.type === 'video_gallery' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Grid Columns</label>
                    <select
                      value={formData.columns || 3}
                      onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value={2}>2 Columns (Large Cards)</option>
                      <option value={3}>3 Columns (Balanced Grid)</option>
                      <option value={4}>4 Columns (Compact Grid)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label style={{ color: '#e2e8f0' }}>Video Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || '16:9'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      style={{ color: '#f1f5f9', background: '#06070a' }}
                    >
                      <option value="16:9">Widescreen 16:9 (Standard Videos)</option>
                      <option value="9:16">Vertical 9:16 (Shorts / Reels / TikTok)</option>
                      <option value="square">Square 1:1</option>
                      <option value="4:3">Classic 4:3</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                    Gallery Videos ({(formData.items || []).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        id: `vid-${Date.now()}`,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        posterUrl: '',
                        title: 'New Video Clip',
                        caption: '',
                        duration: '3:30',
                        author: '',
                        date: '2026',
                        tag: 'Video',
                      })
                    }
                    className="editor-btn"
                    style={{ background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa', border: '1px solid rgba(0,240,170,0.3)', padding: '6px 12px' }}
                  >
                    <Plus size={14} /> Add Video
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((vid, idx) => (
                    <div
                      key={vid.id || idx}
                      style={{
                        borderRadius: '10px',
                        background: '#06070a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                          Video #{idx + 1}: {vid.title || 'Untitled Video'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Video URL (YouTube, Vimeo, Streamable, Loom, or Direct Video)</label>
                        <input
                          type="text"
                          value={vid.videoUrl || vid.url || ''}
                          onChange={(e) => handleItemChange(idx, 'videoUrl', e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                          required
                        />
                      </div>

                      <ImageUploadPicker
                        label="Custom Poster Thumbnail (Optional - auto resolves from YouTube)"
                        value={vid.posterUrl || vid.imageUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'posterUrl', url)}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Video Title</label>
                          <input
                            type="text"
                            value={vid.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Architecture Deep Dive"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Category / Tags (comma separated)</label>
                          <input
                            type="text"
                            value={vid.tag || ''}
                            onChange={(e) => handleItemChange(idx, 'tag', e.target.value)}
                            placeholder="e.g. Showreel, Tutorial"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Duration (e.g. 12:45)</label>
                          <input
                            type="text"
                            value={vid.duration || ''}
                            onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                            placeholder="12:45"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Creator / Channel</label>
                          <input
                            type="text"
                            value={vid.author || ''}
                            onChange={(e) => handleItemChange(idx, 'author', e.target.value)}
                            placeholder="e.g. Alex Rivers"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ color: '#e2e8f0' }}>Date</label>
                          <input
                            type="text"
                            value={vid.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="e.g. Aug 2026"
                            className="editor-text-input full-width"
                            style={{ color: '#f1f5f9', background: '#06070a' }}
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ color: '#e2e8f0' }}>Caption / Summary</label>
                        <input
                          type="text"
                          value={vid.caption || vid.description || ''}
                          onChange={(e) => handleItemChange(idx, 'caption', e.target.value)}
                          placeholder="Brief summary of what this video demonstrates..."
                          className="editor-text-input full-width"
                          style={{ color: '#f1f5f9', background: '#06070a' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>

          {/* Footer Save Button */}
          <div className="editor-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="editor-btn editor-btn-ghost"
              style={{ padding: '9px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="editor-btn editor-btn-save"
              style={{ padding: '9px 22px' }}
            >
              <Save size={15} /> Apply Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
