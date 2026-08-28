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
      {list.map((item, idx) => (
        <div key={item.id || idx} className="review-card">
          {item.coverImage && (
            <div className="review-media">
              <OptimizedImage
                src={item.coverImage}
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

            {item.genre && (
              <div className="card-tags" style={{ marginTop: '12px', marginBottom: 0 }}>
                {Array.isArray(item.genre) ? (
                  item.genre.map((g, gIdx) => <span key={gIdx} className="card-tag">{g}</span>)
                ) : (
                  <span className="card-tag">{item.genre}</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
