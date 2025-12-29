import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  User,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  en_cours: { label: 'En cours', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-700 border-green-200', icon: Truck },
  suivi: { label: 'Suivi', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle }
};

export default function ListeFiches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: fiches = [], isLoading } = useQuery({
    queryKey: ['fiches'],
    queryFn: () => base44.entities.FicheAnamnese.list('-created_date', 100)
  });

  const filteredFiches = fiches.filter(fiche => {
    const matchesSearch = 
      (fiche.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (fiche.prenom?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fiche.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fiches Anamnèse</h1>
              <p className="text-gray-500 mt-1">Gérez vos fiches clients</p>
            </div>
            <Link to={createPageUrl('NouvelleFiche')}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg shadow-blue-600/25 w-full md:w-auto justify-center">
                <Plus className="w-5 h-5" />
                Nouvelle fiche
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou prénom..."
                className="pl-12 h-12 rounded-xl border-gray-200"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'en_cours', label: 'En cours' },
                { value: 'livree', label: 'Livrées' },
                { value: 'suivi', label: 'Suivi' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === filter.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFiches.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune fiche trouvée</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Essayez une autre recherche' : 'Créez votre première fiche anamnèse'}
            </p>
            {!searchTerm && (
              <Link to={createPageUrl('NouvelleFiche')}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une fiche
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFiches.map((fiche, index) => {
              const status = statusConfig[fiche.statut] || statusConfig.en_cours;
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={fiche.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={createPageUrl(`EditerFiche?id=${fiche.id}`)}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg shadow-blue-500/30">
                            {fiche.prenom?.[0]?.toUpperCase() || ''}{fiche.nom?.[0]?.toUpperCase() || ''}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                              {fiche.prenom} {fiche.nom}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              {fiche.date_visite && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(fiche.date_visite), 'dd MMM yyyy', { locale: fr })}
                                </span>
                              )}
                              {fiche.opticien && (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {fiche.opticien}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${status.color} border px-3 py-1 flex items-center gap-1.5`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                      
                      {fiche.type_equipement && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Badge variant="outline" className="text-xs">
                            {fiche.type_equipement === 'premiere_lunette' && '1ère lunette'}
                            {fiche.type_equipement === 'premier_progressif' && '1er progressif'}
                            {fiche.type_equipement === 'renouvellement' && 'Renouvellement'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}