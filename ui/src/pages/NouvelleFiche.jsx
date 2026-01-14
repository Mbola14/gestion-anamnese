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
import InfosGenerales from '@/components/anamnese/sections/InfosGenerales';
import ActivitesSection from '@/components/anamnese/sections/ActivitesSection';
import EssaiCompensationSection from '@/components/anamnese/sections/EssaiCompensationSection';
import ControleEquipementSection from '@/components/anamnese/sections/ControleEquipementSection';
import LivraisonSuiviSection from '@/components/anamnese/sections/LivraisonSuiviSection';

const tabs = [
  { id: 'identification', label: 'Identification', icon: User },
  { id: 'anamnese', label: 'Informations générales', icon: ClipboardList },
  { id: 'activites', label: 'Activités', icon: Activity },
  { id: 'essai', label: 'Essai', icon: TestTube2 },
  { id: 'controle', label: 'Contrôle', icon: Settings },
  { id: 'livraison', label: 'Livraison', icon: Truck }
];

export default function NouvelleFiche() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identification');
  const [showSuccess, setShowSuccess] = useState(false);
  const [penicheData, setpenicheData] = useState(null);
  const [opticians, setOpticians] = useState([]);

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

    const onPageLoad = async (data) => {
      console.log("CURRENT PENICHE :", data);
      setpenicheData(data);

      try {
        const res = await ZOHO.CRM.API.getAllRecords({
          Entity: "Opticiens",
          sort_order: "asc",
          per_page: 200,
          page: 1
        });

        if (res?.data) {
          const list = res.data
            .map(o => ({
              id: o.id,
              prenom: o.Pr_nom
            }))
            .filter(Boolean);

          setOpticians(list);
          console.log("LES DATA RES :", res.data);
        }
      } catch (e) {
        console.error("Erreur fetch opticiens :", e);
      }
    };

    ZOHO.embeddedApp.on("PageLoad", onPageLoad);
    ZOHO.embeddedApp.init();

    return () => {
      try {
        ZOHO.embeddedApp.off?.("PageLoad", onPageLoad);
      } catch { }
    };
  }, []);

  console.log("OPTICIENS FETCHÉS :", opticians);

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
    console.log("ID PENICHE : ", current_deal_id);

    const fullName = [formData.prenom, formData.nom].filter(Boolean).join(' ');
    let json_data = {
      data: [
        {
          // === IDENTIFICATION ===
          Name: fullName ? `Anamnese - ${fullName}` : "Anamnese",
          Email: formData.email,
          Nom: formData.nom,
          Pr_nom: formData.prenom,
          Date_de_naissance: formData.date_naissance,
          Nouveau_client: formData.nouveau_client,
          Date_de_visite: formData.date_visite,
          Opticien_visite: formData.opticien_visite
            ? { id: formData.opticien_visite }
            : null,

          // === INFORMATIONS GÉNÉRALES ===
          Premi_re_lunette: formData.type_equipement_premiere_lunette,
          Premier_progressif: formData.type_equipement_premier_progressif,
          Renouvellement: formData.type_equipement_renouvellement,
          carts_pupillaires_OD_OG: formData.ecarts_pupillaires,
          Motif_de_la_visite_boutique: formData.motif_visite_boutique,
          Motif_Qualissime: formData.motif_qualissime,
          Motif_Perte_de_lunettes: formData.motif_perte_lunettes,
          Sant_oculaire_PIO_FO: formData.sante_oculaire,
          Orthoptie_exercices_r_alis_s: formData.orthoptie,
          Port_de_lentilles: formData.port_lentilles,
          Ressenti_des_yeux: formData.ressenti_yeux,

          // === ACTIVITÉS ===
          Ordinateur_fixe: formData.ordinateur_fixe,
          Ordinateur_portable: formData.ordinateur_portable,
          Double_cran: formData.double_ecran,
          cran_prolong: formData.ecran_prolonge,
          T_l_phone_smartphone: formData.smartphone,
          T_l_vision: formData.television,
          Lecture_intensive: formData.lecture_intensive,
          Lecture_occasionnelle: formData.lecture_occasionnelle,
          criture: formData.ecriture,
          Activit_s_de_pr_cision: formData.activites_precision,
          Couture_tricot: formData.couture_tricot,
          Cuisine: formData.cuisine,
          Bricolage: formData.bricolage,
          Activit_manuelle: formData.activite_manuelle,
          Sport_ext_rieur: formData.sport_exterieur,
          Marche_ext_rieur: formData.marche_exterieur,
          V_lo_deux_roues: formData.velo,
          Voyage_fr_quent: formData.voyage_frequent,
          Conduite_automobile: formData.conduite_auto,
          Conduite_de_nuit: formData.conduite_nuit,
          Observation_distance: formData.observation_distance,
          Lecture_de_panneaux: formData.lecture_panneaux,
          Dessin_peinture: formData.dessin_peinture,
          Enseignement_pr_sentation: formData.enseignement,
          Autres_activit_s_VL: formData.autres_activites_vl,
          Autres_activit_s_VI: formData.autres_activites_vi,
          Autres_activit_s_VP: formData.autres_activites_vp,

          // === ESSAI DE COMPENSATION ===
          Type_de_verres_port_s: formData.type_verres,
          Ancienne_correction_OD_OG: formData.ancienne_correction,
          Nouvelle_correction_OD_OG: formData.nouvelle_correction,
          AV_VL_OD: formData.av_vl_od,
          AV_VL_OG: formData.av_vl_og,
          AV_VL_ODG: formData.av_vl_odg,
          AV_VP_OD: formData.av_vp_od,
          AV_VP_OG: formData.av_vp_og,
          AV_VP_ODG: formData.av_vp_odg,
          Test_0_25: formData.test_025,
          Test_0_50: formData.test_050,

          // === CONTRÔLE ===
          Opticien_contr_le: formData.opticien_controle
            ? { id: formData.opticien_controle }
            : null,
          Premier_quipement_vis: formData.controle_1er_vis,
          Premier_quipement_polissage: formData.controle_1er_polissage,
          Premier_quipement_transition: formData.controle_1er_transition,
          Opticien_premier_quipement: formData.opticien_1er
            ? { id: formData.opticien_1er }
            : null,
          Deuxi_me_quipement_vis: formData.controle_2eme_vis,
          Deuxi_me_quipement_polissage: formData.controle_2eme_polissage,
          Deuxi_me_quipement_transition: formData.controle_2eme_transition,
          Opticien_deuxi_me_quipement: formData.opticien_2eme
            ? { id: formData.opticien_2eme }
            : null,
          S_curit_monture_m_tal: formData.securite_monture_metal,

          // === LIVRAISON ===
          Opticien_livraison: formData.opticien_livraison
            ? { id: formData.opticien_livraison }
            : null,
          Acuit_ODG_livraison: formData.acuite_odg,
          Ressenti_client: formData.ressenti_client,
          Points_de_vigilance: formData.points_vigilance,
          Satisfaction: formData.satisfaction_client
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
        return <IdentificationSection {...props} opticians={opticians} />;
      case 'anamnese':
        return <InfosGenerales {...props} />;
      case 'activites':
        return <ActivitesSection {...props} />;
      case 'essai':
        return <EssaiCompensationSection {...props} />;
      case 'controle':
        return <ControleEquipementSection {...props} />;
      case 'livraison':
        return <LivraisonSuiviSection {...props} opticians={opticians} />;
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