import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ArrowLeft,
  User,
  ClipboardList,
  Activity,
  TestTube2,
  Settings,
  Truck,
  CheckCircle,
  Loader2,
  Trash2,
} from "lucide-react";
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

import NavigationTabs from "@/components/anamnese/NavigationTabs";

// Sections (édition)
import EditIdentificationSection from "@/components/anamnese/sections/EditIdentificationSection";
import InfosGenerales from "@/components/anamnese/sections/InfosGenerales";
import ActivitesSection from "@/components/anamnese/sections/ActivitesSection";
import EssaiCompensationSection from "@/components/anamnese/sections/EssaiCompensationSection";
import ControleEquipementSection from "@/components/anamnese/sections/ControleEquipementSection";
import LivraisonSuiviSection from "@/components/anamnese/sections/LivraisonSuiviSection";

const tabs = [
  { id: "identification", label: "Identification", icon: User },
  { id: "anamnese", label: "Informations générales", icon: ClipboardList },
  { id: "activites", label: "Activités", icon: Activity },
  { id: "essai", label: "Essai", icon: TestTube2 },
  { id: "controle", label: "Contrôle", icon: Settings },
  { id: "livraison", label: "Livraison", icon: Truck },
];

function getTriStateValue(up, equal, down) {
  if (up) return "Montée";
  if (equal) return "Stable";
  if (down) return "Chute";
  return null;
}

function zoneToMultiSelectArray(zoneObj) {
  // ex: {"VI":true,"VL":true,"VP":false} => ["VI","VL"]
  if (!zoneObj || typeof zoneObj !== "object") return [];
  return Object.entries(zoneObj)
    .filter(([, v]) => !!v)
    .map(([k]) => k);
}

