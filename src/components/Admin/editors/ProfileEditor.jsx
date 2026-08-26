import { User, Code2, Gamepad2, BookHeart, Globe, Mail, Eye, Sliders } from 'lucide-react';
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

export default function ProfileEditor({ data, setData, token }) {
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

  return (
    <div>
      {/* Section & Navigation Visibility Controls */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Eye size={16} /> Section Visibility & Publishing Controls
        </div>
        <p style={{ fontSize: '0.72rem', color: '#8892b0', marginTop: '-8px', marginBottom: '16px' }}>
          Instantly publish or hide entire sections, tabs, or whole website sides. Hidden sections will not be rendered on the public website.
        </p>

        {/* Top-level Side Toggles */}
        <div className="admin-visibility-section">
          <div className="admin-visibility-section-title">
            <Sliders size={14} /> Main Side Toggles (Top Switcher)
          </div>
          <div className="admin-field-grid">
            <AdminField
              label="Developer Side"
              value={getVisibility('sides.dev', true)}
              onChange={(v) => update('visibility.sides.dev', v)}
              type="toggle"
              placeholder="Show or hide Developer side in top navigation"
            />
            <AdminField
              label="Hobbies Side"
              value={getVisibility('sides.hobbies', true)}
              onChange={(v) => update('visibility.sides.hobbies', v)}
              type="toggle"
              placeholder="Show or hide Hobbies side in top navigation"
            />
            <AdminField
              label="Diary Side"
              value={getVisibility('sides.diary', true)}
              onChange={(v) => update('visibility.sides.diary', v)}
              type="toggle"
              placeholder="Show or hide Diary side in top navigation"
            />
          </div>
        </div>

        {/* Developer Side Section Toggles */}
        <div className="admin-visibility-section">
          <div className="admin-visibility-section-title">
            <Code2 size={14} /> Developer Side Elements
          </div>
          <div className="admin-field-grid">
            <AdminField
              label="Developer Hero (Header Block)"
              value={getVisibility('dev.hero', true)}
              onChange={(v) => update('visibility.dev.hero', v)}
              type="toggle"
              placeholder="Full developer hero / banner"
            />
            <AdminField
              label="Name & Identity (Aqil)"
              value={getVisibility('dev.name', true)}
              onChange={(v) => update('visibility.dev.name', v)}
              type="toggle"
              placeholder="Developer display name & title"
            />
            <AdminField
              label="Developer Avatar & Status"
              value={getVisibility('dev.avatar', true)}
              onChange={(v) => update('visibility.dev.avatar', v)}
              type="toggle"
            />
            <AdminField
              label="Developer Bio"
              value={getVisibility('dev.bio', true)}
              onChange={(v) => update('visibility.dev.bio', v)}
              type="toggle"
            />
            <AdminField
              label="Interactive Terminal Widget"
              value={getVisibility('dev.terminal', true)}
              onChange={(v) => update('visibility.dev.terminal', v)}
              type="toggle"
            />
            <AdminField
              label="Tech Stack Section"
              value={getVisibility('dev.skills', true)}
              onChange={(v) => update('visibility.dev.skills', v)}
              type="toggle"
            />
            <AdminField
              label="Featured Projects Section"
              value={getVisibility('dev.projects', true)}
              onChange={(v) => update('visibility.dev.projects', v)}
              type="toggle"
            />
            <AdminField
              label="Career Experience Section"
              value={getVisibility('dev.experience', true)}
              onChange={(v) => update('visibility.dev.experience', v)}
              type="toggle"
            />
            <AdminField
              label="Services & Commissions Section"
              value={getVisibility('dev.services', true)}
              onChange={(v) => update('visibility.dev.services', v)}
              type="toggle"
            />
            <AdminField
              label="Contact Section"
              value={getVisibility('dev.contact', true)}
              onChange={(v) => update('visibility.dev.contact', v)}
              type="toggle"
            />
          </div>
        </div>

        {/* Hobbies Side Section Toggles */}
        <div className="admin-visibility-section">
          <div className="admin-visibility-section-title">
            <Gamepad2 size={14} /> Hobbies & Gear Elements
          </div>
          <div className="admin-field-grid">
            <AdminField
              label="Hobbies Hero (Header Block)"
              value={getVisibility('hobbies.hero', true)}
              onChange={(v) => update('visibility.hobbies.hero', v)}
              type="toggle"
              placeholder="Full hobbies hero / banner"
            />
            <AdminField
              label="Gamertag & Role (NAS)"
              value={getVisibility('hobbies.gamertag', true)}
              onChange={(v) => update('visibility.hobbies.gamertag', v)}
              type="toggle"
              placeholder="Gamertag & game role"
            />
            <AdminField
              label="Hobbies Avatar & Rank Badge"
              value={getVisibility('hobbies.avatar', true)}
              onChange={(v) => update('visibility.hobbies.avatar', v)}
              type="toggle"
            />
            <AdminField
              label="Hobbies Bio & Tagline"
              value={getVisibility('hobbies.bio', true)}
              onChange={(v) => update('visibility.hobbies.bio', v)}
              type="toggle"
            />
            <AdminField
              label="Quick Stats Bar"
              value={getVisibility('hobbies.quickStats', true)}
              onChange={(v) => update('visibility.hobbies.quickStats', v)}
              type="toggle"
            />
            <AdminField
              label="Story Games"
              value={getVisibility('hobbies.storyGames', true)}
              onChange={(v) => update('visibility.hobbies.storyGames', v)}
              type="toggle"
            />
            <AdminField
              label="Currently Playing (Games)"
              value={getVisibility('hobbies.currentlyPlaying', true)}
              onChange={(v) => update('visibility.hobbies.currentlyPlaying', v)}
              type="toggle"
            />
            <AdminField
              label="Game Backlog"
              value={getVisibility('hobbies.backlog', true)}
              onChange={(v) => update('visibility.hobbies.backlog', v)}
              type="toggle"
            />
            <AdminField
              label="Gaming Philosophy"
              value={getVisibility('hobbies.philosophy', true)}
              onChange={(v) => update('visibility.hobbies.philosophy', v)}
              type="toggle"
            />
            <AdminField
              label="Favorite Movies & Series"
              value={getVisibility('hobbies.moviesList', true)}
              onChange={(v) => update('visibility.hobbies.moviesList', v)}
              type="toggle"
            />
            <AdminField
              label="Currently Watching (Movies)"
              value={getVisibility('hobbies.moviesWatching', true)}
              onChange={(v) => update('visibility.hobbies.moviesWatching', v)}
              type="toggle"
            />
            <AdminField
              label="Movies Watchlist Backlog"
              value={getVisibility('hobbies.moviesBacklog', true)}
              onChange={(v) => update('visibility.hobbies.moviesBacklog', v)}
              type="toggle"
            />
            <AdminField
              label="PC Hardware Specs"
              value={getVisibility('hobbies.specs', true)}
              onChange={(v) => update('visibility.hobbies.specs', v)}
              type="toggle"
            />
            <AdminField
              label="Battlestation Peripherals & Gear"
              value={getVisibility('hobbies.setup', true)}
              onChange={(v) => update('visibility.hobbies.setup', v)}
              type="toggle"
            />
          </div>
        </div>

        {/* Diary Side Section Toggles */}
        <div className="admin-visibility-section">
          <div className="admin-visibility-section-title">
            <BookHeart size={14} /> Diary Elements
          </div>
          <div className="admin-field-grid">
            <AdminField
              label="Diary Hero (Header Block)"
              value={getVisibility('diary.hero', true)}
              onChange={(v) => update('visibility.diary.hero', v)}
              type="toggle"
            />
            <AdminField
              label="Diary Profile Name & Tagline"
              value={getVisibility('diary.name', true)}
              onChange={(v) => update('visibility.diary.name', v)}
              type="toggle"
            />
            <AdminField
              label="Diary Avatar"
              value={getVisibility('diary.avatar', true)}
              onChange={(v) => update('visibility.diary.avatar', v)}
              type="toggle"
            />
            <AdminField
              label="Diary Bio & Stats Row"
              value={getVisibility('diary.bio', true)}
              onChange={(v) => update('visibility.diary.bio', v)}
              type="toggle"
            />
            <AdminField
              label="Pinned Quote"
              value={getVisibility('diary.pinnedQuote', true)}
              onChange={(v) => update('visibility.diary.pinnedQuote', v)}
              type="toggle"
            />
            <AdminField
              label="Recent Broadcasts Feed"
              value={getVisibility('diary.broadcasts', true)}
              onChange={(v) => update('visibility.diary.broadcasts', v)}
              type="toggle"
            />
          </div>
        </div>
      </div>
      {/* Dev Profile */}
      <div className="admin-form-group">
        <div className="admin-form-group-title">
          <Code2 size={16} /> Developer Profile
        </div>
        <div className="admin-field-grid">
          <AdminField label="Name" value={data.dev?.name} onChange={(v) => update('dev.name', v)} />
          <AdminField label="Status" value={data.dev?.status} onChange={(v) => update('dev.status', v)} />
          <AdminField label="Greeting" value={data.dev?.greeting} onChange={(v) => update('dev.greeting', v)} />
          <AdminField label="Avatar" value={data.dev?.avatar} onChange={(v) => update('dev.avatar', v)} type="image" token={token} fullWidth />
          <AdminField label="Title" value={data.dev?.title} onChange={(v) => update('dev.title', v)} fullWidth />
          <AdminField label="Bio" value={data.dev?.bio} onChange={(v) => update('dev.bio', v)} type="textarea" fullWidth />
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
          <BookHeart size={16} /> Diary Profile
        </div>
        <div className="admin-field-grid">
          <AdminField label="Name" value={data.diary?.name} onChange={(v) => update('diary.name', v)} />
          <AdminField label="Tagline" value={data.diary?.tagline} onChange={(v) => update('diary.tagline', v)} />
          <AdminField label="Avatar" value={data.diary?.avatar} onChange={(v) => update('diary.avatar', v)} type="image" token={token} fullWidth />
          <AdminField label="Bio" value={data.diary?.bio} onChange={(v) => update('diary.bio', v)} type="textarea" fullWidth />
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
          <AdminField label="Email" value={data.contact?.email} onChange={(v) => update('contact.email', v)} type="url" />
          <AdminField label="Button Text" value={data.contact?.buttonText} onChange={(v) => update('contact.buttonText', v)} />
          <AdminField label="Description" value={data.contact?.text} onChange={(v) => update('contact.text', v)} type="textarea" fullWidth />
        </div>
      </div>
    </div>
  );
}
