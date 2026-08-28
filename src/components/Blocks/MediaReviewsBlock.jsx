import { Star } from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

export default function MediaReviewsBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: '0.85rem' }}>
        No media reviews yet. Click Edit to add reviews.
      </div>
    );
  }

  return (
    <div className="reviews-grid">
      {list.map((item, idx) => {
        const cover = item.coverImage || item.imageUrl || item.image || item.cover;
        const genres = Array.isArray(item.genre)
          ? item.genre
          : typeof item.genre === 'string' && item.genre.trim()
          ? item.genre.includes(',')
            ? item.genre.split(',').map((g) => g.trim()).filter(Boolean)
            : [item.genre.trim()]
          : [];

        return (
          <div key={item.id || idx} className="review-card">
            {cover && (
              <div className="review-media">
                <OptimizedImage
                  src={cover}
                  alt={item.title}
                  className="review-img"
                  width={300}
                  height={160}
                />
                {item.status && <span className="review-status">{item.status}</span>}
              </div>
            )}

            <div className="review-body">
              <h4 className="review-title">{item.title}</h4>

              {item.rating > 0 && (
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < item.rating ? '#fbbf24' : 'none'}
                      color={i < item.rating ? '#fbbf24' : '#555'}
                    />
                  ))}
                </div>
              )}

              {item.notes && <p className="review-note">{item.notes}</p>}

              {genres.length > 0 && (
                <div className="card-tags" style={{ marginTop: '12px', marginBottom: 0 }}>
                  {genres.map((g, gIdx) => (
                    <span key={gIdx} className="card-tag">{g}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