// ⚠️ IMPORTANT: ici on mappe formData -> payload Zoho (comme NouvelleFiche.jsx)
function buildZohoUpdatePayload(formData) {
  const fullName = [formData.prenom, formData.nom].filter(Boolean).join(" ");

  return {
    data: [
      {
        // === IDENTIFICATION ===
        Contact: formData.contact_id ? { id: formData.contact_id } : null,
        Name: fullName ? `Anamnese - ${fullName}` : "Anamnese",
        Email: formData.email || null,
        Nom: formData.nom || null,
        Pr_nom: formData.prenom || null,
        Date_de_naissance: formData.date_naissance || null,
        Nouveau_client:
          typeof formData.nouveau_client === "boolean"
            ? formData.nouveau_client
            : null,
        Date_de_visite: formData.date_visite || null,
        Opticien_visite: formData.opticien_visite
          ? { id: formData.opticien_visite }
          : null,

        // === INFORMATIONS GÉNÉRALES ===
        Type_d_quipement: formData.type_equipement || null,
        carts_pupillaires_OD_OG: formData.ecarts_pupillaires || null,
        Motif_de_la_visite_boutique: formData.motif_visite_boutique || null,
        Motif_Qualissime: !!formData.autre_raison_qualissime,
        Motif_Perte_de_lunettes: !!formData.autre_raison_perte_lunettes,
        Sant_oculaire_PIO_FO: formData.sante_oculaire || null,
        Orthoptie_exercices_r_alis_s: formData.orthoptie || null,
        Port_de_lentilles: formData.port_lentilles || null,
        Ressenti_des_yeux: formData.sentez_vos_yeux || null,

        // ⚠️ exemple multi-select (si tu l’utilises)
        Zone_unifocal_type_de_verres_port_s: zoneToMultiSelectArray(
          formData.unifocal_zone
        ),

        // === ACTIVITÉS ===
        // ----- VL
        Conduite_automobile: !!formData.vl_conduite_auto,
        Conduite_de_nuit: !!formData.vl_conduite_nuit,
        Marche_ext_rieur: !!formData.vl_marche_exterieur,
        V_lo_deux_roues: !!formData.vl_velo_deuxroues,
        Sport_ext_rieur: !!formData.vl_sport_exterieur,
        Voyage_fr_quent: !!formData.vl_voyage,
        Observation_distance: !!formData.vl_observation_distance,
        Lecture_de_panneaux: !!formData.vl_lecture_panneaux,
        Autres_activit_s_VL: formData.autres_activites_vl || null,

        // ----- VI
        Ordinateur_fixe: !!formData.vi_ordinateur_fixe,
        Ordinateur_portable: !!formData.vi_ordinateur_portable,
        Double_cran: !!formData.vi_double_ecran,
        cran_prolong: !!formData.vi_ecran_prolonge,
        T_l_vision: !!formData.vi_television,
        Cuisine: !!formData.vi_cuisine,
        Bricolage: !!formData.vi_bricolage,
        Activit_manuelle: !!formData.vi_atelier,
        Enseignement_pr_sentation: !!formData.vi_enseignement,
        Commerce_accueil_client: !!formData.vi_commerce,
        Autres_activit_s_VI: formData.autres_activites_vi || null,

        // ----- VP
        Lecture_intensive: !!formData.vp_lecture_intensive,
        Lecture_occasionnelle: !!formData.vp_lecture_occasionnelle,
        T_l_phone_smartphone: !!formData.vp_smartphone,
        Tablette: !!formData.vp_tablette,
        criture: !!formData.vp_ecriture,
        tude_r_vision: !!formData.vp_etude,
        Couture_tricot: !!formData.vp_couture_tricot,
        Dessin_peinture: !!formData.vp_dessin_peinture,
        Activit_s_de_pr_cision: !!formData.vp_precision,
        Autres_activit_s_VP: formData.autres_activites_vp || null,

        // === ESSAI ===
        Type_de_verres_port_s: formData.type_verres_ancien || null,
        Ancienne_correction_OD_OG: formData.correction_ancienne || null,
        Date_derni_re_facture: formData.date_ancien_equipement || null,
        Nouvelle_correction_OD_OG: formData.correction_nouvelle || null,

        AV_VL_OD: formData.av_vl_od ?? null,
        AV_VL_OG: formData.av_vl_og ?? null,
        AV_VL_ODG: formData.av_vl_odg ?? null,
        AV_VP_OD: formData.av_vp_od ?? null,
        AV_VP_OG: formData.av_vp_og ?? null,
        AV_VP_ODG: formData.av_vp_odg ?? null,

        Test_0_25: getTriStateValue(
          formData.test_025_up,
          formData.test_025_equal,
          formData.test_025_down
        ),
        Test_0_50: getTriStateValue(
          formData.test_05_up,
          formData.test_05_equal,
          formData.test_05_down
        ),

        P_niche: formData.peniche_id ? { id: formData.peniche_id } : null,

        // === CONTRÔLE ===
        Opticien_contr_le: formData.controle_opticien
          ? { id: formData.controle_opticien }
          : null,

        Premier_quipement_vis: !!formData.controle_1er_vis,
        Premier_quipement_polissage: !!formData.controle_1er_polissage,
        Premier_quipement_transition: !!formData.controle_1er_transition,
        Opticien_premier_quipement: formData.controle_1er_opticien
          ? { id: formData.controle_1er_opticien }
          : null,

        Deuxi_me_quipement_vis: !!formData.controle_2eme_vis,
        Deuxi_me_quipement_polissage: !!formData.controle_2eme_polissage,
        Deuxi_me_quipement_transition: !!formData.controle_2eme_transition,
        Opticien_deuxi_me_quipement: formData.controle_2eme_opticien
          ? { id: formData.controle_2eme_opticien }
          : null,

        S_curit_monture_m_tal: !!formData.securite_monture_metal,

        // === LIVRAISON ===
        Opticien_livraison: formData.livraison_opticien
          ? { id: formData.livraison_opticien }
          : null,
        Acuit_ODG_livraison: formData.acuite_odg ?? null,
        Ressenti_client: formData.ressenti_client || null,
        Points_de_vigilance: formData.points_vigilance || null,
        Satisfaction: formData.satisfaction_client || null,
      },
    ],
  };
}

