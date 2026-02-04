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

  const getTriStateValue = (up, equal, down) => {
    if (up) return "Montée";
    if (equal) return "Stable";
    if (down) return "Chute";
    return null;
  };

  // ✅ Remplace UNIQUEMENT handleSave + createZohoAnamnese par ces versions.
  // (Ton create_contact peut rester tel quel.)

  const createZohoAnamnese = async (contactId) => {
    const fullName = [formData.prenom, formData.nom].filter(Boolean).join(" ");
    console.log("PRINT SPHERE : ----------> ", formData.nouvelle_og_sphere);
    

    const json_data = {
      data: [
        {
          // === IDENTIFICATION ===
          Contact: contactId ? { id: contactId } : null, // ✅ IMPORTANT
          Name: fullName ? `Anamnese - ${fullName}` : "Anamnese",
          Nouveau_client: formData.nouveau_client,
          Date_de_visite: formData.date_visite,
          Opticien_visite: formData.opticien_visite ? { id: formData.opticien_visite } : null,

          // === INFORMATIONS GÉNÉRALES ===
          Type_d_quipement: formData.type_equipement,
          carts_pupillaires_OD_OG: formData.ecarts_pupillaires,
          Motif_de_la_visite_boutique: formData.motif_visite_boutique,
          Motif_Qualissime: formData.autre_raison_qualissime,
          Motif_Perte_de_lunettes: formData.autre_raison_perte_lunettes,
          Sant_oculaire_PIO_FO: formData.sante_oculaire,
          Orthoptie_exercices_r_alis_s: formData.orthoptie,
          Port_de_lentilles: formData.port_lentilles,
          Ressenti_des_yeux: formData.sentez_vos_yeux,

          // === ACTIVITÉS ===
          Zone_dominante: formData.zone_dominante,
          Conduite_automobile: formData.vl_conduite_auto,
          Conduite_de_nuit: formData.vl_conduite_nuit,
          Marche_ext_rieur: formData.vl_marche_exterieur,
          V_lo_deux_roues: formData.vl_velo_deuxroues,
          Sport_ext_rieur: formData.vl_sport_exterieur,
          Voyage_fr_quent: formData.vl_voyage,
          Observation_distance: formData.vl_observation_distance,
          Lecture_de_panneaux: formData.vl_lecture_panneaux,
          Autres_activit_s_VL: formData.autres_activites_vl,

          Ordinateur_fixe: formData.vi_ordinateur_fixe,
          Ordinateur_portable: formData.vi_ordinateur_portable,
          Double_cran: formData.vi_double_ecran,
          cran_prolong: formData.vi_ecran_prolonge,
          T_l_vision: formData.vi_television,
          Cuisine: formData.vi_cuisine,
          Bricolage: formData.vi_bricolage,
          Activit_manuelle: formData.vi_atelier,
          Enseignement_pr_sentation: formData.vi_enseignement,
          Commerce_accueil_client: formData.vi_commerce,
          Autres_activit_s_VI: formData.autres_activites_vi,

          Lecture_intensive: formData.vp_lecture_intensive,
          Lecture_occasionnelle: formData.vp_lecture_occasionnelle,
          T_l_phone_smartphone: formData.vp_smartphone,
          Tablette: formData.vp_tablette,
          criture: formData.vp_ecriture,
          tude_r_vision: formData.vp_etude,
          Couture_tricot: formData.vp_couture_tricot,
          Dessin_peinture: formData.vp_dessin_peinture,
          Activit_s_de_pr_cision: formData.vp_precision,
          Autres_activit_s_VP: formData.autres_activites_vp,

          // === ESSAI DE COMPENSATION ===
          Type_de_verres_port_s: formData.type_verres_ancien,
          Ancienne_correction_OD_OG: formData.correction_ancienne,
          Date_derni_re_facture: formData.date_ancien_equipement,
          Nouvelle_correction_OD_OG: formData.correction_nouvelle,


          Sph_re_OG: formData.nouvelle_og_sphere,
          Cylindre_OG: formData.nouvelle_og_cylindre,
          Axe_OG: formData.nouvelle_og_axe,
          Addition_OG: formData.nouvelle_og_addition,
          Prisme_1_OG: formData.nouvelle_og_prisme1,
          Base_1_OG: formData.nouvelle_og_base1,
          Prisme_2_OG: formData.nouvelle_og_prisme2,
          Base_2_OG: formData.nouvelle_og_base2,
          Sph_re_OD: formData.nouvelle_od_sphere,
          Cylindre_OD: formData.nouvelle_od_cylindre,
          Axe_OD: formData.nouvelle_od_axe,
          Addition_OD: formData.nouvelle_od_addition,
          Prisme_1_OD: formData.nouvelle_od_prisme1,
          Base_1_OD: formData.nouvelle_od_base1,
          Prisme_2_OD: formData.nouvelle_od_prisme2,
          Base_2_OD: formData.nouvelle_od_base2,


          AV_VL_OD: formData.av_vl_od,
          AV_VL_OG: formData.av_vl_og,
          AV_VL_ODG: formData.av_vl_odg,
          AV_VP_OD: formData.av_vp_od,
          AV_VP_OG: formData.av_vp_og,
          AV_VP_ODG: formData.av_vp_odg,
          Test_0_25: getTriStateValue(formData.test_025_up, formData.test_025_equal, formData.test_025_down),
          Test_0_50: getTriStateValue(formData.test_05_up, formData.test_05_equal, formData.test_05_down),
          P_niche: formData.peniche_id ? { id: formData.peniche_id } : null,

          // === CONTRÔLE ===
          Opticien_contr_le: formData.controle_opticien ? { id: formData.controle_opticien } : null,
          Premier_quipement_vis: formData.controle_1er_vis,
          Premier_quipement_polissage: formData.controle_1er_polissage,
          Premier_quipement_transition: formData.controle_1er_transition,
          Opticien_premier_quipement: formData.controle_1er_opticien ? { id: formData.controle_1er_opticien } : null,
          Deuxi_me_quipement_vis: formData.controle_2eme_vis,
          Deuxi_me_quipement_polissage: formData.controle_2eme_polissage,
          Deuxi_me_quipement_transition: formData.controle_2eme_transition,
          Opticien_deuxi_me_quipement: formData.controle_2eme_opticien ? { id: formData.controle_2eme_opticien } : null,
          S_curit_monture_m_tal: formData.securite_monture_metal,

          // === LIVRAISON ===
          Opticien_livraison: formData.livraison_opticien ? { id: formData.livraison_opticien } : null,
          Acuit_ODG_livraison: formData.acuite_odg,
          Ressenti_client: formData.ressenti_client,
          Points_de_vigilance: formData.points_vigilance,
          Satisfaction: formData.satisfaction_client,
        },
      ],
    };

    console.log("ID CONTACT A ASSOCIER (UTILISÉ) :", contactId);

    return ZOHO.CRM.CONNECTION.invoke("zcrm", {
      url: "https://www.zohoapis.eu/crm/v8/Anamneses",
      method: "POST",
      parameters: json_data,
    })
      .then((response) => {
        console.log("Anamnese created successfully:", response);
        return response;
      })
      .catch((error) => {
        console.error("Error creating anamnese:", error);
        throw error;
      });
  };

