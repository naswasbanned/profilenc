import { useState } from 'react';
import { Eye, EyeOff, GripVertical, Plus, Save, Trash2, X } from 'lucide-react';
import { Reorder } from 'framer-motion';
import EditorModal from '../primitives/EditorModal';
import { IconPickerField, SortableRow, TextField } from './fields';
import { getIcon } from '../../lib/icons';

// Ids are created from event handlers, so the counter sits outside the
// component to keep the render body free of impure calls.
let tabSequence = 0;

function makeTabId() {
  tabSequence += 1;
  return `tab-${tabSequence}-${tabSequence * 7919}`;
}

function toSlug(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// A plain helper rather than a component: the icon is looked up by name, and
// the lint rule rightly objects to building components during render.
function renderTabIcon(icon) {
  if (!icon || icon === 'none') {
    return <span className="tab-row-icon-text">TXT</span>;
  }
  const IconComponent = getIcon(icon) || getIcon('Folder');
  return <IconComponent size={15} />;
}

/**
 * Tab manager built from the same field kit as the block editor: collapsed rows
 * with a summary, one row open at a time, drag to reorder.
 */
export default function TabManagerModal({ tabs = [], onSaveTabs, onClose, editorTheme = 'dark' }) {
  const [tabList, setTabList] = useState(() => JSON.parse(JSON.stringify(tabs || [])));
  const [openId, setOpenId] = useState(null);

  const updateTab = (id, patch) => {
    setTabList((list) => list.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)));
  };

  const addTab = () => {
    const id = makeTabId();
    setTabList((list) => [
      ...list,
      { id, label: 'New tab', slug: `tab-${list.length + 1}`, icon: 'Folder', enabled: true, blocks: [] },
    ]);
    setOpenId(id);
  };

  const removeTab = (id) => {
    if (tabList.length <= 1) return;
    setTabList((list) => list.filter((tab) => tab.id !== id));
  };

  const handleSave = () => {
    onSaveTabs(tabList);
    onClose();
  };

  const onlyOneTab = tabList.length <= 1;

  return (
    <EditorModal onClose={onClose} editorTheme={editorTheme} size="modal-sm">
      <div className="editor-modal-header">
        <div>
          <h3>Tabs</h3>
          <span>Rename, reorder, hide, or add a page section.</span>
        </div>
        <button type="button" onClick={onClose} title="Close">
          <X size={20} />
        </button>
      </div>

      <div className="editor-modal-body">
        <div className="bf-list">
          <Reorder.Group axis="y" values={tabList} onReorder={setTabList} className="bf-list-rows">
            {tabList.map((tab, index) => {
              const isOpen = openId === tab.id;
              const isHidden = tab.enabled === false;

              return (
                <SortableRow
                  key={tab.id}
                  value={tab}
                  className={`bf-row ${isOpen ? 'is-open' : ''} ${isHidden ? 'is-hidden' : ''}`}
                >
                  {({ startDrag }) => (
                    <>
                      <div className="bf-row-head">
                        <span
                          className="bf-row-grip"
                          onPointerDown={startDrag}
                          title="Drag to reorder tab"
                          aria-hidden="true"
                        >
                          <GripVertical size={15} />
                        </span>

                        <button
                          type="button"
                          className="bf-row-summary"
                          onClick={() => setOpenId(isOpen ? null : tab.id)}
                          aria-expanded={isOpen}
                        >
                          <span className="bf-row-index">{index + 1}</span>
                          <span className="tab-row-icon" aria-hidden="true">
                            {renderTabIcon(tab.icon)}
                          </span>
                          <span className="bf-row-title">{tab.label || 'Untitled tab'}</span>
                          {isHidden && <span className="tab-row-flag">Hidden</span>}
                        </button>

                        <button
                          type="button"
                          className="bf-row-action"
                          onClick={() => updateTab(tab.id, { enabled: isHidden })}
                          title={isHidden ? 'Show this tab' : 'Hide this tab'}
                        >
                          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          className="bf-row-action is-danger"
                          onClick={() => removeTab(tab.id)}
                          disabled={onlyOneTab}
                          title={onlyOneTab ? 'A profile needs at least one tab' : 'Remove this tab'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {isOpen && (
                        <div className="bf-row-body">
                          <div className="bf-fields">
                            <TextField
                              label="Tab name"
                              value={tab.label}
                              max={24}
                              placeholder="Work"
                              hint={`Address: #${tab.slug || toSlug(tab.label) || tab.id}`}
                              onChange={(label) => updateTab(tab.id, { label, slug: toSlug(label) })}
                            />

                            <IconPickerField
                              label="Tab icon"
                              value={tab.icon === undefined ? 'Folder' : tab.icon}
                              hint="Pick None to show the name on its own."
                              onChange={(icon) => updateTab(tab.id, { icon })}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </SortableRow>
              );
            })}
          </Reorder.Group>

          <button type="button" className="bf-btn bf-btn-add" onClick={addTab}>
            <Plus size={14} /> Add tab
          </button>
        </div>
      </div>

      <div className="editor-modal-footer">
        <button type="button" onClick={onClose} className="editor-btn editor-btn-ghost">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="editor-btn editor-btn-save active-dirty">
          <Save size={16} /> <span>Save tabs</span>
        </button>
      </div>
    </EditorModal>
  );
}
