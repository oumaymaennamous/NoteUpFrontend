'use client'

import { useState, useEffect } from 'react'
import { Plus, FileDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddEtudiantModal } from '@/components/AddEtudiantModal'
import RootLayoutAdmin from '@/componantes/admin/layout'
import axios from 'axios'
import * as XLSX from 'xlsx'

interface EtudiantDtoReponse {
  nom: string;
  prenom: string;
  cin: string;
  cne: string;
  filiere: string;
  semestre: string;
  annees: string;
}

interface Filiere {
  id: number;
  nom: string;
}

interface Promo {
  id: number;
  annee: string;
}

interface Semestre {
  id: number;
  nom: string;
}

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<EtudiantDtoReponse[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [semestres, setSemestres] = useState<Semestre[]>([])
  const [filtreFiliere, setFiltreFiliere] = useState<string>('')
  const [filtrePromo, setFiltrePromo] = useState<string>('')
  const [filtreSemestre, setFiltreSemestre] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [etudiantsRes, filieresRes, promosRes] = await Promise.all([
        axios.get<EtudiantDtoReponse[]>('http://localhost:8080/admin/etudiants'),
        axios.get<Filiere[]>('http://localhost:8080/admin/etudiants/filieres'),
        axios.get<Promo[]>('http://localhost:8080/admin/etudiants/promos')
      ])
      setEtudiants(etudiantsRes.data)
      setFilieres(filieresRes.data)
      setPromos(promosRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSemestres = async (promoId: string): Promise<Semestre[]> => {
    try {
      const response = await axios.get<Semestre[]>(`http://localhost:8080/admin/etudiants/promos/${promoId}/semestres`);
      return response.data;
    } catch (error) {
      console.error('Error fetching semestres:', error);
      return [];
    }
  };

  const filteredEtudiants = etudiants.filter(etudiant => 
    (!filtreFiliere || etudiant.filiere === filtreFiliere) &&
    (!filtrePromo || etudiant.annees === filtrePromo) &&
    (!filtreSemestre || etudiant.semestre === filtreSemestre)
  )

  const handleAddEtudiant = async (newEtudiant: Omit<EtudiantDtoReponse, 'annees'>) => {
    try {
      await axios.post('http://localhost:8080/admin/etudiants', newEtudiant)
      fetchData()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  const handleDeleteEtudiant = async (cin: string) => {
    try {
      await axios.delete(`http://localhost:8080/admin/etudiants/${cin}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEtudiants)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants")
    XLSX.writeFile(wb, "etudiants.xlsx")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <RootLayoutAdmin>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Étudiants</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un étudiant
            </Button>
            <Button onClick={handleExportExcel}>
              <FileDown className="mr-2 h-4 w-4" /> Exporter Excel
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <Select onValueChange={setFiltreFiliere}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
              {filieres.map((filiere) => (
                <SelectItem key={filiere.id} value={filiere.nom}>{filiere.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setFiltrePromo}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Promotion" />
            </SelectTrigger>
            <SelectContent>
              {promos.map((promo) => (
                <SelectItem key={promo.id} value={promo.annee}>{promo.annee}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setFiltreSemestre}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              {semestres.map((semestre) => (
                <SelectItem key={semestre.id} value={semestre.nom}>{semestre.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead>CNE</TableHead>
              <TableHead>Filière</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEtudiants.map((etudiant) => (
              <TableRow key={etudiant.cin}>
                <TableCell>{etudiant.nom}</TableCell>
                <TableCell>{etudiant.prenom}</TableCell>
                <TableCell>{etudiant.cin}</TableCell>
                <TableCell>{etudiant.cne}</TableCell>
                <TableCell>{etudiant.filiere}</TableCell>
                <TableCell>{etudiant.semestre}</TableCell>
                <TableCell>{etudiant.annees}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => handleDeleteEtudiant(etudiant.cin)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddEtudiantModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddEtudiant}
          filieres={filieres}
          promos={promos}
          fetchSemestres={fetchSemestres}
        />
      </div>
    </RootLayoutAdmin>
  )
}

