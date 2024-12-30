import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Filiere {
  id_filiere: number;
  nomFiliere: string;
}

interface AddFiliereModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (filiere: Omit<Filiere, 'id_filiere'>) => void;
}

export function AddFiliereModal({ isOpen, onClose, onAdd }: AddFiliereModalProps) {
  const [nomFiliere, setNomFiliere] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ nomFiliere })
    setNomFiliere('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle filière</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nomFiliere" className="text-right">
                Nom de la filière
              </Label>
              <Input
                id="nomFiliere"
                value={nomFiliere}
                onChange={(e) => setNomFiliere(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

