"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_professeur/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getElementsByProfesseurCin } from "@/lib/api"
import type { ElementModule } from "@/lib/api"

export default function ElementsPage() {
  const [elements, setElements] = useState<ElementModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchElements = async () => {
      try {
        // Remplacer avec le vrai CIN du professeur connecté
        const data = await getElementsByProfesseurCin("CIN123")
        setElements(data)
      } catch (err) {
        setError("Erreur lors du chargement des éléments")
      } finally {
        setLoading(false)
      }
    }

    fetchElements()
  }, [])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mes Éléments</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des éléments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élément</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Modalités d'évaluation</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elements.map((element) => (
                <TableRow key={element.codeElementModule}>
                  <TableCell>{element.nameElementModule}</TableCell>
                  <TableCell>{element.module.nameModule}</TableCell>
                  <TableCell>{element.coefficient}</TableCell>
                  <TableCell>
                    {element.modeEvaluations.map((mode) => (
                      <div key={mode.codeMode}>
                        {mode.type}: {mode.coefficient * 100}%
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span className={element.active ? "text-green-500" : "text-red-500"}>
                      {element.active ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

