"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { 
  getEtudiantsByElementModule, 
  getEvaluations,
  saveEvaluations,
  type Etudiant,
  type Evaluation,
  type EvaluationDTO 
} from "@/lib/api"

interface NotesTableProps {
  elementId: number;
  modeId: number;
}

export function NotesTable({ elementId, modeId }: NotesTableProps) {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([])
  const [notes, setNotes] = useState<{ [key: number]: number }>({})
  const [absents, setAbsents] = useState<{ [key: number]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudiantsData, evaluationsData] = await Promise.all([
          getEtudiantsByElementModule(elementId),
          getEvaluations(elementId, modeId)
        ])
        
        setEtudiants(etudiantsData)
        
        // Initialize notes and absents from existing evaluations
        const notesMap: { [key: number]: number } = {}
        const absentsMap: { [key: number]: boolean } = {}
        
        evaluationsData.forEach(evaluation => {
          notesMap[evaluation.etudiant.codeEtudiant] = evaluation.note
          absentsMap[evaluation.etudiant.codeEtudiant] = evaluation.absance
        })
        
        setNotes(notesMap)
        setAbsents(absentsMap)
      } catch (err) {
        setError("Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [elementId, modeId])

  const handleNoteChange = (id: number, value: string) => {
    const note = parseFloat(value)
    if (isNaN(note) || note < 0 || note > 20) return
    
    if (note === 0 || note === 20) {
      if (!confirm(`Êtes-vous sûr de vouloir attribuer la note ${note} ?`)) {
        return
      }
    }
    
    setNotes(prev => ({ ...prev, [id]: note }))
    setAbsents(prev => ({ ...prev, [id]: false }))
  }

  const handleAbsentChange = (id: number, checked: boolean) => {
    setAbsents(prev => ({ ...prev, [id]: checked }))
    if (checked) {
      setNotes(prev => ({ ...prev, [id]: 0 }))
    }
  }

  const handleSave = async () => {
    // Vérifier que toutes les notes sont saisies
    const missingNotes = etudiants.some(etudiant => 
      notes[etudiant.codeEtudiant] === undefined && !absents[etudiant.codeEtudiant]
    )
    
    if (missingNotes) {
      toast({
        title: "Erreur",
        description: "Toutes les notes doivent être saisies",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      const evaluations: EvaluationDTO[] = etudiants.map(etudiant => ({
        etudiantId: etudiant.codeEtudiant,
        elementModuleId: elementId,
        modeEvaluationId: modeId,
        note: notes[etudiant.codeEtudiant] || 0,
        absent: absents[etudiant.codeEtudiant] || false,
      }))
      
      await saveEvaluations(evaluations)
      
      toast({
        title: "Succès",
        description: "Les notes ont été enregistrées",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement des notes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Chargement des étudiants...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CNE</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Absent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {etudiants.map((etudiant) => (
            <TableRow key={etudiant.codeEtudiant}>
              <TableCell>{etudiant.cne}</TableCell>
              <TableCell>{etudiant.nom}</TableCell>
              <TableCell>{etudiant.prenom}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.25}
                  value={notes[etudiant.codeEtudiant] || ""}
                  onChange={(e) => handleNoteChange(etudiant.codeEtudiant, e.target.value)}
                  disabled={absents[etudiant.codeEtudiant]}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={absents[etudiant.codeEtudiant]}
                  onCheckedChange={(checked) => 
                    handleAbsentChange(etudiant.codeEtudiant, checked as boolean)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement..." : "Enregistrer les notes"}
      </Button>
    </div>
  )
}

