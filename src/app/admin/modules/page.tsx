'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import RootLayoutAdmin from '@/componantes/admin/layout'
import { AddModuleModal } from '@/components/AddModuleModal'
import { Module } from '@/types/Module'

interface Filiere {
  codeFiliere: number;
  nomFiliere: string;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [filtreFiliere, setFiltreFiliere] = useState<string>('')
  const [filtreSemestre, setFiltreSemestre] = useState<string>('')
  const [filtreAnnee, setFiltreAnnee] = useState<string>('')
  const [semestres, setSemestres] = useState<string[]>([])
  const [annees, setAnnees] = useState<string[]>([])
  const [filieres, setFilieres] = useState<Filiere[]>([])

  useEffect(() => {
    // Fetch modules
    fetch('http://localhost:8080/admin/modules')
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(error => console.error('Error fetching modules:', error));

    // Fetch distinct semestres
    fetch('http://localhost:8080/admin/distinct-semestres')
      .then(response => response.json())
      .then(data => setSemestres(data))
      .catch(error => console.error('Error fetching semestres:', error));

    // Fetch distinct annees
    fetch('http://localhost:8080/admin/distinct-annees')
      .then(response => response.json())
      .then(data => setAnnees(data))
      .catch(error => console.error('Error fetching annees:', error));

    // Fetch filieres
    fetch('http://localhost:8080/admin/filiere')
      .then(response => response.json())
      .then(data => setFilieres(data))
      .catch(error => console.error('Error fetching filieres:', error));
  }, []);

  const filteredModules = modules.filter(module => 
    (!filtreFiliere || module.filiereName === filtreFiliere) &&
    (!filtreSemestre || module.semestreName === filtreSemestre) &&
    (!filtreAnnee || module.annee === filtreAnnee)
  )

  const handleDeleteModule = (codeModule: number) => {
    // Here you would typically make an API call to delete the module
    // For now, we'll just update the state
    setModules(modules.filter(module => module.codeModule !== codeModule))
  }

  const handleAddModule = (newModule: Omit<Module, 'codeModule'>) => {
    fetch('http://localhost:8080/admin/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newModule),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add module');
        }
        return response.json();
      })
      .then((addedModule) => {
        setModules([...modules, addedModule]);
      })
      .catch((error) => console.error(error));
  };
  return (
    <RootLayoutAdmin> 
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Modules</h1>
          <AddModuleModal
            filieres={filieres}
            semestres={semestres}
            annees={annees}
            onAddModule={handleAddModule}
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <Select onValueChange={setFiltreFiliere}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
              {filieres.map((filiere) => (
                <SelectItem key={filiere.codeFiliere} value={filiere.nomFiliere}>{filiere.nomFiliere}</SelectItem>
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
              <TableRow key={module.codeModule}>
                <TableCell>{module.nameModule}</TableCell>
                <TableCell>{module.filiereName}</TableCell>
                <TableCell>{module.semestreName}</TableCell>
                <TableCell>{module.annee}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/modules/${module.codeModule}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon" className="h-8 w-8 p-0" onClick={() => handleDeleteModule(module.codeModule)}>
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

