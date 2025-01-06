"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import RootLayout from "@/componantes/professeur/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_professeur/card"
import { NotesTable } from "../../notes-table"
import { Button } from "@/components/ui_professeur/button"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function NotesPage() {
  const params = useParams()
  const router = useRouter()
  const [elementInfo, setElementInfo] = useState<{
    elementName: string;
    modeName: string;
  } | null>(null)

  const elementId = Number(params.elementId)
  const modeId = Number(params.modeId)

  useEffect(() => {
    // Ici vous pouvez charger les informations de l'élément et du mode
    // Pour l'instant on utilise des données statiques
    setElementInfo({
      elementName: "Nom de l'élément",
      modeName: "Type d'évaluation"
    })
  }, [elementId, modeId])

  return (
    <RootLayout>
      <div className="container space-y-6 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Saisie des notes
          </h1>
        </div>

        {elementInfo && (
          <Card>
            <CardHeader className="border-b bg-muted/40 p-4">
              <CardTitle className="text-lg font-medium">
                {elementInfo.elementName} - {elementInfo.modeName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <NotesTable elementId={elementId} modeId={modeId} />
            </CardContent>
          </Card>
        )}
      </div>
    </RootLayout>
  )
}

