import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const subtabs = [
  { id: 'specs', label: 'PC Specs' },
  { id: 'setup', label: 'Gear / Setup' },
];

export default function HobbiesEditor({ specs, setSpecs, setup, setSetup, token }) {
  const [activeTab, setActiveTab] = useState('specs');

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const deleteItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const moveItem = (list, setList, fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) return;
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setList(updated);
  };

  return (
    <div>
      <div className="admin-subtabs">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-subtab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Specs */}
      {activeTab === 'specs' && specs && (
        <div>
          {specs.map((spec, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={specs.length}
              onMove={(from, to) => moveItem(specs, setSpecs, from, to)}
              title={spec.name || 'New Component'}
              subtitle={spec.category}
              hidden={Boolean(spec.hidden)}
              onToggleHide={() => updateItem(specs, setSpecs, i, 'hidden', !spec.hidden)}
              onDelete={() => deleteItem(specs, setSpecs, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Category" value={spec.category} onChange={(v) => updateItem(specs, setSpecs, i, 'category', v)} />
                <AdminField label="Icon (Lucide)" value={spec.icon} onChange={(v) => updateItem(specs, setSpecs, i, 'icon', v)} />
                <AdminField label="Name" value={spec.name} onChange={(v) => updateItem(specs, setSpecs, i, 'name', v)} fullWidth />
                <AdminField label="Detail" value={spec.detail} onChange={(v) => updateItem(specs, setSpecs, i, 'detail', v)} fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setSpecs([...specs, { category: '', name: '', detail: '', icon: 'Box', hidden: false }])}
          >
            <Plus size={16} /> Add Component
          </button>
        </div>
      )}

      {/* Setup / Gear */}
      {activeTab === 'setup' && setup && (
        <div>
          {setup.map((item, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={setup.length}
              onMove={(from, to) => moveItem(setup, setSetup, from, to)}
              title={item.item || 'New Gear'}
              subtitle={item.category}
              hidden={Boolean(item.hidden)}
              onToggleHide={() => updateItem(setup, setSetup, i, 'hidden', !item.hidden)}
              onDelete={() => deleteItem(setup, setSetup, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Category" value={item.category} onChange={(v) => updateItem(setup, setSetup, i, 'category', v)} />
                <AdminField label="Item Name" value={item.item} onChange={(v) => updateItem(setup, setSetup, i, 'item', v)} />
                <AdminField label="Detail" value={item.detail} onChange={(v) => updateItem(setup, setSetup, i, 'detail', v)} fullWidth />
                <AdminField label="Image" value={item.image} onChange={(v) => updateItem(setup, setSetup, i, 'image', v)} type="image" token={token} fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setSetup([...setup, { category: '', item: '', detail: '', image: '', hidden: false }])}
          >
            <Plus size={16} /> Add Gear
          </button>
        </div>
      )}
    </div>
  );
}