const handleSave = async () => {
  try {
    console.log("peniche data au save :", penicheData);

    // 1️⃣ créer ou récupérer le contact
    const contactId = await create_contact();
    if (!contactId) {
      console.error("Impossible de créer/trouver le contact.");
      return;
    }

    // 2️⃣ créer l’anamnèse AVEC l’id du contact
    await createZohoAnamnese(contactId);

    // 3️⃣ fermer le popup + recharger la fiche parente
    await ZOHO.CRM.UI.Popup.closeReload();

  } catch (e) {
    console.error("Erreur handleSave :", e);
  }
};



  const create_contact = async () => {
    // Si déjà sélectionné via ContactSearch -> rien à faire
    if (formData.contact_id) return formData.contact_id;

    // Si pas de données minimales -> on ne crée pas
    const nom = (formData.nom || "").trim();
    const prenom = (formData.prenom || "").trim();
    const email = (formData.email || "").trim();

    if (!nom || !email) return null;

    // 1) Chercher un contact existant par email (le plus fiable)
    try {
      const search = await ZOHO.CRM.API.searchRecord({
        Entity: "Contacts",
        Type: "criteria",
        Query: `(Email:equals:${email})`,
        page: 1,
        per_page: 1,
      });

      const existing = search?.data?.[0];
      if (existing?.id) {
        console.log("Contact existant donc création annulé.");

        setFormData((prev) => ({ ...prev, contact_id: existing.id }));
        return existing.id;
      }
    } catch (e) {
      // on ignore et on tente la création
    }

    // 2) Créer le contact
    const payload = {
      data: [
        {
          Last_Name: nom,
          First_Name: prenom || undefined,
          Email: email,
          Date_of_Birth: formData.date_naissance || undefined,
        },
      ],
    };

    try {
      const resp = await ZOHO.CRM.API.insertRecord({
        Entity: "Contacts",
        APIData: payload.data[0],
        Trigger: ["workflow"],
      });
      console.log("CREATE CONTACT : ", resp);


      const newId = resp?.data?.[0]?.details?.id;

      if (newId) {
        setFormData((prev) => ({ ...prev, contact_id: newId }));
        return newId;
      }
    } catch (e) {
      console.error("Erreur création contact :", e);
    }

    return null;
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
        return <ControleEquipementSection {...props} opticians={opticians} />;
      case 'livraison':
        return <LivraisonSuiviSection {...props} opticians={opticians} />;
      default:
        return null;
    }
  };

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const goToNextTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab);
  if (currentIndex < tabs.length - 1) {
    setActiveTab(tabs[currentIndex + 1].id);
    scrollToTop();
  }
};

const goToPrevTab = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab);
  if (currentIndex > 0) {
    setActiveTab(tabs[currentIndex - 1].id);
    scrollToTop();
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
              disabled={createMutation.isPending || !formData.nom}
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