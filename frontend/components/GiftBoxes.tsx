import { Gift } from 'lucide-react';

export default function GiftBoxes() {
  const gifts = [
    { id: 1, delay: 0, color: 'text-red-400' },
    { id: 2, delay: 200, color: 'text-green-400' },
    { id: 3, delay: 400, color: 'text-blue-400' },
    { id: 4, delay: 600, color: 'text-yellow-400' },
    { id: 5, delay: 800, color: 'text-purple-400' },
  ];

  return (
    <div className="flex gap-4 items-end">
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="animate-bounce"
          style={{ animationDelay: `${gift.delay}ms`, animationDuration: '2s' }}
        >
          <Gift className={`w-8 h-8 md:w-12 md:h-12 ${gift.color} drop-shadow-lg`} />
        </div>
      ))}
    </div>
  );
}
