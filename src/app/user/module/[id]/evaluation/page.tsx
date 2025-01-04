"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_professeur/card"
import { Button } from "@/components/ui_professeur/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui_professeur/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui_professeur/scroll-area"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { FileCheck, Save, X } from 'lucide-react'
import RootLayout from "@/componantes/professeur/layout"

// Ces données seront récupérées depuis votre API Spring Boot
const evaluationModes = [
  {
    id: 1,
    name: "Contrôle Continu",
    coefficient: 0.3,
    students: [
      { id: 1, name: "Ahmed Alami", note: null, absent: false },
      { id: 2, name: "Sara Benani", note: null, absent: false },
      { id: 3, name: "Karim Idrissi", note: null, absent: false },
    ]
  },
  {
    id: 2,
    name: "TP",
    coefficient: 0.2,
    students: [
      { id: 1, name: "Ahmed Alami", note: null, absent: false },
      { id: 2, name: "Sara Benani", note: null, absent: false },
      { id: 3, name: "Karim Idrissi", note: null, absent: false },
    ]
  },
  {
    id: 3,
    name: "Projet",
    coefficient: 0.5,
    students: [
      { id: 1, name: "Ahmed Alami", note: null, absent: false },
      { id: 2, name: "Sara Benani", note: null, absent: false },
      { id: 3, name: "Karim Idrissi", note: null, absent: false },
    ]
  }
]

export default function EvaluationsPage({ params }: { params: { elementId: string } }) {
  const [selectedMode, setSelectedMode] = useState<any>(null)
  const [notes, setNotes] = useState<{ [key: number]: { note: number | null, absent: boolean } }>({})

  const handleNoteChange = (studentId: number, value: string) => {
    const noteValue = value === "" ? null : Number(value)
    if (noteValue !== null && (noteValue < 0 || noteValue > 20)) return

    setNotes(prev => ({
      ...prev,
      [studentId]: { note: noteValue, absent: false }
    }))
  }

  const handleAbsentToggle = (studentId: number) => {
    setNotes(prev => ({
      ...prev,
      [studentId]: { note: 0, absent: !prev[studentId]?.absent }
    }))
  }

  const validateNotes = () => {
    // Vérification des notes
    const notesArray = Object.values(notes)
    const hasZeroOrTwenty = notesArray.some(n => n.note === 0 || n.note === 20)
    
    if (hasZeroOrTwenty) {
      if (!confirm("Il y a des notes de 0 ou 20. Voulez-vous confirmer la validation ?")) {
        return
      }
    }

    // Ici vous appelleriez votre API pour sauvegarder les notes
    console.log("Notes validées:", notes)
  }

  return (
    <RootLayout> 
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Modalités d&apos;Évaluation</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {evaluationModes.map((mode) => (
          <Card key={mode.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {mode.name}
              </CardTitle>
              <FileCheck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Coefficient: </span>
                  {mode.coefficient}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => setSelectedMode(mode)}
                    >
                      Saisir les notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Saisie des notes - {mode.name}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Note (/20)</TableHead>
                            <TableHead>Absent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mode.students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  value={notes[student.id]?.note ?? ""}
                                  onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                  disabled={notes[student.id]?.absent}
                                />
                              </TableCell>
                              <TableCell>
                                <Label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={notes[student.id]?.absent || false}
                                    onChange={() => handleAbsentToggle(student.id)}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                  <span>Absent</span>
                                </Label>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setNotes({})}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={validateNotes}>
                        <Save className="h-4 w-4 mr-2" />
                        Valider
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </RootLayout>
  )
}

