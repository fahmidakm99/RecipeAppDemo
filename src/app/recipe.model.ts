// Ingredient model
export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
  }
  
  // Recipe model
  export interface Recipe {
    id: string;
    name: string;
    category: string;
    ingredients: Ingredient[];
    preparation: string;
    description: string;
    imageUrl?: string; // Optional property for recipe image
    favorites: boolean;
    shoppinglist: boolean; 
  }
  