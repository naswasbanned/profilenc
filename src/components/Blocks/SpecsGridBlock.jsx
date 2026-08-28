import {
  Cpu,
  Tv,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Fan,
  Box,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Sliders,
  Sparkles,
  Camera,
  Laptop,
  Smartphone,
} from 'lucide-react';

const iconMap = {
  Cpu: <Cpu size={20} />,
  Tv: <Tv size={20} />,
  CircuitBoard: <CircuitBoard size={20} />,
  Layers: <Layers size={20} />,
  HardDrive: <HardDrive size={20} />,
  Zap: <Zap size={20} />,
  Fan: <Fan size={20} />,
  Box: <Box size={20} />,
  Monitor: <Monitor size={20} />,
  Headphones: <Headphones size={20} />,
  Mouse: <Mouse size={20} />,
  Keyboard: <Keyboard size={20} />,
  Sliders: <Sliders size={20} />,
  Camera: <Camera size={20} />,
  Laptop: <Laptop size={20} />,
  Smartphone: <Smartphone size={20} />,
};

export default function SpecsGridBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: '0.85rem' }}>
        No specs or gear items yet. Click Edit to add gear.
      </div>
    );
  }

  return (
    <div className="specs-grid">
      {list.map((item, idx) => (
        <div key={item.id || idx} className="spec-card">
          <div className="spec-icon">
            {iconMap[item.icon] || <Sparkles size={20} />}
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
