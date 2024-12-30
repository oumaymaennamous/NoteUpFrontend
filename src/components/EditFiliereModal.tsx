import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface EditFiliereModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number, updatedFiliere: { nomFiliere: string }) => void;
  filiere: { codeFiliere: number; nomFiliere: string } | null;
}

export function EditFiliereModal({ isOpen, onClose, onEdit, filiere }: EditFiliereModalProps) {
  const [nomFiliere, setNomFiliere] = useState('');

  useEffect(() => {
    if (filiere) {
      setNomFiliere(filiere.nomFiliere);
    }
  }, [filiere]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filiere) {
      onEdit(filiere.codeFiliere, { nomFiliere });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la filière</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nomFiliere" className="text-right">
                Nom
              </label>
              <Input
                id="nomFiliere"
                value={nomFiliere}
                onChange={(e) => setNomFiliere(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Sauvegarder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

