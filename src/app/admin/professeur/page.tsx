'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 
import RootLayoutAdmin from '@/componantes/admin/layout'
import { Plus, Search, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Professor {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  cin: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newProfessor, setNewProfessor] = useState<Omit<Professor, 'id'>>({
    nom: '',
    prenom: '',
    specialite: '',
    cin: ''
  })
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingProfessor, setIsAddingProfessor] = useState(false)
  const [isUpdatingProfessor, setIsUpdatingProfessor] = useState(false)
  const [isDeletingProfessor, setIsDeletingProfessor] = useState<number | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/professeur')
      if (!response.ok) {
        throw new Error('Failed to fetch professors')
      }
      const data = await response.json()
      setProfessors(data)
    } catch (error) {
      console.error('Error fetching professors:', error)
      showNotification('error', 'Failed to load professors. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000) // Hide notification after 5 seconds
  }

  const filteredProfessors = professors.filter(professor => 
    professor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.cin.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProfessor = async () => {
    setIsAddingProfessor(true)
    try {
      const response = await fetch('http://localhost:8080/admin/professeur-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfessor),
      })
      if (!response.ok) {
        throw new Error('Failed to add professor')
      }
      const addedProfessor = await response.json()
      setProfessors([...professors, addedProfessor])
      setNewProfessor({ nom: '', prenom: '', specialite: '', cin: '' })
      showNotification('success', 'Professor added successfully.')
    } catch (error) {
      console.error('Error adding professor:', error)
      showNotification('error', 'Failed to add professor. Please try again.')
    } finally {
      setIsAddingProfessor(false)
    }
  }

  const handleUpdateProfessor = async () => {
    if (!editingProfessor) return
    setIsUpdatingProfessor(true)
    try {
      const response = await fetch(`http://localhost:8080/admin/professeur-update/${editingProfessor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProfessor),
      })
      if (!response.ok) {
        throw new Error('Failed to update professor')
      }
      const updatedProfessor = await response.json()
      setProfessors(professors.map(p => p.id === updatedProfessor.id ? updatedProfessor : p))
      setEditingProfessor(null)
      showNotification('success', 'Professor updated successfully.')
    } catch (error) {
      console.error('Error updating professor:', error)
      showNotification('error', 'Failed to update professor. Please try again.')
    } finally {
      setIsUpdatingProfessor(false)
    }
  }

  const handleDeleteProfessor = async (id: number) => {
    setIsDeletingProfessor(id)
    try {
      const response = await fetch(`http://localhost:8080/admin/professeur-delete/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete professor')
      }
      setProfessors(professors.filter(p => p.id !== id))
      showNotification('success', 'Professor deleted successfully.')
    } catch (error) {
      console.error('Error deleting professor:', error)
      showNotification('error', 'Failed to delete professor. Please try again.')
    } finally {
      setIsDeletingProfessor(null)
    }
  }

  if (isLoading) {
    return (
      <RootLayoutAdmin>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </RootLayoutAdmin>
    )
  }

  return (
    <RootLayoutAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Gestion des Professeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Rechercher un professeur"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter un professeur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau professeur</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nom" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        value={newProfessor.nom}
                        onChange={(e) => setNewProfessor({ ...newProfessor, nom: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prenom" className="text-right">
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        value={newProfessor.prenom}
                        onChange={(e) => setNewProfessor({ ...newProfessor, prenom: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="specialite" className="text-right">
                        Spécialité
                      </Label>
                      <Input
                        id="specialite"
                        value={newProfessor.specialite}
                        onChange={(e) => setNewProfessor({ ...newProfessor, specialite: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cin" className="text-right">
                        CIN
                      </Label>
                      <Input
                        id="cin"
                        value={newProfessor.cin}
                        onChange={(e) => setNewProfessor({ ...newProfessor, cin: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProfessor} disabled={isAddingProfessor}>
                    {isAddingProfessor ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      'Ajouter'
                    )}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Spécialité</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell>{professor.nom}</TableCell>
                    <TableCell>{professor.prenom}</TableCell>
                    <TableCell>{professor.specialite}</TableCell>
                    <TableCell>{professor.cin}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Pencil className="h-4 w-4 mr-1" /> Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Modifier le professeur</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-nom" className="text-right">
                                Nom
                              </Label>
                              <Input
                                id="edit-nom"
                                value={editingProfessor?.nom}
                                onChange={(e) => setEditingProfessor(prev => prev ? {...prev, nom: e.target.value} : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-prenom" className="text-right">
                                Prénom
                              </Label>
                              <Input
                                id="edit-prenom"
                                value={editingProfessor?.prenom}
                                onChange={(e) => setEditingProfessor(prev => prev ? {...prev, prenom: e.target.value} : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-specialite" className="text-right">
                                Spécialité
                              </Label>
                              <Input
                                id="edit-specialite"
                                value={editingProfessor?.specialite}
                                onChange={(e) => setEditingProfessor(prev => prev ? {...prev, specialite: e.target.value} : null)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-cin" className="text-right">
                                CIN
                              </Label>
                              <Input
                                id="edit-cin"
                                value={editingProfessor?.cin}
                                onChange={(e) => setEditingProfessor(prev => prev ? {...prev, cin: e.target.value} : null)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button onClick={handleUpdateProfessor} disabled={isUpdatingProfessor}>
                            {isUpdatingProfessor ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mise à jour en cours...
                              </>
                            ) : (
                              'Mettre à jour'
                            )}
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteProfessor(professor.id)}
                        disabled={isDeletingProfessor === professor.id}
                      >
                        {isDeletingProfessor === professor.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RootLayoutAdmin>
  )
}

