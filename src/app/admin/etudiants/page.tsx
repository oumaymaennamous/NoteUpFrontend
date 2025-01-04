'use client'

import { useState, useEffect } from 'react'
import { Plus, FileDown, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddEtudiantModal } from '@/components/AddEtudiantModal'
import RootLayoutAdmin from '@/componantes/admin/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import * as XLSX from 'xlsx'

interface EtudiantDtoReponse {
  nom: string
  prenom: string
  cin: string
  cne: string
  filiere: string
  semestre: string
  annees: string
}

interface Filiere {
  codeFiliere: number
   
  nomFiliere: string
}

export default function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState<EtudiantDtoReponse[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [semestres, setSemestres] = useState<string[]>([])
  const [annees, setAnnees] = useState<string[]>([])
  const [filtreFiliere, setFiltreFiliere] = useState<string>("all")
  const [filtreSemestre, setFiltreSemestre] = useState<string>("all")
  const [filtreAnnee, setFiltreAnnee] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [etudiantsRes, filieresRes, semestreRes, anneeRes] = await Promise.all([
        axios.get<EtudiantDtoReponse[]>('http://localhost:8080/admin/etudiants'),
        axios.get<Filiere[]>('http://localhost:8080/admin/filiere'),
        axios.get<string[]>('http://localhost:8080/admin/distinct-semestres'),
        axios.get<string[]>('http://localhost:8080/admin/distinct-annees'),
      ])
      setEtudiants(etudiantsRes.data)
      setFilieres(filieresRes.data)
      setSemestres(semestreRes.data)
      setAnnees(anneeRes.data)
      console.log(filieresRes.data)
    } catch (error) {
      setError('Erreur lors du chargement des données')
      toast({
        title: "Erreur",
        description: "Impossible de charger les données. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEtudiants = etudiants.filter(etudiant => 
    (filtreFiliere === "all" || etudiant.filiere === filtreFiliere) &&
    (filtreAnnee === "all" || etudiant.annees === filtreAnnee) &&
    (filtreSemestre === "all" || etudiant.semestre === filtreSemestre)
  )

  const handleAddEtudiant = async (newEtudiant: EtudiantDtoReponse) => {
    try {
      await axios.post('http://localhost:8080/admin/etudiants', newEtudiant)
      await fetchData()
      setIsModalOpen(false)
      toast({
        title: "Succès",
        description: "L'étudiant a été ajouté avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'étudiant. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEtudiant = async (cin: string) => {
    try {
      await axios.delete(`http://localhost:8080/admin/etudiants/${cin}`)
      await fetchData()
      toast({
        title: "Succès",
        description: "L'étudiant a été supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'étudiant. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleExportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(filteredEtudiants)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Etudiants")
      XLSX.writeFile(wb, "etudiants.xlsx")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <RootLayoutAdmin>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>Réessayer</Button>
          </div>
        </div>
      </RootLayoutAdmin>
    )
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
            <Button onClick={handleExportExcel} disabled={filteredEtudiants.length === 0}>
              <FileDown className="mr-2 h-4 w-4" /> Exporter Excel
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <Select value={filtreFiliere} onValueChange={setFiltreFiliere}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-filieres" value="all">Toutes les filières</SelectItem>
              {filieres.filter(Boolean).map((filiere) => (
                <SelectItem 
                  key={`${filiere.codeFiliere}`} 
                  value={filiere.nomFiliere}
                >
                  {filiere.nomFiliere}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtreAnnee} onValueChange={setFiltreAnnee}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-annees" value="all">Toutes les années</SelectItem>
              {annees.filter(Boolean).map((annee) => (
                <SelectItem 
                  key={`annee-${annee}`} 
                  value={annee}
                >
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtreSemestre} onValueChange={setFiltreSemestre}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-semestres" value="all">Tous les semestres</SelectItem>
              {semestres.filter(Boolean).map((semestre) => (
                <SelectItem 
                  key={`semestre-${semestre}`} 
                  value={semestre}
                >
                  {semestre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredEtudiants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Aucun étudiant trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredEtudiants.map((etudiant) => (
                  <TableRow key={etudiant.cin}>
                    <TableCell>{etudiant.nom}</TableCell>
                    <TableCell>{etudiant.prenom}</TableCell>
                    <TableCell>{etudiant.cin}</TableCell>
                    <TableCell>{etudiant.cne}</TableCell>
                    <TableCell>{etudiant.filiere}</TableCell>
                    <TableCell>{etudiant.semestre}</TableCell>
                    <TableCell>{etudiant.annees}</TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => toast({
                            title: "Info",
                            description: "La modification d'étudiant sera disponible prochainement",
                          })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteEtudiant(etudiant.cin)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AddEtudiantModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddEtudiant}
          filieres={filieres}
          semestres={semestres}
          annees={annees}
        />
      </div>
    </RootLayoutAdmin>
  )
}

