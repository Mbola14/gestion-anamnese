import React from 'react';
import { Truck, MessageSquare, AlertCircle, Plus, Trash2 } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchTextarea from '../TouchTextarea';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

export default function LivraisonSuiviSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addSuivi = () => {
    const newSuivi = {
      date: format(new Date(), 'yyyy-MM-dd'),
      remarques: '',
      opticien: ''
    };
    const currentSuivi = data.suivi_post_livraison || [];
    onChange({ ...data, suivi_post_livraison: [...currentSuivi, newSuivi] });
  };

  const updateSuivi = (index, field, value) => {
    const currentSuivi = [...(data.suivi_post_livraison || [])];
    currentSuivi[index] = { ...currentSuivi[index], [field]: value };
    onChange({ ...data, suivi_post_livraison: currentSuivi });
  };

  const removeSuivi = (index) => {
    const currentSuivi = [...(data.suivi_post_livraison || [])];
    currentSuivi.splice(index, 1);
    onChange({ ...data, suivi_post_livraison: currentSuivi });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Livraison & Suivi" icon={Truck} />
      
      {/* Livraison */}
      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Livraison</span>
        </div>
        <div className="space-y-4">
          <TouchInput
            label="Opticien livraison"
            value={data.livraison_opticien}
            onChange={(v) => handleChange('livraison_opticien', v)}
            placeholder="Nom de l'opticien"
          />
          <TouchTextarea
            label="Remarques à la livraison"
            value={data.livraison_remarques}
            onChange={(v) => handleChange('livraison_remarques', v)}
            placeholder="Observations lors de la livraison..."
            rows={3}
          />
        </div>
      </div>

      {/* Ressenti client */}
      <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Ressenti client</span>
        </div>
        <TouchTextarea
          value={data.ressenti_client}
          onChange={(v) => handleChange('ressenti_client', v)}
          placeholder="Retour du client sur l'équipement..."
          rows={4}
        />
      </div>

      {/* Points de vigilance */}
      <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-amber-800">Points de vigilance</span>
        </div>
        <TouchTextarea
          value={data.points_vigilance}
          onChange={(v) => handleChange('points_vigilance', v)}
          placeholder="Points importants à surveiller..."
          rows={3}
        />
      </div>

      {/* Suivi post-livraison */}
      <div className="p-5 bg-white rounded-xl border-2 border-blue-300 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-blue-800 text-lg">Suivi post-livraison</span>
          </div>
          <Button
            type="button"
            onClick={addSuivi}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un suivi
          </Button>
        </div>

        <div className="space-y-4">
          {(data.suivi_post_livraison || []).map((suivi, index) => (
            <div 
              key={index} 
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative"
            >
              <button
                type="button"
                onClick={() => removeSuivi(index)}
                className="absolute top-3 right-3 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                <TouchInput
                  label="Date"
                  value={suivi.date}
                  onChange={(v) => updateSuivi(index, 'date', v)}
                  type="date"
                />
                <TouchInput
                  label="Opticien"
                  value={suivi.opticien}
                  onChange={(v) => updateSuivi(index, 'opticien', v)}
                  placeholder="Nom opticien"
                />
              </div>
              <TouchTextarea
                label="Remarques"
                value={suivi.remarques}
                onChange={(v) => updateSuivi(index, 'remarques', v)}
                placeholder="Observations du suivi..."
                rows={2}
              />
            </div>
          ))}

          {(!data.suivi_post_livraison || data.suivi_post_livraison.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun suivi enregistré</p>
              <p className="text-sm">Cliquez sur "Ajouter un suivi" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}