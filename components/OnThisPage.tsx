export default function OnThisPage({ links }: { links: { id: string, label: string }[] }) {
  return (
    <div className="hidden xl:block w-64 fixed right-8 top-32">
      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">On This Page</h4>
      <ul className="space-y-3 border-l-2 border-gray-100">
        {links.map((link) => (
          <li key={link.id} className="-ml-[2px]">
            <a 
              href={`#${link.id}`} 
              className="block pl-4 text-sm text-gray-500 hover:text-brand-purple hover:border-l-2 hover:border-brand-purple transition-all py-1"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}