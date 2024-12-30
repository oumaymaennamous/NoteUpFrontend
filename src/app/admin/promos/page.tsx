'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import RootLayoutAdmin from '@/componantes/admin/layout'
import axios from 'axios'

interface Promo {
  idPromo: number;
  namePromo: string;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPromoName, setNewPromoName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/admin/promos');
      console.log('Server response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setPromos(response.data);
      } else if (response.data && typeof response.data === 'object' && 'promos' in response.data && Array.isArray(response.data.promos)) {
        setPromos(response.data.promos);
      } else {
        throw new Error('Invalid data format received from the server');
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
      setError('Failed to fetch promos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/admin/promos', { namePromo: newPromoName });
      console.log('Add promo response:', response.data);
      setIsModalOpen(false);
      setNewPromoName('');
      fetchPromos();
    } catch (error) {
      console.error('Error adding promo:', error);
      setError('Failed to add promo. Please try again.');
    }
  };

  const handleDeletePromo = async (idPromo: number) => {
    try {
      await axios.delete(`http://localhost:8080/admin/promos/${idPromo}`);
      console.log('Promo deleted successfully');
      fetchPromos(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting promo:', error);
      setError('Failed to delete promo. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <RootLayoutAdmin>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Promos</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une promo
          </Button>
        </div>

        {promos.length === 0 ? (
          <p className="text-center text-gray-500">Aucune promo trouvée.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom de la Promo</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo) => (
                <TableRow key={promo.idPromo}>
                  <TableCell>{promo.idPromo}</TableCell>
                  <TableCell>{promo.namePromo}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePromo(promo.idPromo)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle promo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPromo}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Nom
                  </label>
                  <Input
                    id="name"
                    value={newPromoName}
                    onChange={(e) => setNewPromoName(e.target.value)}
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
      </div>
    </RootLayoutAdmin>
  );
}

