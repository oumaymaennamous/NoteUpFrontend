import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Module } from '@/types/Module'

interface Filiere {
  codeFiliere: number;
  nomFiliere: string;
}

interface AddModuleModalProps {
  filieres: Filiere[]
  semestres: string[]
  annees: string[]
  onAddModule: (module: Omit<Module, 'codeModule'>) => void
}

export function AddModuleModal({ filieres, semestres, annees, onAddModule }: AddModuleModalProps) {
  const [nameModule, setNameModule] = useState('')
  const [filiereName, setFiliereName] = useState('')
  const [semestreName, setSemestreName] = useState('')
  const [annee, setAnnee] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddModule({ nameModule, filiereName, semestreName, annee })
    setNameModule('')
    setFiliereName('')
    setSemestreName('')
    setAnnee('')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ajouter un module</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau module</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameModule">Nom du module</Label>
            <Input id="nameModule" value={nameModule} onChange={(e) => setNameModule(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filiereName">Filière</Label>
            <Select onValueChange={setFiliereName} required>
              <SelectTrigger id="filiereName">
                <SelectValue placeholder="Sélectionner une filière" />
              </SelectTrigger>
              <SelectContent>
                {filieres.map((f) => (
                  <SelectItem key={f.codeFiliere} value={f.nomFiliere}>{f.nomFiliere}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="semestreName">Semestre</Label>
            <Select onValueChange={setSemestreName} required>
              <SelectTrigger id="semestreName">
                <SelectValue placeholder="Sélectionner un semestre" />
              </SelectTrigger>
              <SelectContent>
                {semestres.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annee">Année</Label>
            <Select onValueChange={setAnnee} required>
              <SelectTrigger id="annee">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {annees.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Ajouter</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

