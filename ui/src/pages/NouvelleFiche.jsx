import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
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
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

import NavigationTabs from '@/components/anamnese/NavigationTabs';
import IdentificationSection from '@/components/anamnese/sections/IdentificationSection';
import AnamneseSection from '@/components/anamnese/sections/AnamneseSection';
import BesoinsVisuelsSection from '@/components/anamnese/sections/BesoinsVisuelsSection';
import ActivitesSection from '@/components/anamnese/sections/ActivitesSection';
import EssaiCompensationSection from '@/components/anamnese/sections/EssaiCompensationSection';
import AncienneCorrectionSection from '@/components/anamnese/sections/AncienneCorrectionSection';
import ControleEquipementSection from '@/components/anamnese/sections/ControleEquipementSection';
import LivraisonSuiviSection from '@/components/anamnese/sections/LivraisonSuiviSection';

const tabs = [
  { id: 'identification', label: 'Identification', icon: User },
  { id: 'anamnese', label: 'Anamnèse', icon: ClipboardList },
  { id: 'besoins', label: 'Besoins', icon: Glasses },
  { id: 'activites', label: 'Activités', icon: Activity },
  { id: 'essai', label: 'Essai', icon: TestTube2 },
  { id: 'ancienne', label: 'Ancienne', icon: History },
  { id: 'controle', label: 'Contrôle', icon: Settings },
  { id: 'livraison', label: 'Livraison', icon: Truck }
];

export default function NouvelleFiche() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identification');
  const [showSuccess, setShowSuccess] = useState(false);
  const [penicheData, setpenicheData] = useState(null);

  const [formData, setFormData] = useState({
    date_visite: format(new Date(), 'yyyy-MM-dd'),
    statut: 'en_cours',
    suivi_post_livraison: []
  });

  useEffect(() => {
    if (!window.ZOHO) {
      console.error("ZOHO SDK non chargé");
      return;
    }

    const onPageLoad = (data) => {
      console.log("CURRENT PENICHE 1 :", data);
      setpenicheData(data);
    };

    window.ZOHO.embeddedApp.on("PageLoad", onPageLoad);
    window.ZOHO.embeddedApp.init();

    return () => {
      // Zoho ne fournit pas toujours off(), mais on protège quand même
      try {
        window.ZOHO.embeddedApp.off?.("PageLoad", onPageLoad);
      } catch (e) {
        // silencieux
      }
    };
  }, []);


  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FicheAnamnese.create(data),
    onSuccess: (result) => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('ListeFiches'));
      }, 1500);
    }
  });

  const createZohoAnamnese = async () => {
    const current_deal_id = penicheData?.EntityId;
    console.log("ID PENICHE : " , current_deal_id);

    let json_data = {
      "data": [
        {
          "Name": "Anamnese - " + formData.prenom + " " + formData.nom,
          "Email": formData.email,
        }
      ]
    };
    
    return ZOHO.CRM.CONNECTION.invoke("zcrm", {
      url: "https://www.zohoapis.eu/crm/v8/Anamneses",
      method: "POST",
      parameters: json_data
    })
      .then(function (response) {
        console.log("Anamnese created successfully:", response);
      })
      .catch((error) => {
        console.error("Error creating anamnese:", error);
      });
  };

  const handleSave = () => {
    console.log("peniche data au save :", penicheData);
    createZohoAnamnese();
  };

  const renderSection = () => {
    const props = { data: formData, onChange: setFormData };

    switch (activeTab) {
      case 'identification':
        return <IdentificationSection {...props} />;
      case 'anamnese':
        return <AnamneseSection {...props} />;
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
                <h1 className="text-xl font-bold text-gray-900">Nouvelle Fiche Anamnèse</h1>
                {formData.nom && formData.prenom && (
                  <p className="text-sm text-gray-500">{formData.prenom} {formData.nom}</p>
                )}
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || !formData.nom || !formData.email}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Enregistrer
            </Button>
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Fiche enregistrée !</h3>
              <p className="text-gray-500 mt-2">Redirection en cours...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}