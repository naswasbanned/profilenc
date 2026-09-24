import './MobileBrandBar.css';

/**
 * Centered brand row for the top of a panel, phone only.
 *
 * The same static row the landing page shows once its header hands over to the
 * bottom dock: logo mark plus the wordmark, no actions. Every navigation action
 * lives in the MobileDock, so this row is decoration and orientation only.
 *
 * Hidden from 769px up, where each page keeps its own header.
 *
 * @param {string} [label]  Wordmark text.
 */
export default function MobileBrandBar({ label = 'Profilenc' }) {
  return (
    <div className="app-brandbar">
      <span className="app-brandbar-mark">
        <img src="/logo.svg" alt="" aria-hidden="true" />
      </span>
      <span className="app-brandbar-name">{label}</span>
    </div>
  );
}
