"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NotesTable } from "./notes-table"
import { useToast } from "@/components/ui/use-toast"
import type { ElementModule, ModeEvaluation } from "@/lib/api"

export default function NotesPage() {
  const [selectedElement, setSelectedElement] = useState<ElementModule | null>(null)
  const [selectedMode, setSelectedMode] = useState<ModeEvaluation | null>(null)
  const { toast } = useToast()

  const handleSaveDraft = async () => {
    if (!selectedElement || !selectedMode) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un élément et un mode d'évaluation",
        variant: "destructive",
      })
      return
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Notes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Saisie des notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Select onValueChange={(value) => setSelectedElement(JSON.parse(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner l'élément" />
              </SelectTrigger>
              <SelectContent>
                {/* Les éléments seront chargés dynamiquement */}
              </SelectContent>
            </Select>
            
            <Select 
              onValueChange={(value) => setSelectedMode(JSON.parse(value))}
              disabled={!selectedElement}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type d'évaluation" />
              </SelectTrigger>
              <SelectContent>
                {selectedElement?.evaluationModes.map(mode => (
                  <SelectItem key={mode.codeMode} value={JSON.stringify(mode)}>
                    {mode.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedElement && selectedMode && (
            <NotesTable 
              elementId={selectedElement.codeElementModule}
              modeId={selectedMode.codeMode}
            />
          )}
          
          <div className="flex space-x-4">
            <Button onClick={handleSaveDraft}>Enregistrer en brouillon</Button>
            <Button variant="outline">Annuler</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

