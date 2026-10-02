const MESSAGES = [
  'FREE DELIVERY ON ORDERS ABOVE PKR 3,000',
  'FIRST DROP COMING SOON — JOIN THE LIST',
  'COD AVAILABLE ACROSS PAKISTAN',
]

export default function AnnouncementBar() {
  return (
    <div className="bg-accent text-fg text-center py-2 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap animate-ticker">
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span key={i} className="text-[10px] font-medium tracking-[0.22em] shrink-0">
            {msg} <span className="mx-4 opacity-40">·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .animate-ticker { animation: ticker 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .animate-ticker { animation: none; } }
      `}</style>
    </div>
  )
}
