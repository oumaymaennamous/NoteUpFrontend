import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_professeur/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RootLayout from "@/componantes/professeur/layout"

export default function ArchivePage() {
  return (
    <RootLayout> 
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Archive des Éléments de Module</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="search">Rechercher</Label>
          <Input id="search" placeholder="Rechercher un module..." />
        </div>
        <div>
          <Label>Année Universitaire</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023-2024</SelectItem>
              <SelectItem value="2022">2022-2023</SelectItem>
              <SelectItem value="2021">2021-2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Semestre</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="s1">S1</SelectItem>
              <SelectItem value="s2">S2</SelectItem>
              <SelectItem value="s3">S3</SelectItem>
              <SelectItem value="s4">S4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des Modules</CardTitle>
          <CardDescription>
            Liste des modules et éléments de modules des années précédentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Élément</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Programmation Web</TableCell>
                <TableCell>Java EE</TableCell>
                <TableCell>2022-2023</TableCell>
                <TableCell>S3</TableCell>
                <TableCell>14.5</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    Validé
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Base de données</TableCell>
                <TableCell>SQL</TableCell>
                <TableCell>2022-2023</TableCell>
                <TableCell>S3</TableCell>
                <TableCell>15.75</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                    Validé
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </RootLayout>
  )
}

