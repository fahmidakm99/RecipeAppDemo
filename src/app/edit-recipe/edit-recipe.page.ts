import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipieService } from '../recipie.service';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.page.html',
  styleUrls: ['./edit-recipe.page.scss'],
})
export class EditRecipePage implements OnInit {
  recipeForm!: FormGroup;
  image: string | ArrayBuffer | null = null;
  recipeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private recipeService: RecipieService,
    private router: Router
  ) {}
  ngOnInit() {
    this.recipeForm = this.fb.group({
      name: [''], // Ensure this matches the 'name' formControlName in the HTML
      description: [''],
      category: [''],
      preparation: [''],
      favorites: [false],
      ingredients: this.fb.array([]),
    });
    
    // Get the recipe ID from the route
    this.recipeId = this.route.snapshot.paramMap.get('id');
    console.log(this.recipeId);
    if (!this.recipeId) {
      console.error('No Recipe ID provided in the route');
      return; // Exit if no valid ID is found
    }
  console.log( this.recipeService.getRecipeId(this.recipeId));
  console.log('Recipe ID:', this.recipeId);
  const data= this.recipeService.getRecipeById(this.recipeId);

  if(data){
      this.recipeForm.patchValue({
      // image: data.image,
      name: data.name,
      description: data.description,
      category: data.category,
      preparation: data.preparation,
      favorites: data.favorites,
      // ingredients: data.ingredients,
    });
  
    this.image= data.image;
    console.log(data.image);
    console.log(data.ingredients);
    console.log(this.recipeForm.get('description')?.value); // Logs the value from the form.

    const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
    data.ingredients.forEach((ingredient: { name: any; quantity: any; unit: any; }) => {
      ingredientsArray.push(this.fb.group({
        name: [ingredient.name],
        quantity: [ingredient.quantity],
        unit: [ingredient.unit]
      }));
    });

    // Log ingredients
    console.log('Ingredients:', data.ingredients);

    // You can log description or other values from the form like this:
    console.log(this.recipeForm.get('description')?.value);
    
    // Access individual ingredient details
    ingredientsArray.controls.forEach((ingredientGroup, index) => {
      const name = ingredientGroup.get('name')?.value;
      const quantity = ingredientGroup.get('quantity')?.value;
      const unit = ingredientGroup.get('unit')?.value;

      console.log(`Ingredient ${index + 1}:`);
      console.log(`Name: ${name}`);
      console.log(`Quantity: ${quantity}`);
      console.log(`Unit: ${unit}`);
    });
  }
}
  
  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Ingredient name
      quantity: ['', Validators.required], // Quantity
      unit: ['', Validators.required], // Unit
    });
  }

  get ingredients() {
    return (this.recipeForm.get('ingredients') as FormArray);
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
  onSubmit() {
    if (this.recipeForm.invalid) {
      console.error('Form is invalid. Please fill all required fields.');
      return;
    }
  
    const updatedRecipe = {
      id: this.recipeId, // Ensure the recipe ID is included
      ...this.recipeForm.value, // Get the form data
      image: this.image, // Include the image if it exists
    };
  
    console.log('Submitting updated recipe:', updatedRecipe);
  
    // Call the service to update the recipe
    this.recipeService.updateEditRecipe(this.recipeId, updatedRecipe).subscribe(
      (response) => {
        console.log('Recipe updated successfully:', response);
        alert('Recipe updated successfully!');
        // this.router.navigate(['/recipes']); // Navigate back to the recipe list or desired route
        // Reload the page and navigate to the home page
      this.router.navigateByUrl('/recipes').then(() => {
        window.location.reload();
      });
      },
      (error) => {
        console.error('Error updating recipe:', error);
        alert(`Error updating recipe: ${error.message}`);
      }
    );
  }
  
  
  
  cancel() {
      // this.recipeForm.reset();
    this.router.navigate(['/home']);
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;  // This will store the image as base64
      };
      reader.readAsDataURL(file);  // Convert the image to base64
    }
  }
 removeImage(): void {
    this.image = null;  // Clear the stored image
  }

}
