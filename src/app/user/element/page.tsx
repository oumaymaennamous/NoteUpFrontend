"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import RootLayout from "@/componantes/professeur/layout"
import { BookOpen, PenTool, Presentation, FlaskConical } from 'lucide-react'

function getEvaluationIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'cc':
      return <PenTool className="h-4 w-4" />
    case 'tp':
      return <FlaskConical className="h-4 w-4" />
    case 'projet':
      return <Presentation className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

export default function ElementsPage() {
  const router = useRouter()
  const [elements, setElements] = useState<ElementModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchElements = async () => {
      try {
        setLoading(true)
        const data = await getElementsByProfesseurCin("IC53636")
        setElements(data || [])
      } catch (err) {
        console.error('Error fetching elements:', err)
        setError("Erreur lors du chargement des éléments")
        setElements([])
      } finally {
        setLoading(false)
      }
    }

    fetchElements()
  }, [])

  const handleEvaluationClick = (elementId: number, modeId: number) => {
    router.push(`/user/notes/${elementId}/${modeId}`)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-lg text-muted-foreground">
            Chargement des éléments...
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-lg text-destructive">{error}</div>
        </div>
      )
    }

    return (
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/40 p-4">
          <CardTitle className="text-lg font-medium">Liste des éléments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {elements.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Aucun élément trouvé
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-medium">Élément</TableHead>
                  <TableHead className="font-medium">Module</TableHead>
                  <TableHead className="font-medium">Coefficient</TableHead>
                  <TableHead className="font-medium">Modalités d'évaluation</TableHead>
                  <TableHead className="font-medium">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elements.map((element) => (
                  <TableRow 
                    key={element.codeElementModule}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {element.nameElementModule}
                    </TableCell>
                    <TableCell>{element.moduleName}</TableCell>
                    <TableCell>{element.coefficient}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        {element.evaluationModes?.map((mode) => (
                          <button
                            key={mode.codeMode}
                            onClick={() => handleEvaluationClick(element.codeElementModule, mode.codeMode)}
                            className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 hover:bg-muted/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            {getEvaluationIcon(mode.type)}
                            <span className="text-sm">{mode.type}</span>
                          </button>
                        )) || (
                          <span className="text-sm text-muted-foreground">
                            Aucune modalité
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          element.active 
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {element.active ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <RootLayout>
      <div className="container space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mes Éléments</h1>
        </div>
        {renderContent()}
      </div>
    </RootLayout>
  )
}

