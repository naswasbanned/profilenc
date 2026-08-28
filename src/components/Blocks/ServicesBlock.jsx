import { motion } from 'framer-motion';
import { Check, Sparkles, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

export default function ServicesBlock({ data = {} }) {
  const {
    items = [],
    columns = 2,
  } = data;

  const serviceList = Array.isArray(items) ? items : [];

  if (serviceList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#888', fontSize: '0.85rem' }}>
        No services or commission tiers yet. Click Edit to add services.
      </div>
    );
  }

  const getColClass = () => {
    if (columns === 1) return 'cols-1';
    if (columns === 3) return 'cols-3';
    return 'cols-2';
  };

  return (
    <div className={`services-grid ${getColClass()}`}>
      {serviceList.map((service, idx) => {
        const isFeatured = service.featured || service.highlight;
        const cover = service.imageUrl || service.coverUrl;
        const features = Array.isArray(service.features)
          ? service.features
          : typeof service.features === 'string'
          ? service.features.split('\n').filter(Boolean)
          : [];

        return (
          <div
            key={service.id || idx}
            className={`service-card ${isFeatured ? 'featured' : ''} ${cover ? 'has-media' : ''}`}
          >
            {/* Service Cover / Preview Image */}
            {cover && (
              <div className="service-card-media">
                <OptimizedImage
                  src={cover}
                  alt={service.title || 'Service preview'}
                  className="service-card-img"
                />
              </div>
            )}

            <div className="service-card-content">
              {/* Top Badges */}
              <div className="service-card-header">
                <div className="service-status-wrap">
                  {service.status && (
                    <span className={`service-status-pill ${service.status.toLowerCase().includes('open') || service.status.toLowerCase().includes('avail') ? 'available' : ''}`}>
                      <span className="service-status-dot" />
                      {service.status}
                    </span>
                  )}
                  {isFeatured && (
                    <span className="service-featured-pill">
                      <Sparkles size={11} /> Featured
                    </span>
                  )}
                </div>

                {service.deliveryTime && (
                  <span className="service-delivery-pill">
                    <Clock size={11} /> {service.deliveryTime}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <h3 className="service-title">{service.title || 'Service Title'}</h3>

              {service.price && (
                <div className="service-price-wrap">
                  <span className="service-price">{service.price}</span>
                  {service.period && <span className="service-period">/ {service.period}</span>}
                </div>
              )}

              {/* Description */}
              {service.description && (
                <p className="service-description">{service.description}</p>
              )}

              {/* Deliverables / Features List */}
              {features.length > 0 && (
                <ul className="service-features-list">
                  {features.map((feat, fIdx) => (
                    <li key={fIdx} className="service-feature-item">
                      <Check size={14} className="service-feature-icon" />
                      <span>{typeof feat === 'string' ? feat : feat.text || ''}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action CTA Button */}
              {(service.ctaLabel || service.ctaUrl) && (
                <div className="service-footer">
                  <a
                    href={service.ctaUrl || '#contact'}
                    target={service.ctaUrl?.startsWith('http') ? '_blank' : undefined}
                    rel={service.ctaUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`service-cta-btn ${isFeatured ? 'primary' : 'secondary'}`}
                  >
                    <span>{service.ctaLabel || 'Inquire Now'}</span>
                    {service.ctaUrl?.startsWith('http') ? (
                      <ExternalLink size={14} />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
