import {
  Cpu,
  Tv,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Fan,
  Box,
  Server,
  Database,
  Monitor,
  ScreenShare,
  Projector,
  Keyboard,
  Mouse,
  MousePointer,
  Gamepad2,
  Sliders,
  SlidersHorizontal,
  Printer,
  Headphones,
  Mic,
  Mic2,
  Speaker,
  Volume2,
  Radio,
  Music,
  Camera,
  Video,
  Film,
  Sun,
  Lightbulb,
  Eye,
  Glasses,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  BatteryCharging,
  Battery,
  Wifi,
  Router,
  Network,
  Cable,
  Coffee,
  Shield,
  Sparkles,
  Star,
  Wrench,
  Usb,
} from 'lucide-react';

// Icon component dictionary
export const GEAR_ICON_COMPONENTS = {
  // Core Hardware
  Cpu,
  CircuitBoard,
  HardDrive,
  Layers,
  Zap,
  Fan,
  Box,
  Server,
  Database,
  Usb,

  // Displays
  Monitor,
  Tv,
  ScreenShare,
  Projector,

  // Peripherals
  Keyboard,
  Mouse,
  MousePointer,
  Gamepad2,
  Sliders,
  SlidersHorizontal,
  Printer,

  // Audio & Studio
  Headphones,
  Mic,
  Mic2,
  Speaker,
  Volume2,
  Radio,
  Music,

  // Camera & Lighting
  Camera,
  Video,
  Film,
  Sun,
  Lightbulb,
  Eye,
  Glasses,

  // Devices & Mobile
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  BatteryCharging,
  Battery,

  // Setup, Desk & Network
  Wifi,
  Router,
  Network,
  Cable,
  Coffee,
  Shield,
  Sparkles,
  Star,
  Wrench,
};

// Categorized icon presets for the visual selector
export const GEAR_ICON_CATEGORIES = [
  {
    group: 'Core PC Hardware',
    icons: [
      { id: 'Cpu', label: 'CPU / Processor' },
      { id: 'CircuitBoard', label: 'Motherboard / GPU' },
      { id: 'Tv', label: 'Graphics Card / Video' },
      { id: 'HardDrive', label: 'SSD / NVMe / HDD' },
      { id: 'Layers', label: 'RAM / Memory' },
      { id: 'Zap', label: 'Power Supply / PSU' },
      { id: 'Fan', label: 'Cooling / AIO / Fan' },
      { id: 'Box', label: 'PC Case / Chassis' },
      { id: 'Server', label: 'Home Server / NAS' },
      { id: 'Database', label: 'Storage Array' },
      { id: 'Usb', label: 'USB Drive / Dongle' },
    ],
  },
  {
    group: 'Monitors & Displays',
    icons: [
      { id: 'Monitor', label: 'Main Monitor' },
      { id: 'ScreenShare', label: 'Secondary / Portable Screen' },
      { id: 'Tv', label: 'TV / Large Display' },
      { id: 'Projector', label: 'Projector' },
    ],
  },
  {
    group: 'Keyboards, Mice & Input',
    icons: [
      { id: 'Keyboard', label: 'Mechanical Keyboard' },
      { id: 'Mouse', label: 'Mouse / Trackball' },
      { id: 'MousePointer', label: 'Drawing Tablet / Stylus' },
      { id: 'Gamepad2', label: 'Controller / Gamepad' },
      { id: 'Sliders', label: 'Stream Deck / Macro Pad' },
      { id: 'SlidersHorizontal', label: 'Mixer / Control Surface' },
      { id: 'Printer', label: '3D Printer / Scanner' },
    ],
  },
  {
    group: 'Audio & Studio Gear',
    icons: [
      { id: 'Headphones', label: 'Headphones / IEMs' },
      { id: 'Mic', label: 'Microphone / Studio Mic' },
      { id: 'Mic2', label: 'Dynamic / Podcaster Mic' },
      { id: 'Speaker', label: 'Studio Monitors' },
      { id: 'Volume2', label: 'Desktop Speakers' },
      { id: 'Radio', label: 'DAC / AMP / Interface' },
      { id: 'Music', label: 'Synthesizer / Instrument' },
    ],
  },
  {
    group: 'Cameras, Video & Lighting',
    icons: [
      { id: 'Camera', label: 'Camera / DSLR / Mirrorless' },
      { id: 'Video', label: 'Webcam / Camcorder' },
      { id: 'Film', label: 'Capture Card / Lens' },
      { id: 'Sun', label: 'Key Light / Studio Light' },
      { id: 'Lightbulb', label: 'Desk Lamp / RGB Light' },
      { id: 'Eye', label: 'Sensor / Eye Tracker' },
      { id: 'Glasses', label: 'VR Headset / AR Glasses' },
    ],
  },
  {
    group: 'Laptops, Mobile & Wearables',
    icons: [
      { id: 'Laptop', label: 'Laptop / MacBook' },
      { id: 'Smartphone', label: 'Smartphone' },
      { id: 'Tablet', label: 'Tablet / iPad' },
      { id: 'Watch', label: 'Smartwatch' },
      { id: 'BatteryCharging', label: 'Charger / Power Bank / Dock' },
      { id: 'Battery', label: 'Battery / UPS' },
    ],
  },
  {
    group: 'Desk, Network & Tools',
    icons: [
      { id: 'Wifi', label: 'Wi-Fi / Wireless' },
      { id: 'Router', label: 'Router / Switch' },
      { id: 'Network', label: 'Ethernet / LAN' },
      { id: 'Cable', label: 'Custom Cable / Hub' },
      { id: 'Coffee', label: 'Desk / Chair / Setup' },
      { id: 'Shield', label: 'Surge Protector' },
      { id: 'Wrench', label: 'Tools / Modding' },
      { id: 'Sparkles', label: 'Custom Mod / Special' },
      { id: 'Star', label: 'Favorite Gear' },
    ],
  },
];

