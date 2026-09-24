/**
 * Style attributes that the profile canvas puts on its root element.
 *
 * Block styles key off these `data-*` values, so anything that renders a block
 * outside the canvas (the editor preview) has to apply the same set or the
 * block will look different from the published page.
 */
export function getCanvasStyleAttributes(theme) {
  const design = theme?.global?.designStyle || 'field-notes';

  const pillStyle = theme?.global?.pillStyle
    || (design === 'field-notes' ? 'editorial-bordered' : 'rounded-glow');

  let buttonStyle = theme?.global?.buttonStyle;
  if (!buttonStyle) {
    if (design === 'field-notes') buttonStyle = 'editorial-tactile';
    else if (design === 'neo-brutalist') buttonStyle = 'neo-brutalist';
    else if (design === 'midnight-violet') buttonStyle = 'rounded-glow';
    else buttonStyle = 'flat-border';
  }

  const iconStyle = theme?.global?.iconStyle
    || (design === 'field-notes' ? 'bordered-box' : 'glass-accent');

  return {
    'data-design-style': design,
    'data-pill-style': pillStyle,
    'data-button-style': buttonStyle,
    'data-icon-style': iconStyle,
  };
}

/**
 * Background of a tab, falling back to the global theme values.
 * `tabId` may be undefined, in which case only the global values are used.
 */
export function getCanvasBackground(theme, tabId) {
  const tabTheme = tabId ? theme?.tabs?.[tabId] : null;

  return {
    backgroundColor: tabTheme?.backgroundColor || theme?.global?.backgroundColor || '#090a0f',
    backgroundGradient: tabTheme?.backgroundGradient || theme?.global?.backgroundGradient || null,
    tabNavBackground: tabTheme?.tabNavBackground || theme?.global?.tabNavBackground || null,
    backgroundImage: tabTheme?.backgroundImage || theme?.global?.backgroundImage || null,
    backgroundOverlayOpacity:
      tabTheme?.backgroundOverlayOpacity ?? theme?.global?.backgroundOverlayOpacity ?? 0.75,
    backgroundOverlayColor:
      tabTheme?.backgroundOverlayColor
      || theme?.global?.backgroundOverlayColor
      || tabTheme?.backgroundColor
      || theme?.global?.backgroundColor
      || '#090a0f',
    backgroundBlur: tabTheme?.backgroundBlur ?? theme?.global?.backgroundBlur ?? 0,
  };
}
