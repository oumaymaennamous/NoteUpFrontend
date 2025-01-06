const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ElementModule {
  codeElementModule: number;
  nameElementModule: string;
  coefficient: number;
  active: boolean;
  moduleName: string;
  codeModule: number;
  evaluationModes: ModeEvaluation[];
}

export interface ModeEvaluation {
  codeMode: number;
  type: string;
  coefficient: number;
}

export interface Etudiant {
  codeEtudiant: number;
  nom: string;
  prenom: string;
  cne: string;
  cin: string;
}

export interface Evaluation {
  id_evalution?: number;
  note: number;
  absance: boolean;
  codeEtudiant: number;
  codeElementModule: number;
  codeMode: number;
   
}

export interface EvaluationDTO {
  etudiantId: number;
  elementModuleId: number;
  modeEvaluationId: number;
  note: number;
  absent: boolean;
}

export async function getElementsByProfesseurCin(cin: string): Promise<ElementModule[]> {
  const response = await fetch(`${API_URL}/professeur/elements/${cin}`);
  if (!response.ok) throw new Error('Failed to fetch elements');
  return response.json();
}

export async function getEtudiantsByElementModule(elementId: number): Promise<Etudiant[]> {
  const response = await fetch(`${API_URL}/professeur/element/${elementId}/etudiants`);
  if (!response.ok) throw new Error('Failed to fetch students');
  return response.json();
}

export async function getModesEvaluation(elementId: number): Promise<ModeEvaluation[]> {
  const response = await fetch(`${API_URL}/professeur/element/${elementId}/modes-evaluation`);
  if (!response.ok) throw new Error('Failed to fetch evaluation modes');
  return response.json();
}

export async function saveEvaluations(evaluations: EvaluationDTO[]): Promise<void> {
  const response = await fetch(`${API_URL}/professeur/evaluations/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evaluations),
  });
  if (!response.ok) throw new Error('Failed to save evaluations');
}

export async function getEvaluations(elementId: number, modeId: number): Promise<Evaluation[]> {
  const response = await fetch(`${API_URL}/professeur/evaluations/${elementId}/${modeId}`);
  if (!response.ok) throw new Error('Failed to fetch evaluations');
  return response.json();
}

