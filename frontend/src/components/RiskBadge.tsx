export function RiskBadge({ risk, size = 'md' }: { risk: string; size?: 'sm' | 'md' | 'lg' }) {
  const color = risk === 'High' ? 'bg-red-100 text-red-700 border-red-200'
    : risk === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-green-100 text-green-700 border-green-200';
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5 font-bold' : 'text-sm px-3 py-1';
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${color} ${sz}`}>
      <span className={`mr-1.5 inline-block rounded-full ${risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-amber-500' : 'bg-green-500'} ${size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
      {risk}
    </span>
  );
}
