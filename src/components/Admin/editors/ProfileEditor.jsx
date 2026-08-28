import { useState } from 'react';
import {
  User,
  Code2,
  Gamepad2,
  BookHeart,
  Globe,
  Mail,
  Eye,
  Sliders,
  Film,
  Cpu,
  Layers,
  Search,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import AdminField from '../shared/AdminField';

function updateNested(obj, path, value) {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

const VISIBILITY_GROUPS = [
  {
    id: 'sides',
    title: 'Top Navigation Sides',
    subtitle: 'Global switcher bar at the top of the website',
    icon: Sliders,
    color: '#64ffda',
    subgroups: [
      {
        name: 'Main Website Sides',
        icon: Sliders,
        items: [
          { key: 'sides.dev', label: 'Developer Side', desc: 'Main Developer view & navigation tab' },
          { key: 'sides.hobbies', label: 'Hobbies Side', desc: 'Main Hobbies view & navigation tab' },
          { key: 'sides.diary', label: 'Diary Side', desc: 'Main Diary view & navigation tab' },
        ],
      },
    ],
  },
  {
    id: 'dev',
    title: 'Developer Side',
    subtitle: 'Hero banner, identity info, and portfolio sections',
    icon: Code2,
    color: '#64ffda',
    subgroups: [
      {
        name: 'Profile & Hero Identity',
        icon: User,
        items: [
          { key: 'dev.hero', label: 'Developer Hero Banner', desc: 'Full top hero container' },
          { key: 'dev.name', label: 'Display Name (Aqil)', desc: 'Greeting, name and developer title' },
          { key: 'dev.avatar', label: 'Avatar & Status Pill', desc: 'Profile photo and online status indicator' },
          { key: 'dev.bio', label: 'Developer Bio', desc: 'About summary paragraph' },
          { key: 'dev.socials', label: 'Developer Social Links (GitHub, LinkedIn, Email, Instagram)', desc: 'Social icon buttons in Developer hero' },
          { key: 'dev.terminal', label: 'Interactive Terminal', desc: 'Terminal window widget' },
        ],
      },
      {
        name: 'Portfolio & Content Sections',
        icon: Layers,
        items: [
          { key: 'dev.skills', label: 'Tech Stack Section', desc: 'Skills & expertise grid' },
          { key: 'dev.projects', label: 'Featured Projects Section', desc: 'Showcase projects with stars' },
          { key: 'dev.experience', label: 'Career Experience Section', desc: 'Work history timeline' },
          { key: 'dev.services', label: 'Services & Commissions Section', desc: 'Offerings with pricing' },
          { key: 'dev.contact', label: 'Contact Section', desc: 'Get in touch footer section' },
        ],
      },
    ],
  },
  {
    id: 'hobbies',
    title: 'Hobbies Side',
    subtitle: 'Hero identity, sub-tab bar, games, movies, and hardware gear',
    icon: Gamepad2,
    color: '#a855f7',
    subgroups: [
      {
        name: 'Profile & Hero Identity',
        icon: User,
        items: [
          { key: 'hobbies.hero', label: 'Hobbies Hero Banner', desc: 'Full hobbies hero container' },
          { key: 'hobbies.gamertag', label: 'Gamertag & Role (NAS)', desc: 'Main gamer alias and subtitle' },
          { key: 'hobbies.avatar', label: 'Avatar & Rank Badge', desc: 'Gamer avatar and rank pill' },
          { key: 'hobbies.bio', label: 'Bio & Tagline', desc: 'Gamer tagline and bio text' },
          { key: 'hobbies.quickStats', label: 'Quick Stats Bar', desc: 'Gaming summary stats row' },
        ],
      },
      {
        name: 'Navigation Sub-Tabs (Select Bar)',
        icon: Sliders,
        items: [
          { key: 'hobbies.gamesTab', label: 'Games Tab (Select Bar)', desc: 'Show or hide Games in Hobbies tab bar' },
          { key: 'hobbies.moviesTab', label: 'Movies & Series Tab (Select Bar)', desc: 'Show or hide Movies & Series in Hobbies tab bar' },
          { key: 'hobbies.gearsTab', label: 'Gears Tab (Select Bar)', desc: 'Show or hide Gears in Hobbies tab bar' },
        ],
      },
      {
        name: 'Gaming Content Sections',
        icon: Gamepad2,
        items: [
          { key: 'hobbies.storyGames', label: 'Story Games Section', desc: 'Favorite narrative games' },
          { key: 'hobbies.currentlyPlaying', label: 'Currently Playing Section', desc: 'Active games with progress bar' },
          { key: 'hobbies.backlog', label: 'Game Backlog Section', desc: 'Games queue watchlist' },
          { key: 'hobbies.philosophy', label: 'Gaming Philosophy Section', desc: 'Playstyle principles' },
        ],
      },
      {
        name: 'Movies & Series Content Sections',
        icon: Film,
        items: [
          { key: 'hobbies.moviesList', label: 'Favorite Movies & Series Section', desc: 'Ranked films & shows' },
          { key: 'hobbies.moviesWatching', label: 'Currently Watching Section', desc: 'Active shows with progress' },
          { key: 'hobbies.moviesBacklog', label: 'Cinema Watchlist Backlog', desc: 'Queued films & series' },
        ],
      },
      {
        name: 'Hardware & Battlestation Sections',
        icon: Cpu,
        items: [
          { key: 'hobbies.specs', label: 'PC Hardware Specs Section', desc: 'System specs list' },
          { key: 'hobbies.setup', label: 'Peripherals & Gear Section', desc: 'Desk setup and accessories' },
        ],
      },
    ],
  },
  {
    id: 'diary',
    title: 'Diary Side',
    subtitle: 'Journal header, author bio, and broadcasts feed',
    icon: BookHeart,
    color: '#f43f5e',
    subgroups: [
      {
        name: 'Profile & Hero Identity',
        icon: User,
        items: [
          { key: 'diary.hero', label: 'Diary Hero Banner', desc: 'Full journal header container' },
          { key: 'diary.name', label: 'Author Name & Tagline', desc: 'Journalist display name and subtitle' },
          { key: 'diary.avatar', label: 'Diary Avatar', desc: 'Profile photo' },
          { key: 'diary.bio', label: 'Diary Bio & Stats Row', desc: 'Journal overview and counter pills' },
          { key: 'diary.socials', label: 'Diary Social Links (GitHub, LinkedIn, Email, Instagram)', desc: 'Social icon buttons in Diary hero' },
        ],
      },
      {
        name: 'Journal Content Sections',
        icon: Layers,
        items: [
          { key: 'diary.pinnedQuote', label: 'Pinned Quote Block', desc: 'Featured thought block' },
          { key: 'diary.broadcasts', label: 'Recent Broadcasts Feed', desc: 'Chronological journal posts' },
        ],
      },
    ],
  },
];

export default function ProfileEditor({ data, setData, token }) {
  const [activeVisTab, setActiveVisTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!data) return null;

  const update = (path, value) => {
    setData(updateNested(data, path, value));
  };

  const getVisibility = (path, defaultValue = true) => {
    const keys = path.split('.');
    let cur = data.visibility;
    for (const k of keys) {
      if (!cur || cur[k] === undefined) return defaultValue;
      cur = cur[k];
    }
    return cur !== false;
  };

  const getSocialUrl = (section, platform) => {
    const socials = data[section]?.socials || [];
    const item = socials.find((s) => s.platform.toLowerCase() === platform.toLowerCase());
    return item ? item.url : '';
  };

  const updateSocialUrl = (section, platform, icon, url) => {
    let socials = [...(data[section]?.socials || [])];
    const idx = socials.findIndex((s) => s.platform.toLowerCase() === platform.toLowerCase());
    if (idx >= 0) {
      if (!url.trim()) {
        socials.splice(idx, 1);
      } else {
        socials[idx] = { ...socials[idx], url, icon };
      }
    } else if (url.trim()) {
      socials.push({ platform, url, icon });
    }
    update(`${section}.socials`, socials);
  };

  // Filter groups based on active category tab & search query
  const query = searchQuery.trim().toLowerCase();

  const filteredGroups = VISIBILITY_GROUPS.filter((group) => {
    if (activeVisTab !== 'all' && group.id !== activeVisTab) return false;
    return true;
  }).map((group) => {
    if (!query) return group;
    const matchingSubgroups = group.subgroups.map((sub) => {
      const matchingItems = sub.items.filter((item) =>
        item.label.toLowerCase().includes(query) ||
        (item.desc && item.desc.toLowerCase().includes(query)) ||
        sub.name.toLowerCase().includes(query)
      );
      return { ...sub, items: matchingItems };
    }).filter((sub) => sub.items.length > 0);

    return { ...group, subgroups: matchingSubgroups };
  }).filter((group) => group.subgroups.length > 0);

  return (
    <div>
      {/* Section & Navigation Visibility Controls */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Eye size={16} /> Section Visibility & Publishing Controls
        </div>

        <div className="admin-vis-header">
          <p style={{ fontSize: '0.72rem', color: '#8892b0', marginTop: '-8px', marginBottom: '14px' }}>
            Instantly publish or hide entire sections, tabs, or whole website sides. Hidden items are never rendered on the public website.
          </p>

          {/* Category Tabs & Search Bar */}
          <div className="admin-vis-nav">
            <div className="admin-vis-tabs">
              <button
                type="button"
                className={`admin-vis-tab-btn ${activeVisTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveVisTab('all')}
              >
                <Sparkles size={13} />
                <span>All Sections</span>
              </button>
              <button
                type="button"
                className={`admin-vis-tab-btn ${activeVisTab === 'sides' ? 'active' : ''}`}
                onClick={() => setActiveVisTab('sides')}
              >
                <Sliders size={13} />
                <span>Top Sides</span>
              </button>
              <button
                type="button"
                className={`admin-vis-tab-btn ${activeVisTab === 'dev' ? 'active' : ''}`}
                onClick={() => setActiveVisTab('dev')}
              >
                <Code2 size={13} />
                <span>Developer</span>
              </button>
              <button
                type="button"
                className={`admin-vis-tab-btn ${activeVisTab === 'hobbies' ? 'active' : ''}`}
                onClick={() => setActiveVisTab('hobbies')}
              >
                <Gamepad2 size={13} />
                <span>Hobbies</span>
              </button>
              <button
                type="button"
                className={`admin-vis-tab-btn ${activeVisTab === 'diary' ? 'active' : ''}`}
                onClick={() => setActiveVisTab('diary')}
              >
                <BookHeart size={13} />
                <span>Diary</span>
              </button>
            </div>

            <div className="admin-vis-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search visibility (e.g. movies, hero)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', padding: 0 }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categorized Visibility Cards */}
        {filteredGroups.length === 0 ? (
          <div className="admin-empty" style={{ padding: '32px 16px' }}>
            <Search size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No visibility settings match &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.id} className="admin-vis-group-card">
                <div className="admin-vis-group-header">
                  <div className="admin-vis-group-title-wrapper">
                    <div className="admin-vis-group-icon" style={{ color: group.color }}>
                      <GroupIcon size={16} />
                    </div>
                    <div>
                      <div className="admin-vis-group-title">{group.title}</div>
                      <div className="admin-vis-group-sub">{group.subtitle}</div>
                    </div>
                  </div>
                </div>

                {group.subgroups.map((sub, sIdx) => {
                  const SubIcon = sub.icon || Layers;
                  return (
                    <div key={sIdx} className="admin-vis-subgroup">
                      <div className="admin-vis-subgroup-title">
                        <SubIcon size={12} />
                        <span>{sub.name}</span>
                      </div>
                      <div className="admin-field-grid">
                        {sub.items.map((item) => (
                          <AdminField
                            key={item.key}
                            label={item.label}
                            value={getVisibility(item.key, true)}
                            onChange={(v) => update(`visibility.${item.key}`, v)}
                            type="toggle"
                            placeholder={item.desc}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
      {/* Dev Profile */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Code2 size={16} /> Developer Profile & Identity
        </div>
        <div className="admin-field-grid">
          <AdminField label="Name" value={data.dev?.name} onChange={(v) => update('dev.name', v)} />
          <AdminField label="Status" value={data.dev?.status} onChange={(v) => update('dev.status', v)} />
          <AdminField label="Greeting" value={data.dev?.greeting} onChange={(v) => update('dev.greeting', v)} />
          <AdminField label="Avatar" value={data.dev?.avatar} onChange={(v) => update('dev.avatar', v)} type="image" token={token} fullWidth />
          <AdminField label="Title" value={data.dev?.title} onChange={(v) => update('dev.title', v)} fullWidth />
          <AdminField label="Bio" value={data.dev?.bio} onChange={(v) => update('dev.bio', v)} type="textarea" fullWidth />
          <AdminField label="GitHub Profile URL" value={getSocialUrl('dev', 'GitHub')} onChange={(v) => updateSocialUrl('dev', 'GitHub', 'Github', v)} placeholder="https://github.com/..." />
          <AdminField label="LinkedIn Profile URL" value={getSocialUrl('dev', 'LinkedIn')} onChange={(v) => updateSocialUrl('dev', 'LinkedIn', 'Linkedin', v)} placeholder="https://linkedin.com/in/..." />
          <AdminField label="Email Address / Mailto" value={getSocialUrl('dev', 'Email')} onChange={(v) => updateSocialUrl('dev', 'Email', 'Mail', v)} placeholder="e.g. you@example.com or mailto:you@example.com" />
          <AdminField label="Instagram Profile URL" value={getSocialUrl('dev', 'Instagram')} onChange={(v) => updateSocialUrl('dev', 'Instagram', 'Instagram', v)} placeholder="https://instagram.com/..." />
        </div>
      </div>

      {/* Hobbies Profile */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Gamepad2 size={16} /> Hobbies Profile
        </div>
        <div className="admin-field-grid">
          <AdminField label="Gamertag" value={data.hobbies?.gamertag} onChange={(v) => update('hobbies.gamertag', v)} />
          <AdminField label="Rank Badge" value={data.hobbies?.rankBadge} onChange={(v) => update('hobbies.rankBadge', v)} />
          <AdminField label="Tagline" value={data.hobbies?.tagline} onChange={(v) => update('hobbies.tagline', v)} />
          <AdminField label="Avatar" value={data.hobbies?.avatar} onChange={(v) => update('hobbies.avatar', v)} type="image" token={token} fullWidth />
          <AdminField label="Role" value={data.hobbies?.role} onChange={(v) => update('hobbies.role', v)} fullWidth />
          <AdminField label="Bio" value={data.hobbies?.bio} onChange={(v) => update('hobbies.bio', v)} type="textarea" fullWidth />
        </div>
      </div>

      {/* Diary Profile */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <BookHeart size={16} /> Diary Profile & Identity
        </div>
        <div className="admin-field-grid">
          <AdminField label="Name" value={data.diary?.name} onChange={(v) => update('diary.name', v)} />
          <AdminField label="Tagline" value={data.diary?.tagline} onChange={(v) => update('diary.tagline', v)} />
          <AdminField label="Avatar" value={data.diary?.avatar} onChange={(v) => update('diary.avatar', v)} type="image" token={token} fullWidth />
          <AdminField label="Bio" value={data.diary?.bio} onChange={(v) => update('diary.bio', v)} type="textarea" fullWidth />
          <AdminField label="GitHub Profile URL" value={getSocialUrl('diary', 'GitHub')} onChange={(v) => updateSocialUrl('diary', 'GitHub', 'Github', v)} placeholder="https://github.com/..." />
          <AdminField label="LinkedIn Profile URL" value={getSocialUrl('diary', 'LinkedIn')} onChange={(v) => updateSocialUrl('diary', 'LinkedIn', 'Linkedin', v)} placeholder="https://linkedin.com/in/..." />
          <AdminField label="Email Address / Mailto" value={getSocialUrl('diary', 'Email')} onChange={(v) => updateSocialUrl('diary', 'Email', 'Mail', v)} placeholder="e.g. you@example.com or mailto:you@example.com" />
          <AdminField label="Instagram Profile URL" value={getSocialUrl('diary', 'Instagram')} onChange={(v) => updateSocialUrl('diary', 'Instagram', 'Instagram', v)} placeholder="https://instagram.com/..." />
          <AdminField label="Pinned Quote" value={data.diary?.pinnedQuote} onChange={(v) => update('diary.pinnedQuote', v)} type="textarea" fullWidth />
        </div>
      </div>

      {/* Footer */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Globe size={16} /> Footer
        </div>
        <div className="admin-field-grid">
          <AdminField label="Copyright" value={data.footer?.copyright} onChange={(v) => update('footer.copyright', v)} />
          <AdminField label="Dev Tagline" value={data.footer?.devTagline} onChange={(v) => update('footer.devTagline', v)} />
          <AdminField label="Hobbies Tagline" value={data.footer?.hobbiesTagline} onChange={(v) => update('footer.hobbiesTagline', v)} />
          <AdminField label="Diary Tagline" value={data.footer?.diaryTagline} onChange={(v) => update('footer.diaryTagline', v)} />
        </div>
      </div>

      {/* Contact */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Mail size={16} /> Contact
        </div>
        <div className="admin-field-grid">
          <AdminField label="Heading" value={data.contact?.heading} onChange={(v) => update('contact.heading', v)} />
          <AdminField label="Email / Contact Link" value={data.contact?.email || data.contact?.url || ''} onChange={(v) => { update('contact.email', v); update('contact.url', v); }} placeholder="e.g. you@example.com or https://cal.com/..." />
          <AdminField label="Button Text" value={data.contact?.buttonText} onChange={(v) => update('contact.buttonText', v)} placeholder="e.g. Get in Touch" />
          <AdminField label="Description" value={data.contact?.text} onChange={(v) => update('contact.text', v)} type="textarea" fullWidth />
        </div>
      </div>
    </div>
  );
}
