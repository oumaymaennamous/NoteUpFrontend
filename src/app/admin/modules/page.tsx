'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import RootLayoutAdmin from '@/componantes/admin/layout'

interface Module {
  id: number;
  nom: string;
  filiere: string;
  semestre: string;
  annee: string;
}

interface Filiere {
  id: number;
  nom: string;
}

const filieres: Filiere[] = [
  { id: 1, nom: 'Informatique' },
  { id: 2, nom: 'Génie Civil' },
  { id: 3, nom: 'Électronique' },
]

const semestres = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
const annees = ['2021', '2022', '2023', '2024']

// Simulons des données de modules
const initialModules: Module[] = [
  { id: 1, nom: 'Programmation Orientée Objet', filiere: 'Informatique', semestre: 'S2', annee: '2023' },
  { id: 2, nom: 'Structures de Données', filiere: 'Informatique', semestre: 'S3', annee: '2023' },
  { id: 3, nom: 'Résistance des Matériaux', filiere: 'Génie Civil', semestre: 'S4', annee: '2022' },
  { id: 4, nom: 'Électronique Numérique', filiere: 'Électronique', semestre: 'S1', annee: '2024' },
]

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [filtreFiliere, setFiltreFiliere] = useState<string>('')
  const [filtreSemestre, setFiltreSemestre] = useState<string>('')
  const [filtreAnnee, setFiltreAnnee] = useState<string>('')

  const filteredModules = modules.filter(module => 
    (!filtreFiliere || module.filiere === filtreFiliere) &&
    (!filtreSemestre || module.semestre === filtreSemestre) &&
    (!filtreAnnee || module.annee === filtreAnnee)
  )

  const handleDeleteModule = (id: number) => {
    setModules(modules.filter(module => module.id !== id))
  }

  return (
    <RootLayoutAdmin> 
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Modules</h1>
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

        <Select onValueChange={setFiltreSemestre}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            {semestres.map((semestre) => (
              <SelectItem key={semestre} value={semestre}>{semestre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setFiltreAnnee}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {annees.map((annee) => (
              <SelectItem key={annee} value={annee}>{annee}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du Module</TableHead>
            <TableHead>Filière</TableHead>
            <TableHead>Semestre</TableHead>
            <TableHead>Année</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredModules.map((module) => (
            <TableRow key={module.id}>
              <TableCell>{module.nom}</TableCell>
              <TableCell>{module.filiere}</TableCell>
              <TableCell>{module.semestre}</TableCell>
              <TableCell>{module.annee}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/modules/${module.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => handleDeleteModule(module.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </RootLayoutAdmin>
  )
}

