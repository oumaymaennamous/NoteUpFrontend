'use client'
import axiosInstance from '@/app/utils/axiosInstanceAdmin';
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AddFiliereModal } from '@/components/AddFiliereModal'
import { EditFiliereModal } from '@/components/EditFiliereModal'
import RootLayoutAdmin from '@/componantes/admin/layout'

interface Filiere {
  codeFiliere: number;
  nomFiliere: string;
}

export default function FilieresPage() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFiliere, setCurrentFiliere] = useState<Filiere | null>(null);

  useEffect(() => {
    // Charger les filières depuis le backend
    axiosInstance.get('/filiere')
      .then(response => setFilieres(response.data))
      .catch(error => console.error('Erreur lors du chargement des filières :', error));
  }, []);

  const handleAddFiliere = (newFiliere: Omit<Filiere, 'codeFiliere'>) => {
    axiosInstance.post('/filiere', newFiliere)
      .then(response => setFilieres([...filieres, response.data]))
      .catch(error => console.error('Erreur lors de l\'ajout d\'une filière :', error));
    setIsAddModalOpen(false);
  };

  const handleEditFiliere = (id: number, updatedFiliere: { nomFiliere: string }) => {
    axiosInstance.put(`/filiere/${id}`, updatedFiliere)
      .then(response => {
        setFilieres(filieres.map(filiere => 
          filiere.codeFiliere === id ? response.data : filiere
        ));
      })
      .catch(error => console.error('Erreur lors de la modification de la filière :', error));
    setIsEditModalOpen(false);
  };

  const handleDeleteFiliere = async (id: number) => {
    try {
      await axiosInstance.delete(`/filiere/${id}`);
      setFilieres(filieres.filter(filiere => filiere.codeFiliere !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la filière :', error);
      alert('Échec de la suppression : vérifiez que la filière existe');
    }
  };

  // Filtrer les filières en fonction du terme de recherche
  const filteredFilieres = filieres.filter(filiere =>
    filiere.nomFiliere.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RootLayoutAdmin>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Filières</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une filière
          </Button>
        </div>

        <Input
          className="mb-4"
          placeholder="Rechercher une filière..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom de la Filière</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFilieres.map((filiere) => (
              <TableRow key={filiere.codeFiliere}>
                <TableCell>{filiere.codeFiliere}</TableCell>
                <TableCell>{filiere.nomFiliere}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setCurrentFiliere(filiere);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleDeleteFiliere(filiere.codeFiliere)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddFiliereModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddFiliere}  
        />
        
        <EditFiliereModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditFiliere}
          filiere={currentFiliere}
        />
      </div>
    </RootLayoutAdmin>
  );
}

