import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddEtudiantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (etudiant: Omit<EtudiantDtoReponse, 'annees'>) => void;
  filieres: Filiere[];
  promos: Promo[];
  fetchSemestres: (promoId: string) => Promise<Semestre[]>;
}

interface EtudiantDtoReponse {
  nom: string;
  prenom: string;
  cin: string;
  cne: string;
  filiere: string;
  semestre: string;
  annees: string;
}

interface Filiere {
  id: number;
  nom: string;
}

interface Promo {
  id: number;
  annee: string;
}

interface Semestre {
  id: number;
  nom: string;
}

export function AddEtudiantModal({ isOpen, onClose, onAdd, filieres, promos, fetchSemestres }: AddEtudiantModalProps) {
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [cin, setCin] = useState('')
  const [cne, setCne] = useState('')
  const [filiere, setFiliere] = useState('')
  const [promo, setPromo] = useState('')
  const [semestre, setSemestre] = useState('')
  const [semestres, setSemestres] = useState<Semestre[]>([])

  useEffect(() => {
    if (promo) {
      fetchSemestres(promo).then((fetchedSemestres) => {
        setSemestres(fetchedSemestres);
      });
    }
  }, [promo, fetchSemestres]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({ nom, prenom, cin, cne, filiere, semestre })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel étudiant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nom" className="text-right">Nom</label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="prenom" className="text-right">Prénom</label>
              <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="cin" className="text-right">CIN</label>
              <Input id="cin" value={cin} onChange={(e) => setCin(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="cne" className="text-right">CNE</label>
              <Input id="cne" value={cne} onChange={(e) => setCne(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="filiere" className="text-right">Filière</label>
              <Select onValueChange={setFiliere}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((f) => (
                    <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="promo" className="text-right">Promotion</label>
              <Select onValueChange={setPromo}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promos.map((p) => (
                    <SelectItem key={p.id} value={p.annee}>{p.annee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="semestre" className="text-right">Semestre</label>
              <Select onValueChange={setSemestre}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres.map((s) => (
                    <SelectItem key={s.id} value={s.nom}>{s.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

