export interface Module {
    codeModule: number;
    nameModule: string;
    filiereName: string;
    semestreName: string;
    annee: string;
  }

  export interface ElementModule {
    id: number;
    name: string;
    professorId: number;
    professorName: string;
    coefficient: number;
    evaluationModes: ModeEvaluation[];
  }
  
  export interface ModeEvaluation {
    codeMode: number;
    type: string;
    coefficient: number;
  }
  
  export interface Professor {
    id: number;
    name: string;
  }
  
  export interface NewElementModule {
    name: string;
    professorId: number;
    coefficient: number;
  }
  
  