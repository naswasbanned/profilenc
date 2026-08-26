import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const subtabs = [
  { id: 'specs', label: 'PC Specs' },
  { id: 'setup', label: 'Gear / Setup' },
];

export default function HobbiesEditor({ specs, setSpecs, setup, setSetup }) {
  const [activeTab, setActiveTab] = useState('specs');

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const deleteItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
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
              title={spec.name || 'New Component'}
              subtitle={spec.category}
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
            onClick={() => setSpecs([...specs, { category: '', name: '', detail: '', icon: 'Box' }])}
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
              title={item.item || 'New Gear'}
              subtitle={item.category}
              onDelete={() => deleteItem(setup, setSetup, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Category" value={item.category} onChange={(v) => updateItem(setup, setSetup, i, 'category', v)} />
                <AdminField label="Item Name" value={item.item} onChange={(v) => updateItem(setup, setSetup, i, 'item', v)} />
                <AdminField label="Detail" value={item.detail} onChange={(v) => updateItem(setup, setSetup, i, 'detail', v)} fullWidth />
                <AdminField label="Image URL" value={item.image} onChange={(v) => updateItem(setup, setSetup, i, 'image', v)} type="url" fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setSetup([...setup, { category: '', item: '', detail: '', image: '' }])}
          >
            <Plus size={16} /> Add Gear
          </button>
        </div>
      )}
    </div>
  );
}
