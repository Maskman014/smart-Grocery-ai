import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, ShoppingCart, Edit2, Sparkles, CheckCircle } from 'lucide-react';

export const ListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(`/api/grocery/list/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setList(data);
        } else {
          navigate('/history');
        }
      } catch (err) {
        console.error('Failed to fetch list details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!list) return null;

  const handleReorder = () => {
    navigate('/payment', { 
      state: { 
        id: list.status === 'ordered' ? undefined : list.id,
        items: list.parsed_items,
        total: list.total_cost,
        store: list.recommended_store,
        raw_text: list.raw_text,
        explanation: list.explanation
      } 
    });
  };

  const handleEdit = () => {
    // Navigate to edit list with the current list data
    navigate('/edit-list', { 
      state: { 
        rawText: list.raw_text,
        initialItems: list.parsed_items,
        listId: list.id
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Order #{list.id}</h2>
            <p className="text-gray-400 text-sm mt-1">{new Date(list.created_at).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Total Cost</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono">₹{list.total_cost.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-emerald-500" />
                Items ({list.parsed_items.length})
              </h3>
              <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3 text-right">Est. Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {list.parsed_items.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-gray-200 capitalize">{item.name}</td>
                        <td className="px-4 py-3 text-gray-400">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-3 text-right text-white font-mono">₹{item.estimated_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Recommendation
              </h3>
              <p className="text-white font-medium mb-2">Store: {list.recommended_store}</p>
              <p className="text-sm text-gray-300 leading-relaxed">{list.explanation}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleReorder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {list.status === 'ordered' ? 'Reorder' : 'Checkout'}
              </button>
              
              <button 
                onClick={handleEdit}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit List
              </button>

              <button 
                onClick={() => navigate('/dashboard', { state: { rawText: list.raw_text } })}
                className="w-full bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-500/30 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                New AI Suggestion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