export default function EditerFiche() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("identification");
  const [showSuccess, setShowSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [recordId, setRecordId] = useState(null);

  const [formData, setFormData] = useState({});
  const [opticians, setOpticians] = useState([]);

  // ✅ 1) Récupère l'ID de l'anamnèse via Zoho PageLoad (pas via l'URL)
  useEffect(() => {
    if (!window.ZOHO) {
      setError("ZOHO SDK non chargé");
      setIsLoading(false);
      return;
    }

    const onPageLoad = async (data) => {
      const id = data?.EntityId || null;
      setRecordId(id);

      // 🔽 fetch opticiens (si tu veux les dropdowns)
      try {
        const res = await window.ZOHO.CRM.API.getAllRecords({
          Entity: "Opticiens",
          sort_order: "asc",
          per_page: 200,
          page: 1,
        });

        if (res?.data) {
          setOpticians(
            res.data
              .map((o) => ({ id: o.id, prenom: o.Pr_nom }))
              .filter((x) => x?.id)
          );
        }
      } catch (e) {
        console.error("Erreur fetch opticiens :", e);
      }
    };

    window.ZOHO.embeddedApp.on("PageLoad", onPageLoad);
    window.ZOHO.embeddedApp.init();

    return () => {
      try {
        window.ZOHO.embeddedApp.off?.("PageLoad", onPageLoad);
      } catch {}
    };
  }, []);

  // ✅ 2) Fetch la fiche via API Zoho (getRecord)
  useEffect(() => {
    const fetchRecord = async () => {
      if (!window.ZOHO) return;

      if (!recordId) {
        setIsLoading(true);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const resp = await window.ZOHO.CRM.API.getRecord({
          Entity: "Anamneses",
          RecordID: recordId,
        });

        const rec = resp?.data?.[0] || null;
        if (!rec) {
          setFormData({});
          setError("Aucune donnée.");
          return;
        }

        // ✅ hydrate formData depuis le record Zoho
        // NOTE: on garde les clés CRM ET on ajoute les clés "form" dont tes composants ont besoin.
        // Pour les lookups (Contact/Opticiens/Péniche): on met l'id sur les champs *_id utilisés au save.
        setFormData((prev) => ({
          ...prev,

          // --- champs "form" utilisés par tes sections ---
          email: rec.Email || "",
          nom: rec.Nom || "",
          prenom: rec.Pr_nom || "",
          date_naissance: rec.Date_de_naissance || "",
          nouveau_client: typeof rec.Nouveau_client === "boolean" ? rec.Nouveau_client : false,
          date_visite: rec.Date_de_visite || "",

          contact_id: rec?.Contact?.id || null,
          opticien_visite: rec?.Opticien_visite?.id || "",

          type_equipement: rec.Type_d_quipement || "",
          ecarts_pupillaires: rec.carts_pupillaires_OD_OG || "",
          motif_visite_boutique: rec.Motif_de_la_visite_boutique || "",
          autre_raison_qualissime: !!rec.Motif_Qualissime,
          autre_raison_perte_lunettes: !!rec.Motif_Perte_de_lunettes,
          sante_oculaire: rec.Sant_oculaire_PIO_FO || "",
          orthoptie: rec.Orthoptie_exercices_r_alis_s || "",
          port_lentilles: rec.Port_de_lentilles || "",
          sentez_vos_yeux: rec.Ressenti_des_yeux || "",

          // activités (bools)
          vl_conduite_auto: !!rec.Conduite_automobile,
          vl_conduite_nuit: !!rec.Conduite_de_nuit,
          vl_marche_exterieur: !!rec.Marche_ext_rieur,
          vl_velo_deuxroues: !!rec.V_lo_deux_roues,
          vl_sport_exterieur: !!rec.Sport_ext_rieur,
          vl_voyage: !!rec.Voyage_fr_quent,
          vl_observation_distance: !!rec.Observation_distance,
          vl_lecture_panneaux: !!rec.Lecture_de_panneaux,
          autres_activites_vl: rec.Autres_activit_s_VL || "",

          vi_ordinateur_fixe: !!rec.Ordinateur_fixe,
          vi_ordinateur_portable: !!rec.Ordinateur_portable,
          vi_double_ecran: !!rec.Double_cran,
          vi_ecran_prolonge: !!rec.cran_prolong,
          vi_television: !!rec.T_l_vision,
          vi_cuisine: !!rec.Cuisine,
          vi_bricolage: !!rec.Bricolage,
          vi_atelier: !!rec.Activit_manuelle,
          vi_enseignement: !!rec.Enseignement_pr_sentation,
          vi_commerce: !!rec.Commerce_accueil_client,
          autres_activites_vi: rec.Autres_activit_s_VI || "",

          vp_lecture_intensive: !!rec.Lecture_intensive,
          vp_lecture_occasionnelle: !!rec.Lecture_occasionnelle,
          vp_smartphone: !!rec.T_l_phone_smartphone,
          vp_tablette: !!rec.Tablette,
          vp_ecriture: !!rec.criture,
          vp_etude: !!rec.tude_r_vision,
          vp_couture_tricot: !!rec.Couture_tricot,
          vp_dessin_peinture: !!rec.Dessin_peinture,
          vp_precision: !!rec.Activit_s_de_pr_cision,
          autres_activites_vp: rec.Autres_activit_s_VP || "",

          type_verres_ancien: rec.Type_de_verres_port_s || "",
          correction_ancienne: rec.Ancienne_correction_OD_OG || "",
          date_ancien_equipement: rec.Date_derni_re_facture || "",
          correction_nouvelle: rec.Nouvelle_correction_OD_OG || "",

          av_vl_od: rec.AV_VL_OD ?? "",
          av_vl_og: rec.AV_VL_OG ?? "",
          av_vl_odg: rec.AV_VL_ODG ?? "",
          av_vp_od: rec.AV_VP_OD ?? "",
          av_vp_og: rec.AV_VP_OG ?? "",
          av_vp_odg: rec.AV_VP_ODG ?? "",

          // tests tri-state => on reconstruit les bools depuis les valeurs texte
          test_025_up: rec.Test_0_25 === "Montée",
          test_025_equal: rec.Test_0_25 === "Stable",
          test_025_down: rec.Test_0_25 === "Chute",

          test_05_up: rec.Test_0_50 === "Montée",
          test_05_equal: rec.Test_0_50 === "Stable",
          test_05_down: rec.Test_0_50 === "Chute",

          // péniche
          peniche_id: rec?.P_niche?.id || null,
          peniche: rec?.P_niche?.name || "",

          // contrôle
          controle_opticien: rec?.Opticien_contr_le?.id || "",
          controle_1er_vis: !!rec.Premier_quipement_vis,
          controle_1er_polissage: !!rec.Premier_quipement_polissage,
          controle_1er_transition: !!rec.Premier_quipement_transition,
          controle_1er_opticien: rec?.Opticien_premier_quipement?.id || "",

          controle_2eme_vis: !!rec.Deuxi_me_quipement_vis,
          controle_2eme_polissage: !!rec.Deuxi_me_quipement_polissage,
          controle_2eme_transition: !!rec.Deuxi_me_quipement_transition,
          controle_2eme_opticien: rec?.Opticien_deuxi_me_quipement?.id || "",

          securite_monture_metal: !!rec.S_curit_monture_m_tal,

          // livraison
          livraison_opticien: rec?.Opticien_livraison?.id || "",
          acuite_odg: rec.Acuit_ODG_livraison ?? "",
          ressenti_client: rec.Ressenti_client || "",
          points_vigilance: rec.Points_de_vigilance || "",
          satisfaction_client: rec.Satisfaction || "",
        }));
      } catch (e) {
        console.error("Erreur getRecord Anamneses :", e);
        setError("Impossible de charger la fiche.");
        setFormData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  const title = useMemo(() => {
    const prenom = formData?.prenom || "";
    const nom = formData?.nom || "";
    const full = [prenom, nom].filter(Boolean).join(" ");
    return full ? `Édition — ${full}` : "Édition de la fiche";
  }, [formData?.prenom, formData?.nom]);

  // ✅ UPDATE via API Zoho (PUT /Anamneses/{id})
  const handleSave = async () => {
    if (!recordId) return;
    if (!window.ZOHO) return;

    try {
      setIsSaving(true);
      setError(null);

      const payload = buildZohoUpdatePayload(formData);

      const resp = await window.ZOHO.CRM.CONNECTION.invoke("zcrm", {
        url: `https://www.zohoapis.eu/crm/v8/Anamneses/${recordId}`,
        method: "PUT",
        parameters: payload,
      });

      console.log("UPDATE ANAMNESE RESP:", resp);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (e) {
      console.error("Erreur update anamnese :", e);
      setError("Erreur lors de l’enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ DELETE via API Zoho
  const handleDelete = async () => {
    if (!recordId) return;
    if (!window.ZOHO) return;

    try {
      setIsDeleting(true);
      setError(null);

      const resp = await window.ZOHO.CRM.CONNECTION.invoke("zcrm", {
        url: `https://www.zohoapis.eu/crm/v8/Anamneses/${recordId}`,
        method: "DELETE",
      });

      console.log("DELETE ANAMNESE RESP:", resp);
      navigate(createPageUrl("ListeFiches"));
    } catch (e) {
      console.error("Erreur delete anamnese :", e);
      setError("Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSection = () => {
    const props = { data: formData, onChange: setFormData };

    switch (activeTab) {
      case "identification":
        return <EditIdentificationSection {...props} opticians={opticians} />;
      case "anamnese":
        return <InfosGenerales {...props} />;
      case "activites":
        return <ActivitesSection {...props} />;
      case "essai":
        return <EssaiCompensationSection {...props} />;
      case "controle":
        return <ControleEquipementSection {...props} opticians={opticians} />;
      case "livraison":
        return <LivraisonSuiviSection {...props} opticians={opticians} />;
      default:
        return null;
    }
  };

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
                onClick={() => navigate(createPageUrl("ListeFiches"))}
                className="p-2 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">Édition de la fiche</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette fiche ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. La fiche de{" "}
                      {formData.prenom} {formData.nom} sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 rounded-xl"
                    >
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                onClick={handleSave}
                disabled={isSaving || !recordId}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <NavigationTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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