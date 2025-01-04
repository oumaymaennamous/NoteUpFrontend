"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui_professeur/card"
import { Button } from "@/components/ui_professeur/button"
import { BookOpen } from 'lucide-react'
import Link from "next/link"
import RootLayout from "@/componantes/professeur/layout"

// Ces données seront récupérées depuis votre API Spring Boot
const moduleElements = [
  {
    id: 1,
    moduleName: "Programmation Web Java",
    elementName: "Java EE",
    semester: "S3",
    year: "2023-2024",
  },
  {
    id: 2,
    moduleName: "Programmation Web Java",
    elementName: "Spring Framework",
    semester: "S3",
    year: "2023-2024",
  },
  {
    id: 3,
    moduleName: "Base de données",
    elementName: "SQL Avancé",
    semester: "S3",
    year: "2023-2024",
  }
]

export default function ModulesPage() {
  return (
    <RootLayout> 
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mes Éléments de Module</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {moduleElements.map((element) => (
          <Card key={element.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {element.elementName}
              </CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Module: </span>
                  {element.moduleName}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Semestre: </span>
                  {element.semester}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Année: </span>
                  {element.year}
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href={`/user/module/${element.id}/evaluation`}>
                    Gérer les évaluations
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </RootLayout>
  )
}

