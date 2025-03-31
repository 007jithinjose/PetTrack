//File: src/services/interfaces/pet.interface.ts
export interface Pet {
    _id: string;
    name: string;
    type: 'dog' | 'cat' | 'bird' | 'other';
    breed: string;
    age: number;
    weight: number;
    owner: string;
    vaccinations?: string[];
    medicalRecords?: string[];
  }
  
  export interface PetInput {
    name: string;
    type: 'dog' | 'cat' | 'bird' | 'other';
    breed: string;
    age: number;
    weight: number;
    vaccinations?: string[];
    medicalRecords?: string[];
  }