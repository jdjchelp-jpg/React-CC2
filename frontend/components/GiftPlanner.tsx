import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Plus, Trash2, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useBackend } from '../lib/backend';
import { useToast } from '@/components/ui/use-toast';

interface GiftItem {
  id: number;
  recipient: string;
  giftIdea: string;
  budget: number | null;
  purchased: boolean;
}

export default function GiftPlanner() {
  const backend = useBackend();
  const { toast } = useToast();
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [newGiftName, setNewGiftName] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const res = await backend.gifts.list();
      setGifts(res.gifts);
    } catch (err) {
      console.error('Failed to load gifts:', err);
      toast({
        title: 'Error',
        description: 'Failed to load gifts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  const addGift = async () => {
    if (!newGiftName.trim() || !newRecipient.trim()) return;
    
    try {
      const budget = newBudget ? parseFloat(newBudget) : undefined;
      const res = await backend.gifts.create({
        recipient: newRecipient.trim(),
        giftIdea: newGiftName.trim(),
        budget,
      });
      
      setGifts([...gifts, {
        id: res.id,
        recipient: newRecipient.trim(),
        giftIdea: newGiftName.trim(),
        budget: budget ?? null,
        purchased: false,
      }]);
      
      setNewGiftName('');
      setNewRecipient('');
      setNewBudget('');
      
      toast({
        title: 'Gift added!',
        description: 'Your gift has been saved',
      });
    } catch (err) {
      console.error('Failed to add gift:', err);
      toast({
        title: 'Error',
        description: 'Failed to add gift',
        variant: 'destructive',
      });
    }
  };

  const togglePurchased = async (id: number) => {
    const gift = gifts.find(g => g.id === id);
    if (!gift) return;
    
    try {
      await backend.gifts.update({ id, purchased: !gift.purchased });
      setGifts(gifts.map(gift => 
        gift.id === id ? { ...gift, purchased: !gift.purchased } : gift
      ));
    } catch (err) {
      console.error('Failed to update gift:', err);
      toast({
        title: 'Error',
        description: 'Failed to update gift',
        variant: 'destructive',
      });
    }
  };

  const deleteGift = async (id: number) => {
    try {
      await backend.gifts.remove({ id });
      setGifts(gifts.filter(gift => gift.id !== id));
      toast({
        title: 'Gift removed',
        description: 'Your gift has been deleted',
      });
    } catch (err) {
      console.error('Failed to delete gift:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete gift',
        variant: 'destructive',
      });
    }
  };

  const purchasedCount = gifts.filter(g => g.purchased).length;
  const totalCount = gifts.length;
  const progress = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 w-full max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Gift className="w-6 h-6" />
            Gift Planner
          </h3>
          <p className="text-white/80 text-sm mt-2">
            Keep track of your Christmas gift shopping
          </p>
          {totalCount > 0 && (
            <div className="mt-3 bg-white/10 rounded-lg p-3">
              <div className="text-white/80 text-sm">
                {purchasedCount} of {totalCount} gifts purchased ({progress}%)
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGift()}
            placeholder="Recipient..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="text"
            value={newGiftName}
            onChange={(e) => setNewGiftName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGift()}
            placeholder="Gift idea..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGift()}
            placeholder="Budget (optional)..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <Button
            onClick={addGift}
            disabled={!newGiftName.trim() || !newRecipient.trim() || loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Gift
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gifts.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              No gifts added yet. Start planning your Christmas shopping!
            </div>
          ) : (
            gifts.map((gift) => (
              <div
                key={gift.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  gift.purchased
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <button
                  onClick={() => togglePurchased(gift.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    gift.purchased
                      ? 'bg-green-500 border-green-500'
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  {gift.purchased && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <div className={`text-white font-medium ${gift.purchased ? 'line-through opacity-60' : ''}`}>
                    {gift.giftIdea}
                  </div>
                  <div className="text-white/60 text-sm">
                    for {gift.recipient}
                    {gift.budget && ` • $${gift.budget.toFixed(2)}`}
                  </div>
                </div>
                <button
                  onClick={() => deleteGift(gift.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
