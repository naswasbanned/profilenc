import { GearIcon } from '../../utils/gearIconUtils';

export default function SpecsGridBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--card-text-muted, var(--color-text-secondary, #8b949e))', fontSize: '0.85rem' }}>
        No specs or gear items yet. Click Edit to add gear.
      </div>
    );
  }

  return (
    <div className="specs-grid">
      {list.map((item, idx) => (
        <div key={item.id || idx} className="spec-card">
          <div className="spec-icon">
            <GearIcon
              icon={item.icon}
              category={item.category}
              name={item.name || item.title}
              size={20}
            />
          </div>
          <div className="spec-info">
            {item.category && <p className="spec-category">{item.category}</p>}
            <h4 className="spec-name">{item.name || item.title}</h4>
            {item.detail && <p className="spec-detail">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