/**
 * Smart auto-matcher: given a category or item name, guesses the best icon if not explicitly set
 */
export function guessGearIcon(category = '', name = '') {
  const text = `${category} ${name}`.toLowerCase();

  // CPU / Processor
  if (text.includes('cpu') || text.includes('processor') || text.includes('ryzen') || text.includes('intel') || text.includes('core i')) {
    return 'Cpu';
  }
  // GPU / Graphics
  if (text.includes('gpu') || text.includes('graphics') || text.includes('rtx') || text.includes('gtx') || text.includes('radeon') || text.includes('vga')) {
    return 'Tv';
  }
  // Motherboard
  if (text.includes('motherboard') || text.includes('mobo') || text.includes('mainboard') || text.includes('b650') || text.includes('z790') || text.includes('x670')) {
    return 'CircuitBoard';
  }
  // Storage / SSD / HDD
  if (text.includes('ssd') || text.includes('hdd') || text.includes('nvme') || text.includes('storage') || text.includes('drive') || text.includes('samsung 9')) {
    return 'HardDrive';
  }
  // RAM / Memory
  if (text.includes('ram') || text.includes('memory') || text.includes('ddr4') || text.includes('ddr5') || text.includes('corsair')) {
    return 'Layers';
  }
  // Power Supply / PSU
  if (text.includes('psu') || text.includes('power') || text.includes('watt') || text.includes('power supply')) {
    return 'Zap';
  }
  // Cooling
  if (text.includes('cooler') || text.includes('fan') || text.includes('aio') || text.includes('liquid') || text.includes('noctua') || text.includes('kraken')) {
    return 'Fan';
  }
  // Case / Chassis
  if (text.includes('case') || text.includes('chassis') || text.includes('tower') || text.includes('lian li') || text.includes('nzxt')) {
    return 'Box';
  }
  // Monitor / Display
  if (text.includes('monitor') || text.includes('display') || text.includes('screen') || text.includes('hz') || text.includes('ultrawide') || text.includes('oled')) {
    return 'Monitor';
  }
  // Keyboard
  if (text.includes('keyboard') || text.includes('keychron') || text.includes('switches') || text.includes('keycap') || text.includes('gmmk')) {
    return 'Keyboard';
  }
  // Mouse
  if (text.includes('mouse') || text.includes('trackball') || text.includes('superlight') || text.includes('logitech g') || text.includes('razer')) {
    return 'Mouse';
  }
  // Headphones / Audio
  if (text.includes('headphone') || text.includes('earphone') || text.includes('iem') || text.includes('sennheiser') || text.includes('audio technica') || text.includes('sony wh') || text.includes('airpods')) {
    return 'Headphones';
  }
  // Microphone
  if (text.includes('mic') || text.includes('microphone') || text.includes('shure') || text.includes('rode') || text.includes('blue yeti') || text.includes('quadcast')) {
    return 'Mic';
  }
  // Speakers
  if (text.includes('speaker') || text.includes('audio') || text.includes('soundbar') || text.includes('monitors')) {
    return 'Speaker';
  }
  // DAC / AMP / Mixer / Stream Deck
  if (text.includes('dac') || text.includes('amp') || text.includes('mixer') || text.includes('interface') || text.includes('stream deck') || text.includes('elgato') || text.includes('focusrite')) {
    return 'Sliders';
  }
  // Camera / Webcam
  if (text.includes('camera') || text.includes('lens') || text.includes('dslr') || text.includes('mirrorless') || text.includes('sony a') || text.includes('canon')) {
    return 'Camera';
  }
  if (text.includes('webcam') || text.includes('cam') || text.includes('brio') || text.includes('c920')) {
    return 'Video';
  }
  // Light / Lamp
  if (text.includes('light') || text.includes('lamp') || text.includes('screenbar') || text.includes('benq') || text.includes('rgb') || text.includes('led')) {
    return 'Lightbulb';
  }
  // Laptop / Mac
  if (text.includes('laptop') || text.includes('macbook') || text.includes('thinkpad') || text.includes('notebook') || text.includes('zephyrus')) {
    return 'Laptop';
  }
  // Phone
  if (text.includes('phone') || text.includes('iphone') || text.includes('pixel') || text.includes('galaxy') || text.includes('android')) {
    return 'Smartphone';
  }
  // Tablet
  if (text.includes('tablet') || text.includes('ipad') || text.includes('stylus') || text.includes('wacom')) {
    return 'Tablet';
  }
  // Controller
  if (text.includes('controller') || text.includes('gamepad') || text.includes('ps5') || text.includes('xbox') || text.includes('nintendo') || text.includes('dualense')) {
    return 'Gamepad2';
  }
  // Desk / Chair
  if (text.includes('chair') || text.includes('desk') || text.includes('herman miller') || text.includes('secretlab') || text.includes('standing desk')) {
    return 'Coffee';
  }
  // Network / Router
  if (text.includes('router') || text.includes('wifi') || text.includes('lan') || text.includes('ethernet') || text.includes('switch') || text.includes('network')) {
    return 'Wifi';
  }

  return 'Cpu';
}

/**
 * Universal Gear Icon Component
 */
export function GearIcon({ icon = '', category = '', name = '', size = 20, className = '' }) {
  let iconKey = icon;
  if (!iconKey || !GEAR_ICON_COMPONENTS[iconKey]) {
    iconKey = guessGearIcon(category, name);
  }

  const Component = GEAR_ICON_COMPONENTS[iconKey] || Cpu;
  return <Component size={size} className={className} />;
}
