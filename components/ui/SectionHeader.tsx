interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  id?: string;
}

export default function SectionHeader({ label, title, description, id }: SectionHeaderProps) {
  return (
    <div className="mb-8" id={id}>
      {label && <p className="section-label mb-2">{label}</p>}
      <h2 className="text-2xl font-bold text-[#F0F0FF] mb-2">{title}</h2>
      {description && (
        <p className="text-[#A0A0C0] text-sm leading-relaxed max-w-2xl">{description}</p>
      )}
      <div className="mt-4 h-px bg-gradient-to-r from-purple-600/50 via-purple-600/20 to-transparent" />
    </div>
  );
}
