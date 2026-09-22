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
  Github,
  Music,
  Target,
} from 'lucide-react';
import ImageUploadPicker from './ImageUploadPicker';
import { TechIcon, POPULAR_TECH_PRESETS, resolveTechIcon } from '../../utils/techIconUtils';
import { GearIcon, GEAR_ICON_CATEGORIES, guessGearIcon } from '../../utils/gearIconUtils';

export default function BlockEditorModal({
  block,
  editorTheme = 'dark',
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

  const handleMoveItem = (idx, direction) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return prev;
      [items[idx], items[targetIdx]] = [items[targetIdx], items[idx]];
      return { ...prev, items };
    });
    setExpandedIndex(direction === 'up' ? idx - 1 : idx + 1);
  };

  const handleMoveImage = (idx, direction) => {
    setFormData((prev) => {
      const images = [...(prev.images || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= images.length) return prev;
      [images[idx], images[targetIdx]] = [images[targetIdx], images[idx]];
      return { ...prev, images };
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
    <div className="editor-modal-backdrop" data-editor-theme={editorTheme} onClick={handleBackdropClick}>
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
            <h3 style={{ textTransform: 'capitalize' }}>
              Edit {block.type?.replace('_', ' ')} Block
            </h3>
            <span>
              Customize content, alignments, and items visually
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
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
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Featured Projects"
                    className="editor-text-input full-width"
                    
                  />
                </div>
                <div className="editor-control">
                  <label>Subtitle (optional)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Selected client works"
                    className="editor-text-input full-width"
                    
                  />
                </div>
                <div className="editor-control">
                  <label>Section Icon / Logo</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="editor-select"
                    
                  >
                    <option value="default">Default Icon (Auto)</option>
                    <option value="none">No Icon (Just Text)</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Code2">Code & Dev</option>
                    <option value="Briefcase">Briefcase / Career</option>
                    <option value="Layers">Layers / Cards</option>
                    <option value="Cpu">CPU / Hardware ⚙️</option>
                    <option value="Gamepad2">Gamepad / Gaming</option>
                    <option value="BookOpen">Book / Journal</option>
                    <option value="Film">Film / Cinema</option>
                    <option value="Music">Music / Audio</option>
                    <option value="Star">Star / Highlights</option>
                    <option value="Heart">Heart / Favorites</option>
                    <option value="Zap">Zap / Energy</option>
                    <option value="Globe">Globe / Web</option>
                    <option value="Award">Award / Achievements</option>
                    <option value="Terminal">Terminal / CLI</option>
                    <option value="Folder">Folder / Projects</option>
                    <option value="Coffee">Coffee / Life</option>
                    <option value="Shield">Shield / Security</option>
                    <option value="Activity">Activity / Stats</option>
                    <option value="Flame">Flame / Trending</option>
                    <option value="Rocket">Rocket / Launch</option>
                  </select>
                </div>
              </div>
            )}

            {/* --- HERO FORM --- */}
            {block.type === 'hero' && (
              <>
                <div className="editor-control">
                  <label>Hero Layout & Alignment</label>
                  <select
                    value={formData.align || 'center'}
                    onChange={(e) => handleFieldChange('align', e.target.value)}
                    className="editor-select"
                    
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
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="e.g. Alex Rivers"
                      className="editor-text-input full-width"
                      
                      required
                    />
                  </div>
                  <div className="editor-control">
                    <label>Tagline / Role</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => handleFieldChange('tagline', e.target.value)}
                      placeholder="e.g. Full-Stack Engineer"
                      className="editor-text-input full-width"
                      
                    />
                  </div>
                </div>

                <ImageUploadPicker
                  label="Avatar Image"
                  value={formData.avatarUrl || ''}
                  onChange={(url) => handleFieldChange('avatarUrl', url)}
                />

                <div className="editor-control">
                  <label>Status Pill Badge (optional)</label>
                  <input
                    type="text"
                    value={formData.statusBadge || ''}
                    onChange={(e) => handleFieldChange('statusBadge', e.target.value)}
                    placeholder="e.g. Available for Freelance"
                    className="editor-text-input full-width"
                    
                  />
                </div>

                <div className="editor-control">
                  <label>Bio / Summary</label>
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    placeholder="Brief description about yourself..."
                    className="editor-text-input full-width"
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Action Buttons (Get in Touch / Contact / Links) */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label className="editor-section-heading">
                      Action & Contact Buttons ({(formData.actions || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="editor-btn-add"
                    >
                      <Plus size={13} /> Add Action Button
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.actions || []).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="editor-subitem-row"
                      >
                        <input
                          type="text"
                          value={act.label || ''}
                          onChange={(e) => handleActionChange(aIdx, 'label', e.target.value)}
                          placeholder="Button Label (e.g. Get in Touch)"
                          className="editor-text-input full-width"
                          
                        />
                        <input
                          type="text"
                          value={act.url || ''}
                          onChange={(e) => handleActionChange(aIdx, 'url', e.target.value)}
                          placeholder="URL / Email (e.g. mailto:...)"
                          className="editor-text-input full-width"
                          
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
                          className="editor-icon-btn is-delete"
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
                    <label className="editor-section-heading">
                      Social & Profile Links ({(formData.socials || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="editor-btn-add"
                    >
                      <Plus size={13} /> Add Social Link
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.socials || []).map((soc, sIdx) => (
                      <div
                        key={sIdx}
                        className="editor-subitem-row"
                      >
                        <select
                          value={soc.platform || 'Github'}
                          onChange={(e) => handleSocialChange(sIdx, 'platform', e.target.value)}
                          className="editor-select full-width"
                          
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
                          
                        />
                        <input
                          type="text"
                          value={soc.url || ''}
                          onChange={(e) => handleSocialChange(sIdx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="editor-text-input full-width"
                          
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(sIdx)}
                          className="editor-icon-btn is-delete"
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
                  <label>Grid Columns</label>
                  <select
                    value={formData.columns || 2}
                    onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                    className="editor-select"
                    
                  >
                    <option value={1}>1 Column (Full Width Stack)</option>
                    <option value={2}>2 Columns (Recommended)</option>
                    <option value={3}>3 Columns (Compact Tiers)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <h4 className="editor-section-heading">
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
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Service Tier
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((svc, idx) => (
                    <div
                      key={idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          Tier #{idx + 1}: {svc.title || 'Untitled Tier'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleItemChange(idx, 'featured', !svc.featured)}
                            className={`editor-btn ${svc.featured ? 'editor-btn-save' : 'editor-btn-ghost'}`}
                            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          >
                            {svc.featured ? '★ Featured Tier' : 'Make Featured'}
                          </button>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Service Name</label>
                          <input
                            type="text"
                            value={svc.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Full-Stack Web App"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Price</label>
                          <input
                            type="text"
                            value={svc.price || ''}
                            onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                            placeholder="e.g. $1,200 or $50/hr"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Billing Period</label>
                          <input
                            type="text"
                            value={svc.period || ''}
                            onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                            placeholder="e.g. project / mo / hr"
                            className="editor-text-input"
                            
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Availability / Status</label>
                          <input
                            type="text"
                            value={svc.status || ''}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            placeholder="e.g. Available / 2 Slots Left"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Delivery / Turnaround</label>
                          <input
                            type="text"
                            value={svc.deliveryTime || ''}
                            onChange={(e) => handleItemChange(idx, 'deliveryTime', e.target.value)}
                            placeholder="e.g. 1-2 weeks"
                            className="editor-text-input"
                            
                          />
                        </div>
                      </div>

                      <ImageUploadPicker
                        label="Service Sample / Preview Image (Optional)"
                        value={svc.imageUrl || svc.coverUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'imageUrl', url)}
                      />

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Service Description</label>
                        <textarea
                          value={svc.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="What this service covers..."
                          className="editor-text-input full-width"
                          
                          rows={2}
                        />
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Included Deliverables / Features (one per line)</label>
                        <textarea
                          value={Array.isArray(svc.features) ? svc.features.join('\n') : svc.features || ''}
                          onChange={(e) => handleItemChange(idx, 'features', e.target.value.split('\n'))}
                          placeholder="✓ Responsive UI Design&#10;✓ Frontend & Backend Integration&#10;✓ Free 14-day Support"
                          className="editor-text-input full-width"
                          
                          rows={3}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Button Label</label>
                          <input
                            type="text"
                            value={svc.ctaLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'ctaLabel', e.target.value)}
                            placeholder="e.g. Book Commission"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Button Link / Action</label>
                          <input
                            type="text"
                            value={svc.ctaUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'ctaUrl', e.target.value)}
                            placeholder="mailto:you@example.com or URL"
                            className="editor-text-input"
                            
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
                  <label>Grid Columns</label>
                  <select
                    value={formData.columns || 2}
                    onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                    className="editor-select"
                    
                  >
                    <option value={1}>1 Column (Stack)</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 className="editor-section-heading">Cards ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ id: `card-${Date.now()}`, title: 'New Card', description: '', badge: '', tags: [], linkUrl: '', actionLabel: 'View' })}
                    className="editor-btn-add"
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
                        <span className="editor-item-card-title">
                          Card #{idx + 1}: {item.title || 'Untitled'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                            title="Delete card"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="editor-form-row-2">
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="Card Title"
                          className="editor-text-input full-width"
                          
                        />
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => handleItemChange(idx, 'badge', e.target.value)}
                          placeholder="Badge (e.g. Featured)"
                          className="editor-text-input full-width"
                          
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
                        
                        rows={2}
                      />

                      <input
                        type="text"
                        value={Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''}
                        onChange={(e) => handleItemChange(idx, 'tags', e.target.value)}
                        placeholder="Tags (comma separated, e.g. React, Node.js)"
                        className="editor-text-input full-width"
                        
                      />

                      <div className="editor-form-row-2">
                        <input
                          type="text"
                          value={item.linkUrl || ''}
                          onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                          placeholder="Link URL (https://...)"
                          className="editor-text-input full-width"
                          
                        />
                        <input
                          type="text"
                          value={item.actionLabel || ''}
                          onChange={(e) => handleItemChange(idx, 'actionLabel', e.target.value)}
                          placeholder="Button Label (e.g. View Project)"
                          className="editor-text-input full-width"
                          
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
                    <h4 className="editor-section-heading" style={{ margin: 0 }}>
                      Skills & Tech Stack Badges ({(formData.items || []).length})
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Auto-detects official brand icons for Go, Next.js, React, Rust, Python, Docker, and any tech stack.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ name: 'Go', category: 'Backend', tier: 'Proficient', color: '#00ADD8', icon: 'go' })}
                    className="editor-btn-add"
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
                        className="editor-item-card"
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
                              <span className="editor-item-card-title" style={{ display: "block" }}>
                                {skill.name || 'Untitled Skill'}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                Icon: {resolved.slug || 'auto-match'} {skill.category ? `• ${skill.category}` : ''}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="color"
                              value={skill.color || resolved.color || '#00f0aa'}
                              onChange={(e) => handleItemChange(idx, 'color', e.target.value)}
                              title="Badge Theme Color"
                              style={{ width: '30px', height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                            />
                            <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                            <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="editor-icon-btn is-delete"
                              title="Delete skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.2fr 1fr', gap: '8px' }}>
                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Tech / Skill Name</label>
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
                              
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Category</label>
                            <input
                              type="text"
                              value={skill.category || ''}
                              onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                              placeholder="e.g. Languages, Frontend"
                              className="editor-text-input full-width"
                              
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Badge Icon</label>
                            <select
                              value={skill.icon || ''}
                              onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                              className="editor-select full-width"
                              
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
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Proficiency</label>
                            <select
                              value={skill.tier || 'Proficient'}
                              onChange={(e) => handleItemChange(idx, 'tier', e.target.value)}
                              className="editor-select full-width"
                              
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
                  <h4 className="editor-section-heading">Timeline Items ({(formData.items || []).length})</h4>
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
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Timeline Item
                  </button>
                </div>

                {(formData.items || []).length === 0 && (
                  <div
                    style={{
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: 'var(--fn-editor-paper-light)',
                      borderRadius: '12px',
                      border: '2px dashed var(--fn-editor-line)',
                    }}
                  >
                    <p style={{ fontSize: '0.85rem', color: 'var(--fn-editor-muted)', margin: '0 0 14px' }}>
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
                      <Plus size={15} /> <span>Add First Timeline Entry</span>
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                        <span className="editor-item-card-title">
                          Timeline Entry #{idx + 1}: {item.role || item.title || 'Untitled'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                            title="Delete timeline item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Role & Company Inputs */}
                      <div className="editor-form-row-2">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Role / Milestone Title</label>
                          <input
                            type="text"
                            value={item.role || item.title || ''}
                            onChange={(e) => {
                              handleItemChange(idx, 'role', e.target.value);
                              handleItemChange(idx, 'title', e.target.value);
                            }}
                            placeholder="e.g. Senior Software Engineer"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Company / Organization</label>
                          <input
                            type="text"
                            value={item.company || ''}
                            onChange={(e) => handleItemChange(idx, 'company', e.target.value)}
                            placeholder="e.g. Acme Labs"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      {/* Period & Location Inputs */}
                      <div className="editor-form-row-2">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Period / Date</label>
                          <input
                            type="text"
                            value={item.period || ''}
                            onChange={(e) => handleItemChange(idx, 'period', e.target.value)}
                            placeholder="e.g. 2022 - Present / Oct 2023"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Location / Mode (optional)</label>
                          <input
                            type="text"
                            value={item.location || ''}
                            onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                            placeholder="e.g. Remote / New York, NY"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      {/* Summary Description */}
                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Overview Description</label>
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Brief summary of your responsibilities or milestone context..."
                          className="editor-text-input full-width"
                          
                          rows={2}
                        />
                      </div>

                      {/* --- TIMELINE POINTS / BULLETS LIST --- */}
                      <div
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          background: 'var(--fn-editor-paper-sunken)',
                          border: '1.5px solid var(--fn-editor-line)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                            Timeline Points & Key Achievements ({(item.bullets || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddBullet(idx)}
                            className="editor-btn-add"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            <Plus size={13} /> Add Point
                          </button>
                        </div>

                        {(item.bullets || []).length === 0 ? (
                          <div style={{ fontSize: '0.76rem', color: 'var(--fn-editor-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                            No bullet points yet. Click "+ Add Point" to add specific responsibilities or achievements.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(item.bullets || []).map((bullet, bIdx) => (
                              <div
                                key={bIdx}
                                className="editor-subitem-row"
                              >
                                <span style={{ color: 'var(--fn-editor-coral)', fontWeight: 800, fontSize: '0.9rem', userSelect: 'none' }}>•</span>
                                <input
                                  type="text"
                                  value={typeof bullet === 'string' ? bullet : ''}
                                  onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                                  placeholder={`Achievement / Timeline Point #${bIdx + 1}`}
                                  className="editor-text-input full-width"
                                  style={{ fontSize: "0.82rem" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBullet(idx, bIdx)}
                                  className="editor-icon-btn is-delete"
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
                            className="editor-btn-add"
                          >
                            <Plus size={12} /> Add Photo
                          </button>
                        </div>

                        {((Array.isArray(item.images) ? item.images : item.imageUrl ? [item.imageUrl] : [])).map((img, iIdx) => (
                          <div
                            key={iIdx}
                            className="editor-subitem-row"
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
                              className="editor-icon-btn is-delete" style={{ marginTop: "18px" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Tags / Tech Used</label>
                        <input
                          type="text"
                          value={Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''}
                          onChange={(e) => handleItemChange(idx, 'tags', e.target.value)}
                          placeholder="Tags (comma separated, e.g. React, TypeScript, Docker)"
                          className="editor-text-input full-width"
                          
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
                  <h4 className="editor-section-heading">Review Items ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ id: `rev-${Date.now()}`, title: 'Title', rating: 5, status: 'Completed', notes: '', genre: '' })}
                    className="editor-btn-add"
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
                        <span className="editor-item-card-title">
                          Review #{idx + 1}: {rev.title || 'Untitled'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Media Title</label>
                        <input
                          type="text"
                          value={rev.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Cyberpunk 2077 / Interstellar"
                          className="editor-text-input full-width"
                          
                        />
                      </div>

                      <div className="editor-form-row-3">
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Genre / Badge</label>
                          <input
                            type="text"
                            value={Array.isArray(rev.genre) ? rev.genre.join(', ') : rev.genre || ''}
                            onChange={(e) => handleItemChange(idx, 'genre', e.target.value)}
                            placeholder="e.g. Action RPG"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Rating</label>
                          <select
                            value={rev.rating || 5}
                            onChange={(e) => handleItemChange(idx, 'rating', Number(e.target.value))}
                            className="editor-select full-width"
                            
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>
                            ))}
                          </select>
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Status</label>
                          <input
                            type="text"
                            value={rev.status || ''}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            placeholder="e.g. Completed"
                            className="editor-text-input full-width"
                            
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
                        <label style={{ fontSize: "0.78rem", marginBottom: "4px", display: "block" }}>Review Notes</label>
                        <textarea
                          value={rev.notes || ''}
                          onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                          placeholder="Review / Notes..."
                          className="editor-text-input full-width"
                          
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
                  <div>
                    <h4 className="editor-section-heading" style={{ margin: 0 }}>
                      Specs & Gear ({(formData.items || []).length})
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Choose from 40+ hardware and peripheral icons or use smart auto-detection.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ category: 'GPU', name: 'RTX 4080 Super', detail: '16GB GDDR6X', icon: 'Tv' })}
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Spec Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(formData.items || []).map((item, idx) => {
                    const guessed = guessGearIcon(item.category, item.name);
                    return (
                      <div
                        key={idx}
                        className="editor-item-card"
                      >
                        <div className="editor-item-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: 'var(--fn-editor-paper)',
                                border: '1.5px solid var(--fn-editor-line)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--fn-editor-coral-dark)',
                              }}
                            >
                              <GearIcon
                                icon={item.icon}
                                category={item.category}
                                name={item.name}
                                size={18}
                              />
                            </div>
                            <div>
                              <span className="editor-item-card-title" style={{ display: "block" }}>
                                {item.name || item.title || `Spec Item #${idx + 1}`}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {item.category || 'Hardware'} {item.icon ? `• ${item.icon}` : `• Auto (${guessed})`}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                            <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="editor-icon-btn is-delete"
                              title="Delete spec item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.5fr 1.3fr', gap: '8px' }}>
                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Category</label>
                            <input
                              type="text"
                              value={item.category || ''}
                              onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                              placeholder="e.g. GPU, Audio, Desk"
                              className="editor-text-input full-width"
                              
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Item / Hardware Name</label>
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                              placeholder="e.g. RTX 4080 Super"
                              className="editor-text-input full-width"
                              
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Detail / Specs</label>
                            <input
                              type="text"
                              value={item.detail || ''}
                              onChange={(e) => handleItemChange(idx, 'detail', e.target.value)}
                              placeholder="e.g. 16GB GDDR6X"
                              className="editor-text-input full-width"
                              
                            />
                          </div>

                          <div className="editor-control" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.72rem", marginBottom: "3px", display: "block" }}>Gear Icon</label>
                            <select
                              value={item.icon || ''}
                              onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                              className="editor-select full-width"
                              
                            >
                              <option value="">Auto-Detect ({guessed})</option>
                              {GEAR_ICON_CATEGORIES.map((cat) => (
                                <optgroup key={cat.group} label={cat.group}>
                                  {cat.icons.map((ic) => (
                                    <option key={ic.id} value={ic.id}>
                                      {ic.label}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* --- JOURNAL FORM --- */}
            {block.type === 'journal' && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'var(--fn-editor-paper-light)',
                  border: '2px solid var(--fn-editor-line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--fn-editor-coral-dark)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <BookOpen size={16} /> Journal & Articles Management
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--fn-editor-muted)', lineHeight: '1.6', margin: 0 }}>
                  Journal entries are managed directly on the profile canvas. Use the <strong>"+ Quick Add Entry"</strong> button and entry card actions on the Journal block in your profile editor to write, edit, or delete articles.
                </p>
              </div>
            )}

            {/* --- STACKED DECK FORM --- */}
            {block.type === 'stacked_deck' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 className="editor-section-heading">Deck Images ({(formData.images || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const images = [...(formData.images || []), '/images/projects/template.png'];
                      handleFieldChange('images', images);
                    }}
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Image
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(formData.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="editor-subitem-row"
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
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '20px' }}>
                        <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveImage(idx, 'up')}><ChevronUp size={14} /></button>
                        <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.images || []).length - 1} onClick={() => handleMoveImage(idx, 'down')}><ChevronDown size={14} /></button>
                        <button
                          type="button"
                          className="editor-icon-btn is-delete"
                          onClick={() => {
                            const images = (formData.images || []).filter((_, i) => i !== idx);
                            handleFieldChange('images', images);
                          }}
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
                    <label>Grid Columns</label>
                    <select
                      value={formData.columns || 3}
                      onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                      className="editor-select"
                      
                    >
                      <option value={2}>2 Columns (Large Cards)</option>
                      <option value={3}>3 Columns (Balanced Grid)</option>
                      <option value={4}>4 Columns (Compact Grid)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Photo Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || 'square'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      
                    >
                      <option value="square">Square (1:1)</option>
                      <option value="wide">Landscape / Wide (16:10)</option>
                      <option value="tall">Portrait / Tall (4:5)</option>
                      <option value="natural">Natural Aspect Ratio</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 className="editor-section-heading">
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
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Photo
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((photo, idx) => (
                    <div
                      key={photo.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          Photo #{idx + 1}: {photo.title || 'Untitled Photo'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <ImageUploadPicker
                        label="Photo Image"
                        value={typeof photo === 'string' ? photo : photo.src || photo.url || photo.imageUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'src', url)}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Photo Title / Name</label>
                          <input
                            type="text"
                            value={photo.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Kyoto Sunset"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Tag / Category</label>
                          <input
                            type="text"
                            value={photo.tag || ''}
                            onChange={(e) => handleItemChange(idx, 'tag', e.target.value)}
                            placeholder="e.g. Photography / 3D Art"
                            className="editor-text-input"
                            
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Location (optional)</label>
                          <input
                            type="text"
                            value={photo.location || ''}
                            onChange={(e) => handleItemChange(idx, 'location', e.target.value)}
                            placeholder="e.g. Tokyo, Japan"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Date / Year (optional)</label>
                          <input
                            type="text"
                            value={photo.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="e.g. 2026 or Oct 2025"
                            className="editor-text-input"
                            
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Description (shown in full photo modal)</label>
                        <textarea
                          value={photo.description || photo.caption || ''}
                          onChange={(e) => {
                            handleItemChange(idx, 'description', e.target.value);
                            handleItemChange(idx, 'caption', e.target.value);
                          }}
                          placeholder="Photo background story, camera settings, or notes..."
                          className="editor-text-input full-width"
                          
                          rows={2}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Link Label</label>
                          <input
                            type="text"
                            value={photo.linkLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'linkLabel', e.target.value)}
                            placeholder="e.g. View on Unsplash"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Link URL (optional)</label>
                          <input
                            type="text"
                            value={photo.linkUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                            placeholder="https://..."
                            className="editor-text-input"
                            
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
                    <label>Default View</label>
                    <select
                      value={formData.defaultView || 'list'}
                      onChange={(e) => handleFieldChange('defaultView', e.target.value)}
                      className="editor-select"
                      
                    >
                      <option value="list">Schedule Feed (Timeline List)</option>
                      <option value="calendar">Monthly Calendar View</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Show Filter Tabs</label>
                    <select
                      value={formData.showFilters !== false ? 'yes' : 'no'}
                      onChange={(e) => handleFieldChange('showFilters', e.target.value === 'yes')}
                      className="editor-select"
                      
                    >
                      <option value="yes">Yes (All / Upcoming / Live / Past)</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 className="editor-section-heading">
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
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Event
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          Event #{idx + 1}: {evt.title || 'Untitled Event'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Event Title</label>
                        <input
                          type="text"
                          value={evt.title || ''}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Live Coding: Profile Architecture"
                          className="editor-text-input full-width"
                          
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Event Date (YYYY-MM-DD)</label>
                          <input
                            type="text"
                            value={evt.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="2026-08-28"
                            className="editor-text-input"
                            
                          />
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Time String</label>
                          <input
                            type="text"
                            value={evt.time || ''}
                            onChange={(e) => handleItemChange(idx, 'time', e.target.value)}
                            placeholder="19:00 - 21:00 UTC"
                            className="editor-text-input"
                            
                          />
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Status Pill</label>
                          <select
                            value={evt.status || 'Upcoming'}
                            onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                            className="editor-select"
                            
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Live Now">Live Now</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Sold Out">Sold Out</option>
                            <option value="Completed / Past">Completed / Past</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Event Type</label>
                          <select
                            value={evt.type || 'Stream'}
                            onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                            className="editor-select"
                            
                          >
                            <option value="Stream">Live Stream</option>
                            <option value="Meetup">Meetup / Community</option>
                            <option value="Conference">Conference / Keynote</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Launch">Product Launch</option>
                          </select>
                        </div>

                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Location / Streaming Platform</label>
                          <input
                            type="text"
                            value={evt.location || evt.platform || ''}
                            onChange={(e) => {
                              handleItemChange(idx, 'location', e.target.value);
                              handleItemChange(idx, 'platform', e.target.value);
                            }}
                            placeholder="e.g. Twitch / YouTube or San Francisco, CA"
                            className="editor-text-input"
                            
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Event Description / Agenda</label>
                        <textarea
                          value={evt.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="What will happen during this event..."
                          className="editor-text-input full-width"
                          
                          rows={2}
                        />
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Topics / Tags (comma separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(evt.topics) ? evt.topics.join(', ') : evt.topics || ''}
                          onChange={(e) => handleItemChange(idx, 'topics', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                          placeholder="React, CSS, Frontend"
                          className="editor-text-input full-width"
                          
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Button Label</label>
                          <input
                            type="text"
                            value={evt.linkLabel || ''}
                            onChange={(e) => handleItemChange(idx, 'linkLabel', e.target.value)}
                            placeholder="e.g. Watch Stream / RSVP"
                            className="editor-text-input"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Button URL</label>
                          <input
                            type="text"
                            value={evt.linkUrl || ''}
                            onChange={(e) => handleItemChange(idx, 'linkUrl', e.target.value)}
                            placeholder="https://..."
                            className="editor-text-input"
                            
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
                  <label>Video URL (YouTube, Vimeo, Streamable, Loom, or Direct MP4/WebM)</label>
                  <input
                    type="text"
                    value={formData.videoUrl || ''}
                    onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/... or /uploads/..."
                    className="editor-text-input full-width"
                    
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
                    <label>Video Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="e.g. Welcome to My Creative Studio"
                      className="editor-text-input full-width"
                      
                    />
                  </div>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Badge / Tagline</label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={(e) => handleFieldChange('badge', e.target.value)}
                      placeholder="e.g. Featured Intro"
                      className="editor-text-input full-width"
                      
                    />
                  </div>
                </div>

                <div className="editor-control">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Brief description of the video content or project context..."
                    className="editor-text-input full-width"
                    
                    rows={2}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Video Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || '16:9'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      
                    >
                      <option value="16:9">Widescreen 16:9 (Standard)</option>
                      <option value="21:9">Cinematic 21:9 (Ultrawide)</option>
                      <option value="4:3">Classic 4:3</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ marginBottom: "8px" }}>Playback Options</label>
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
                    <label className="editor-section-heading">
                      Action Buttons ({(formData.actions || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAction}
                      className="editor-btn-add"
                    >
                      <Plus size={13} /> Add Button
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(formData.actions || []).map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="editor-subitem-row"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 2fr auto auto',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          value={act.label || ''}
                          onChange={(e) => handleActionChange(aIdx, 'label', e.target.value)}
                          placeholder="Label (e.g. YouTube)"
                          className="editor-text-input"
                        />
                        <input
                          type="text"
                          value={act.url || ''}
                          onChange={(e) => handleActionChange(aIdx, 'url', e.target.value)}
                          placeholder="URL (https://...)"
                          className="editor-text-input"
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--fn-editor-ink)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
                          className="editor-icon-btn is-delete"
                          title="Remove action"
                        >
                          <Trash2 size={14} />
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
                    <label>Grid Columns</label>
                    <select
                      value={formData.columns || 3}
                      onChange={(e) => handleFieldChange('columns', Number(e.target.value))}
                      className="editor-select"
                      
                    >
                      <option value={2}>2 Columns (Large Cards)</option>
                      <option value={3}>3 Columns (Balanced Grid)</option>
                      <option value={4}>4 Columns (Compact Grid)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Video Aspect Ratio</label>
                    <select
                      value={formData.aspectRatio || '16:9'}
                      onChange={(e) => handleFieldChange('aspectRatio', e.target.value)}
                      className="editor-select"
                      
                    >
                      <option value="16:9">Widescreen 16:9 (Standard Videos)</option>
                      <option value="9:16">Vertical 9:16 (Shorts / Reels / TikTok)</option>
                      <option value="square">Square 1:1</option>
                      <option value="4:3">Classic 4:3</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 className="editor-section-heading">
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
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Video
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((vid, idx) => (
                    <div
                      key={vid.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          Video #{idx + 1}: {vid.title || 'Untitled Video'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Video URL (YouTube, Vimeo, Streamable, Loom, or Direct Video)</label>
                        <input
                          type="text"
                          value={vid.videoUrl || vid.url || ''}
                          onChange={(e) => handleItemChange(idx, 'videoUrl', e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                          className="editor-text-input full-width"
                          
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
                          <label>Video Title</label>
                          <input
                            type="text"
                            value={vid.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Architecture Deep Dive"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Category / Tags (comma separated)</label>
                          <input
                            type="text"
                            value={vid.tag || ''}
                            onChange={(e) => handleItemChange(idx, 'tag', e.target.value)}
                            placeholder="e.g. Showreel, Tutorial"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Duration (e.g. 12:45)</label>
                          <input
                            type="text"
                            value={vid.duration || ''}
                            onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                            placeholder="12:45"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Creator / Channel</label>
                          <input
                            type="text"
                            value={vid.author || ''}
                            onChange={(e) => handleItemChange(idx, 'author', e.target.value)}
                            placeholder="e.g. Alex Rivers"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Date</label>
                          <input
                            type="text"
                            value={vid.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="e.g. Aug 2026"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>Caption / Summary</label>
                        <input
                          type="text"
                          value={vid.caption || vid.description || ''}
                          onChange={(e) => handleItemChange(idx, 'caption', e.target.value)}
                          placeholder="Brief summary of what this video demonstrates..."
                          className="editor-text-input full-width"
                          
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- GITHUB HEATMAP FORM --- */}
            {block.type === 'github_heatmap' && (
              <>
                <div className="editor-control">
                  <label>GitHub Username</label>
                  <input
                    type="text"
                    value={formData.username || ''}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    placeholder="e.g. octocat"
                    className="editor-text-input full-width"
                    
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    Contributions will be fetched from the public GitHub API.
                  </span>
                </div>

                <div className="editor-control">
                  <label>Show Stats Bar</label>
                  <select
                    value={formData.showStats !== false ? 'true' : 'false'}
                    onChange={(e) => handleFieldChange('showStats', e.target.value === 'true')}
                    className="editor-select"
                    
                  >
                    <option value="true">Show (Total contributions, streaks, best day)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </>
            )}

            {/* --- MUSIC PLAYER FORM --- */}
            {block.type === 'music_player' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Autoplay Audio</label>
                    <select
                      value={formData.autoplay ? 'true' : 'false'}
                      onChange={(e) => handleFieldChange('autoplay', e.target.value === 'true')}
                      className="editor-select"
                      
                    >
                      <option value="false">Off (Click to play)</option>
                      <option value="true">On (Auto-start)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Disc Position</label>
                    <select
                      value={formData.discPosition || 'left'}
                      onChange={(e) => handleFieldChange('discPosition', e.target.value)}
                      className="editor-select"
                      
                    >
                      <option value="left">Left (Disc Left)</option>
                      <option value="center">Center (Disc Centered)</option>
                      <option value="right">Right (Disc Right)</option>
                    </select>
                  </div>

                  <div className="editor-control" style={{ margin: 0 }}>
                    <label>Display Mode</label>
                    <select
                      value={formData.showEmbed === true || formData.displayMode === 'embedded' ? 'embedded' : 'vinyl_only'}
                      onChange={(e) => handleFieldChange('showEmbed', e.target.value === 'embedded')}
                      className="editor-select"
                      
                    >
                      <option value="vinyl_only">Vinyl Only</option>
                      <option value="embedded">Vinyl + Embed</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <h4 className="editor-section-heading">Playlist Tracks ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      id: `track-${Date.now()}`,
                      embedUrl: '',
                      artworkUrl: '',
                      title: 'New Track',
                      artist: '',
                    })}
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Track
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((track, idx) => (
                    <div
                      key={track.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          Track #{idx + 1}: {track.title || 'Untitled'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                            title="Remove track"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Track Title</label>
                          <input
                            type="text"
                            value={track.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. My Favorite Song"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Artist</label>
                          <input
                            type="text"
                            value={track.artist || ''}
                            onChange={(e) => handleItemChange(idx, 'artist', e.target.value)}
                            placeholder="e.g. Artist Name"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      <div className="editor-control" style={{ margin: 0 }}>
                        <label>YouTube / Media URL</label>
                        <input
                          type="text"
                          value={track.embedUrl || ''}
                          onChange={(e) => handleItemChange(idx, 'embedUrl', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or SoundCloud link"
                          className="editor-text-input full-width"
                          
                        />
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px', display: 'block' }}>
                          YouTube links automatically stream pure audio on the vinyl disc and auto-fetch album art.
                        </span>
                      </div>

                      <ImageUploadPicker
                        label="Custom Disc Center Artwork (Optional - auto-resolves from YouTube)"
                        value={track.artworkUrl || ''}
                        onChange={(url) => handleItemChange(idx, 'artworkUrl', url)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* --- MILESTONES FORM --- */}
            {block.type === 'milestones' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 className="editor-section-heading">Milestones ({(formData.items || []).length})</h4>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      id: `ms-${Date.now()}`,
                      title: 'New Milestone',
                      category: 'Goals',
                      completed: false,
                      date: '',
                      subTasks: [],
                    })}
                    className="editor-btn-add"
                  >
                    <Plus size={14} /> Add Milestone
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(formData.items || []).map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      className="editor-item-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="editor-item-card-title">
                          #{idx + 1}: {ms.title || 'Untitled'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleItemChange(idx, 'completed', !ms.completed)}
                            className={`editor-btn ${ms.completed ? 'editor-btn-save' : 'editor-btn-ghost'}`}
                            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          >
                            {ms.completed ? 'Completed' : 'Mark Done'}
                          </button>
                          <button type="button" className="editor-icon-btn" title="Move up" disabled={idx === 0} onClick={() => handleMoveItem(idx, 'up')}><ChevronUp size={14} /></button>
                          <button type="button" className="editor-icon-btn" title="Move down" disabled={idx === (formData.items || []).length - 1} onClick={() => handleMoveItem(idx, 'down')}><ChevronDown size={14} /></button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="editor-icon-btn is-delete"
                            title="Remove milestone"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Title</label>
                          <input
                            type="text"
                            value={ms.title || ''}
                            onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Launch a SaaS product"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Category</label>
                          <select
                            value={ms.category || 'Goals'}
                            onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                            className="editor-select"
                            
                          >
                            <option value="Career">Career</option>
                            <option value="Travel">Travel</option>
                            <option value="Personal">Personal</option>
                            <option value="Creative">Creative</option>
                            <option value="Learning">Learning</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Achievement">Achievement</option>
                            <option value="Tech">Tech</option>
                            <option value="Goals">Goals</option>
                          </select>
                        </div>
                        <div className="editor-control" style={{ margin: 0 }}>
                          <label>Date (optional)</label>
                          <input
                            type="text"
                            value={ms.date || ''}
                            onChange={(e) => handleItemChange(idx, 'date', e.target.value)}
                            placeholder="e.g. 2025"
                            className="editor-text-input full-width"
                            
                          />
                        </div>
                      </div>

                      {/* Sub-tasks */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
                            Sub-Tasks ({(ms.subTasks || []).length})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedItems = [...(formData.items || [])];
                              const updatedMs = { ...updatedItems[idx] };
                              updatedMs.subTasks = [...(updatedMs.subTasks || []), { id: `st-${Date.now()}`, title: '', completed: false }];
                              updatedItems[idx] = updatedMs;
                              setFormData((prev) => ({ ...prev, items: updatedItems }));
                            }}
                            className="editor-btn-add"
                          >
                            <Plus size={12} /> Sub-Task
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(ms.subTasks || []).map((sub, si) => (
                            <div key={sub.id || si} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedItems = [...(formData.items || [])];
                                  const updatedMs = { ...updatedItems[idx] };
                                  const updatedSubs = [...(updatedMs.subTasks || [])];
                                  updatedSubs[si] = { ...updatedSubs[si], completed: !updatedSubs[si].completed };
                                  updatedMs.subTasks = updatedSubs;
                                  updatedItems[idx] = updatedMs;
                                  setFormData((prev) => ({ ...prev, items: updatedItems }));
                                }}
                                style={{
                                  background: sub.completed ? 'var(--fn-editor-coral)' : 'var(--fn-editor-paper-light)', border: sub.completed ? '2px solid var(--fn-editor-ink)' : '2px solid var(--fn-editor-line)',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                }}
                                title={sub.completed ? 'Mark incomplete' : 'Mark complete'}
                              />
                              <input
                                type="text"
                                value={sub.title || ''}
                                onChange={(e) => {
                                  const updatedItems = [...(formData.items || [])];
                                  const updatedMs = { ...updatedItems[idx] };
                                  const updatedSubs = [...(updatedMs.subTasks || [])];
                                  updatedSubs[si] = { ...updatedSubs[si], title: e.target.value };
                                  updatedMs.subTasks = updatedSubs;
                                  updatedItems[idx] = updatedMs;
                                  setFormData((prev) => ({ ...prev, items: updatedItems }));
                                }}
                                placeholder="Sub-task title..."
                                className="editor-text-input full-width"
                                style={{ fontSize: "0.82rem" }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedItems = [...(formData.items || [])];
                                  const updatedMs = { ...updatedItems[idx] };
                                  updatedMs.subTasks = (updatedMs.subTasks || []).filter((_, i) => i !== si);
                                  updatedItems[idx] = updatedMs;
                                  setFormData((prev) => ({ ...prev, items: updatedItems }));
                                }}
                                className="editor-icon-btn is-delete"
                                title="Remove sub-task"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
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
              className="editor-btn editor-btn-save active-dirty"
            >
              <Save size={15} /> <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
