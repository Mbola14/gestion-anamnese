import React from 'react';
import { User, Calendar, Phone, Mail, AlertTriangle } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import TouchInput from '../TouchInput';
import TouchToggle from '../TouchToggle';

export default function IdentificationSection({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Identification Client" icon={User} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Nom"
          value={data.nom}
          onChange={(v) => handleChange('nom', v)}
          placeholder="Nom du client"
          size="large"
        />
        <TouchInput
          label="Prénom"
          value={data.prenom}
          onChange={(v) => handleChange('prenom', v)}
          placeholder="Prénom du client"
          size="large"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TouchInput
          label="Date de naissance"
          value={data.date_naissance}
          onChange={(v) => handleChange('date_naissance', v)}
          type="date"
        />
        <TouchInput
          label="Téléphone"
          value={data.telephone}
          onChange={(v) => handleChange('telephone', v)}
          placeholder="06 00 00 00 00"
          type="tel"
        />
        <TouchInput
          label="Email"
          value={data.email}
          onChange={(v) => handleChange('email', v)}
          placeholder="email@exemple.com"
          type="email"
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-amber-800">Type d'équipement</span>
        </div>
        <TouchToggle
          options={[
            { value: 'premiere_lunette', label: '1ère lunette' },
            { value: 'premier_progressif', label: '1er progressif' },
            { value: 'renouvellement', label: 'Renouvellement' }
          ]}
          value={data.type_equipement}
          onChange={(v) => handleChange('type_equipement', v)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Livraison impérative"
          value={data.livraison_imperative}
          onChange={(v) => handleChange('livraison_imperative', v)}
          type="date"
        />
        <TouchInput
          label="Numéro AdN"
          value={data.adn}
          onChange={(v) => handleChange('adn', v)}
          placeholder="AdN"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TouchInput
          label="Date de visite"
          value={data.date_visite}
          onChange={(v) => handleChange('date_visite', v)}
          type="date"
        />
        <TouchInput
          label="Opticien"
          value={data.opticien}
          onChange={(v) => handleChange('opticien', v)}
          placeholder="Nom de l'opticien"
        />
      </div>
    </div>
  );
}