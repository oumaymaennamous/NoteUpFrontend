'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import RootLayoutAdmin from '@/componantes/admin/layout'

interface ElementModule {
  id: number;
  nom: string;
  professeur: string;
  coefficient: number;
  evaluations: {
    tp: number;
    projet: number;
    cc: number;
  };
}

interface Module {
  id: number;
  nom: string;
  filiere: string;
  semestre: string;
  annee: string;
  elements: ElementModule[];
}

const professeurs = ['Dr. Dupont', 'Dr. Martin', 'Dr. Bernard', 'Dr. Thomas', 'Dr. Robert']

export default function ModuleDetailsPage() {
  const params = useParams()
  const moduleId = Number(params.id)

  const [module, setModule] = useState<Module | null>(null)
  const [newElement, setNewElement] = useState<Omit<ElementModule, 'id'>>({
    nom: '',
    professeur: '',
    coefficient: 1,
    evaluations: { tp: 0, projet: 0, cc: 0 }
  })

  useEffect(() => {
    // Simulons le chargement des données du module
    const mockModule: Module = {
      id: moduleId,
      nom: 'Programmation Orientée Objet',
      filiere: 'Informatique',
      semestre: 'S2',
      annee: '2023',
      elements: [
        {
          id: 1,
          nom: 'Théorie des objets',
          professeur: 'Dr. Dupont',
          coefficient: 2,
          evaluations: { tp: 30, projet: 30, cc: 40 }
        }
      ]
    }
    setModule(mockModule)
  }, [moduleId])

  const handleAddElement = () => {
    if (module) {
      const newElementWithId = { ...newElement, id: module.elements.length + 1 }
      setModule({ ...module, elements: [...module.elements, newElementWithId] })
      setNewElement({
        nom: '',
        professeur: '',
        coefficient: 1,
        evaluations: { tp: 0, projet: 0, cc: 0 }
      })
    }
  }

  if (!module) {
    return <div>Chargement...</div>
  }

  return (
    <RootLayoutAdmin> 
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Modifier le module : {module.nom}</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Éléments du module</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de l'élément</TableHead>
              <TableHead>Professeur</TableHead>
              <TableHead>Coefficient</TableHead>
              <TableHead>TP (%)</TableHead>
              <TableHead>Projet (%)</TableHead>
              <TableHead>CC (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {module.elements.map((element) => (
              <TableRow key={element.id}>
                <TableCell>{element.nom}</TableCell>
                <TableCell>{element.professeur}</TableCell>
                <TableCell>{element.coefficient}</TableCell>
                <TableCell>{element.evaluations.tp}</TableCell>
                <TableCell>{element.evaluations.projet}</TableCell>
                <TableCell>{element.evaluations.cc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouvel élément</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nom">Nom de l'élément</Label>
            <Input
              id="nom"
              value={newElement.nom}
              onChange={(e) => setNewElement({ ...newElement, nom: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="professeur">Professeur</Label>
            <Select onValueChange={(value) => setNewElement({ ...newElement, professeur: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un professeur" />
              </SelectTrigger>
              <SelectContent>
                {professeurs.map((prof) => (
                  <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="coefficient">Coefficient</Label>
            <Input
              id="coefficient"
              type="number"
              value={newElement.coefficient}
              onChange={(e) => setNewElement({ ...newElement, coefficient: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="tp">TP (%)</Label>
            <Input
              id="tp"
              type="number"
              value={newElement.evaluations.tp}
              onChange={(e) => setNewElement({ ...newElement, evaluations: { ...newElement.evaluations, tp: Number(e.target.value) } })}
            />
          </div>
          <div>
            <Label htmlFor="projet">Projet (%)</Label>
            <Input
              id="projet"
              type="number"
              value={newElement.evaluations.projet}
              onChange={(e) => setNewElement({ ...newElement, evaluations: { ...newElement.evaluations, projet: Number(e.target.value) } })}
            />
          </div>
          <div>
            <Label htmlFor="cc">CC (%)</Label>
            <Input
              id="cc"
              type="number"
              value={newElement.evaluations.cc}
              onChange={(e) => setNewElement({ ...newElement, evaluations: { ...newElement.evaluations, cc: Number(e.target.value) } })}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleAddElement}>Ajouter l'élément</Button>
      </div>

      <Button>Enregistrer les modifications</Button>
    </div>
    </RootLayoutAdmin>
  )
}

