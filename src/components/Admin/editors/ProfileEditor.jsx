import { User, Code2, Gamepad2, BookHeart, Globe, Mail } from 'lucide-react';
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

  return (
    <div>
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
