"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/buttonP"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Percent } from 'lucide-react'
import RootLayoutProfessuer from "@/componantes/professeur/layout"

// Exemple de données pour les modes d'évaluation
const evaluationModes = [
  { id: 1, name: "Examen Final", percentage: 60 },
  { id: 2, name: "Contrôle Continu", percentage: 30 },
  { id: 3, name: "TP", percentage: 10 },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ModesEvaluation({ params }: { params: { id: string } }) {
  return (
    <RootLayoutProfessuer> 
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-8"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Modes d'évaluation - Module {params.id}
        </motion.h1>
        <Link href="/gestion-modules">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </Link>
      </div>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {evaluationModes.map((mode) => (
          <motion.div key={mode.id} variants={item}>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-600/10">
                <CardTitle className="flex items-center justify-between">
                  <span>{mode.name}</span>
                  <span className="text-2xl font-bold flex items-center">
                    {mode.percentage}
                    <Percent className="h-5 w-5 ml-1" />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Link href={`/gestion-modules/${params.id}/evaluation/${mode.id}`}>
                  <Button className="w-full">Saisir les notes</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
    </RootLayoutProfessuer>
  )
}

