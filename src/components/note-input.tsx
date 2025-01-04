import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface NoteInputProps {
  studentId: number
  note: string
  isAbsent: boolean
  onChange: (studentId: number, note: string, isAbsent: boolean) => void
}

export function NoteInput({ studentId, note, isAbsent, onChange }: NoteInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        min="0"
        max="20"
        value={note}
        onChange={(e) => onChange(studentId, e.target.value, isAbsent)}
        disabled={isAbsent}
        className="w-20"
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`absent-${studentId}`}
          checked={isAbsent}
          onCheckedChange={(checked) => onChange(studentId, isAbsent ? '' : '0', checked as boolean)}
        />
        <Label htmlFor={`absent-${studentId}`}>Absent</Label>
      </div>
    </div>
  )
}

