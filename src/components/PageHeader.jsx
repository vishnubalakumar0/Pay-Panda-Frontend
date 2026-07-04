export default function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header"><div><p className="eyebrow accent">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}
