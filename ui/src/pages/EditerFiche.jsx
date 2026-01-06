import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  ArrowLeft, 
  User, 
  ClipboardList, 
  Glasses, 
  Activity, 
  TestTube2, 
  History, 
  Settings, 
  Truck,
  CheckCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import NavigationTabs from '@/components/anamnese/NavigationTabs';
import IdentificationSection from '@/components/anamnese/sections/IdentificationSection';
import InfosGenerales from '@/components/anamnese/sections/InfosGenerales';
import BesoinsVisuelsSection from '@/components/anamnese/sections/BesoinsVisuelsSection';
import ActivitesSection from '@/components/anamnese/sections/ActivitesSection';
import EssaiCompensationSection from '@/components/anamnese/sections/EssaiCompensationSection';
import AncienneCorrectionSection from '@/components/anamnese/sections/AncienneCorrectionSection';
import ControleEquipementSection from '@/components/anamnese/sections/ControleEquipementSection';
import LivraisonSuiviSection from '@/components/anamnese/sections/LivraisonSuiviSection';

const tabs = [
  { id: 'identification', label: 'Identification', icon: User },
  { id: 'anamnese', label: 'Informations générales', icon: ClipboardList },
  { id: 'besoins', label: 'Besoins', icon: Glasses },
  { id: 'activites', label: 'Activités', icon: Activity },
  { id: 'essai', label: 'Essai', icon: TestTube2 },
  { id: 'ancienne', label: 'Ancienne', icon: History },
  { id: 'controle', label: 'Contrôle', icon: Settings },
  { id: 'livraison', label: 'Livraison', icon: Truck }
];

export default function EditerFiche() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const ficheId = urlParams.get('id');
  
  const [activeTab, setActiveTab] = useState('identification');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: fiche, isLoading } = useQuery({
    queryKey: ['fiche', ficheId],
    queryFn: () => base44.entities.FicheAnamnese.filter({ id: ficheId }),
    enabled: !!ficheId
  });

  useEffect(() => {
    if (fiche && fiche.length > 0) {
      setFormData(fiche[0]);
    }
  }, [fiche]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.FicheAnamnese.update(ficheId, data),
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['fiches'] });
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.FicheAnamnese.delete(ficheId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiches'] });
      navigate(createPageUrl('ListeFiches'));
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const renderSection = () => {
    const props = { data: formData, onChange: setFormData };
    
    switch (activeTab) {
      case 'identification':
        return <IdentificationSection {...props} />;
      case 'anamnese':
        return <InfosGenerales {...props} />;
      case 'besoins':
        return <BesoinsVisuelsSection {...props} />;
      case 'activites':
        return <ActivitesSection {...props} />;
      case 'essai':
        return <EssaiCompensationSection {...props} />;
      case 'ancienne':
        return <AncienneCorrectionSection {...props} />;
      case 'controle':
        return <ControleEquipementSection {...props} />;
      case 'livraison':
        return <LivraisonSuiviSection {...props} />;
      default:
        return null;
    }
  };

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(createPageUrl('ListeFiches'))}
                className="p-2 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {formData.prenom} {formData.nom}
                </h1>
                <p className="text-sm text-gray-500">Édition de la fiche</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette fiche ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. La fiche de {formData.prenom} {formData.nom} sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate()}
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Statut :</span>
            <div className="flex gap-2">
              {[
                { value: 'en_cours', label: 'En cours', color: 'yellow' },
                { value: 'livree', label: 'Livrée', color: 'green' },
                { value: 'suivi', label: 'Suivi', color: 'blue' }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setFormData({ ...formData, statut: status.value })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    formData.statut === status.value
                      ? `bg-${status.color}-100 text-${status.color}-700 ring-2 ring-${status.color}-500`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <NavigationTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          {renderSection()}
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPrevTab}
            disabled={activeTab === tabs[0].id}
            className="rounded-xl px-6 py-3"
          >
            ← Précédent
          </Button>
          <Button
            onClick={goToNextTab}
            disabled={activeTab === tabs[tabs.length - 1].id}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-3"
          >
            Suivant →
          </Button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            Modifications enregistrées
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}