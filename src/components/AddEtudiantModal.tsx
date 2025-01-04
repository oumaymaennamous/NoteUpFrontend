'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

interface Filiere {
  codeFiliere: number
  nomFiliere: string
}

interface AddEtudiantModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (etudiant: {
    nom: string
    prenom: string
    cin: string
    cne: string
    filiere: string
    semestre: string
    annees: string
  }) => void
  filieres: Filiere[]
  semestres: string[]
  annees: string[]
}

export function AddEtudiantModal({ isOpen, onClose, onAdd, filieres, semestres, annees }: AddEtudiantModalProps) {
  const initialFormData = {
    nom: '',
    prenom: '',
    cin: '',
    cne: '',
    filiere: '',
    semestre: '',
    annees: ''
  }

  const [formData, setFormData] = useState(initialFormData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.nom || !formData.prenom || !formData.cin || !formData.cne || 
        !formData.filiere || !formData.semestre || !formData.annees) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      })
      return
    }

    onAdd(formData)
    setFormData(initialFormData)
  }

  const handleClose = () => {
    setFormData(initialFormData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un étudiant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Nom de l'étudiant"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="Prénom de l'étudiant"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cin">CIN</Label>
              <Input
                id="cin"
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                placeholder="CIN de l'étudiant"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cne">CNE</Label>
              <Input
                id="cne"
                value={formData.cne}
                onChange={(e) => setFormData({ ...formData, cne: e.target.value })}
                placeholder="CNE de l'étudiant"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filiere">Filière</Label>
              <Select
                value={formData.filiere}
                onValueChange={(value) => setFormData({ ...formData, filiere: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent>
                  {filieres.filter(Boolean).map((filiere) => (
                    <SelectItem 
                      key={`modal-filiere-${filiere.codeFiliere}`} 
                      value={filiere.nomFiliere}
                    >
                      {filiere.nomFiliere}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Select
                value={formData.semestre}
                onValueChange={(value) => setFormData({ ...formData, semestre: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres.filter(Boolean).map((semestre) => (
                    <SelectItem 
                      key={`modal-semestre-${semestre}`} 
                      value={semestre}
                    >
                      {semestre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="annee">Année</Label>
              <Select
                value={formData.annees}
                onValueChange={(value) => setFormData({ ...formData, annees: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {annees.filter(Boolean).map((annee) => (
                    <SelectItem 
                      key={`modal-annee-${annee}`} 
                      value={annee}
                    >
                      {annee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

