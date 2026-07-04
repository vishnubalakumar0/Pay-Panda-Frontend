import { createPortal } from 'react-dom';

/** Portals the collapsed-sidebar hover label to document.body instead of relying on a CSS
 * `:hover:after` pseudo-element inside `.nav-scroll`. That pseudo-element visually overflows
 * the 82px collapsed sidebar on purpose, but `.nav-scroll` has `overflow:auto` for vertical
 * scrolling, and any element that visually overflows a scroll container's box — even an
 * absolutely positioned one — is included in that container's scrollable area, which produced
 * an unwanted horizontal scrollbar. Rendering the label outside the scroll container entirely
 * avoids that without giving up the overflow-y scroll. */
export default function SidebarTooltip({ tooltip }) {
  if (!tooltip) return null;
  return createPortal(
    <div className="sidebar-tooltip" style={{ top: tooltip.top, left: tooltip.left }}>{tooltip.label}</div>,
    document.body,
  );
}
