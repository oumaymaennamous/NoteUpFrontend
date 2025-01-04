'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import RootLayoutAdmin from '@/componantes/admin/layout'
import { Plus, Eye, Trash2, Edit, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { ElementModule, ModeEvaluation, Module } from '@/types/Module'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/admin'

export default function ModuleDetailsPage() {
  const params = useParams()
  const moduleId = Number(params.id)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [elements, setElements] = useState<ElementModule[]>([])
  const [selectedElement, setSelectedElement] = useState<ElementModule | null>(null)
  const [newElement, setNewElement] = useState({ name: '', coefficient: 0, professorId: 0 })
  const [professors, setProfessors] = useState<{ id: number, name: string }[]>([])
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [newEvaluationMode, setNewEvaluationMode] = useState<{ type: string, coefficient: number }>({ type: '', coefficient: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [moduleRes, elementsRes, professorsRes] = await Promise.all([
          fetch(`${API_URL}/modules/${moduleId}`),
          fetch(`${API_URL}/modules/${moduleId}/elements`),
          fetch(`${API_URL}/modules/professors`)
        ])
  
        if (!moduleRes.ok || !elementsRes.ok || !professorsRes.ok) {
          throw new Error('Failed to fetch data')
        }
  
        const [moduleData, elementsData, professorsData] = await Promise.all([
          moduleRes.json(),
          elementsRes.json(),
          professorsRes.json()
        ])
  
        setModule(moduleData)
        setElements(elementsData)
        setProfessors(professorsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        showNotification('error', 'Failed to load data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchData()
  }, [moduleId])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddEvaluationMode = async () => {
    if (selectedElement && newEvaluationMode.type && newEvaluationMode.coefficient > 0) {
      try {
        const response = await fetch(`${API_URL}/elements/${selectedElement.id}/evaluations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvaluationMode),
        })

        if (!response.ok) {
          throw new Error('Failed to add evaluation mode')
        }

        const newMode = await response.json()
        setElements(prevElements => prevElements.map(element => {
          if (element.id === selectedElement.id) {
            return {
              ...element,
              evaluationModes: [...(element.evaluationModes || []), newMode]
            }
          }
          return element
        }))
        setNewEvaluationMode({ type: '', coefficient: 0 })
        showNotification('success', 'Evaluation mode added successfully')
      } catch (error) {
        showNotification('error', 'Failed to add evaluation mode')
      }
    } else {
      showNotification('error', 'Please fill in all fields for the new evaluation mode')
    }
  }

  const handleEvaluationModeChange = async (elementId: number, modeId: number, field: keyof ModeEvaluation, value: string | number) => {
    try {
      if (field === 'type' && value === '') {
        showNotification('error', 'Type cannot be empty');
        return;
      }

      const response = await fetch(`${API_URL}/evaluations/${modeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update evaluation mode');
      }

      setElements(prevElements => prevElements.map(element => {
        if (element.id === elementId) {
          return {
            ...element,
            evaluationModes: (element.evaluationModes || []).map(mode =>
              mode.codeMode === modeId ? { ...mode, [field]: value } : mode
            )
          }
        }
        return element
      }));
      showNotification('success', 'Evaluation mode updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update evaluation mode');
    }
  };

  const handleDeleteEvaluationMode = async (elementId: number, modeId: number) => {
    try {
      const response = await fetch(`${API_URL}/evaluations/${modeId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete evaluation mode')
      }
      setElements(prevElements => prevElements.map(element => {
        if (element.id === elementId) {
          return {
            ...element,
            evaluationModes: (element.evaluationModes || []).filter(mode => mode.codeMode !== modeId)
          }
        }
        return element
      }))
      showNotification('success', 'Evaluation mode deleted successfully')
    } catch (error) {
      showNotification('error', 'Failed to delete evaluation mode')
    }
  }

  const handleDeleteElement = async (elementId: number) => {
    try {
      const response = await fetch(`${API_URL}/elements/${elementId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete element')
      }
      setElements(elements.filter(element => element.id !== elementId))
      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement(null)
      }
      showNotification('success', 'Element deleted successfully')
    } catch (error) {
      showNotification('error', 'Failed to delete element')
    }
  }

  const handleAddElement = async () => {
    try {
      const response = await fetch(`${API_URL}/modules/${moduleId}/elements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newElement),
      })

      if (!response.ok) {
        throw new Error('Failed to add element')
      }

      const addedElement = await response.json()
      setElements([...elements, addedElement])
      setNewElement({ name: '', coefficient: 0, professorId: 0 })
      showNotification('success', 'Element added successfully')
    } catch (error) {
      showNotification('error', 'Failed to add element')
    }
  }

  const handleEditElement = (elementId: number) => {
    const elementToEdit = elements.find(el => el.id === elementId);
    if (elementToEdit) {
      setNewElement({
        name: elementToEdit.name,
        coefficient: elementToEdit.coefficient,
        professorId: elementToEdit.professorId || 0
      });
    }
  };

  if (isLoading) {
    return (
      <RootLayoutAdmin>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </RootLayoutAdmin>
    )
  }

  if (error || !module) {
    return (
      <RootLayoutAdmin>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">Error</h2>
            <p>{error || 'Module not found'}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </RootLayoutAdmin>
    )
  }

  return (
    <RootLayoutAdmin>
      <div className="p-8 bg-gray-50 min-h-screen">
        {notification && (
          <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className="mb-4">
            {notification.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Module : {module.nameModule}</CardTitle>
            <CardDescription>
              Filière: {module.filiereName} | Semestre: {module.semestreName} | Année: {module.annee}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Éléments du module</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de l'élément</TableHead>
                  <TableHead>Coefficient</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elements.map((element) => (
                  <TableRow key={element.id}>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>{element.coefficient}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedElement(element)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Modes d'évaluation pour {element.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Ajouter un nouveau mode d'évaluation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="new-type">Type</Label>
                                      <Input
                                        id="new-type"
                                        value={newEvaluationMode.type}
                                        onChange={(e) => setNewEvaluationMode({ ...newEvaluationMode, type: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="new-coefficient">Coefficient</Label>
                                      <Input
                                        id="new-coefficient"
                                        type="number"
                                        value={newEvaluationMode.coefficient}
                                        onChange={(e) => setNewEvaluationMode({ ...newEvaluationMode, coefficient: parseFloat(e.target.value) })}
                                        min="0"
                                        max="100"
                                        step="10"
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={handleAddEvaluationMode} className="mt-4">
                                    <Plus className="h-4 w-4 mr-1" /> Ajouter
                                  </Button>
                                </CardContent>
                              </Card>
                              <Card className="mt-4">
                                <CardHeader>
                                  <CardTitle>Modes d'évaluation existants</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Coefficient</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(element.evaluationModes || []).map((mode) => (
                                        <TableRow key={mode.codeMode}>
                                          <TableCell>
                                            <Input
                                              value={mode.type}
                                              onChange={(e) => {
                                                const newValue = e.target.value.trim();
                                                if (newValue !== '') {
                                                  handleEvaluationModeChange(element.id, mode.codeMode, 'type', newValue);
                                                }
                                              }}
                                              onBlur={(e) => {
                                                if (e.target.value.trim() === '') {
                                                  e.target.value = mode.type; // Reset to the original value if empty
                                                }
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Input
                                              type="number"
                                              value={mode.coefficient}
                                              onChange={(e) => {
                                                const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                handleEvaluationModeChange(element.id, mode.codeMode, 'coefficient', newValue);
                                              }}
                                              min="0"
                                              max="100"
                                              step="0.1"
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Button 
                                              variant="destructive" 
                                              size="sm" 
                                              onClick={() => handleDeleteEvaluationMode(element.id, mode.codeMode)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleEditElement(element.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteElement(element.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Ajouter un nouvel élément</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nom de l'élément</Label>
                <Input
                  id="name"
                  value={newElement.name}
                  onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="professor">Professeur</Label>
                <Select onValueChange={(value) => setNewElement({ ...newElement, professorId: Number(value) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un professeur" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id.toString()}>{prof.name}</SelectItem>
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
            </div>
            <Button className="mt-4" onClick={handleAddElement}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter l'élément
            </Button>
          </CardContent>
        </Card>
      </div>
    </RootLayoutAdmin>
  )
}

