import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipieService } from '../service/recipie.service';
import { Location } from '@angular/common';

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
    private router: Router,
    private location: Location
  ) {}
  ngOnInit() {
    this.recipeForm = this.fb.group({
      name: [''], // Ensure this matches the 'name' formControlName in the HTML
      description: [''],
      category: [''],
      preparation: [''],
      prepTime: ['', Validators.required], // Ensure spelling matches HTML
  serves: ['', Validators.required], // Ensure spelling matches HTML
   favorites: [false],
      ingredients: this.fb.array([]),
    });

    // Get the recipe ID from the route
    this.recipeId = this.route.snapshot.paramMap.get('id') || ''; // Ensures it's always a string

    console.log(this.recipeId);
    if (!this.recipeId) {
      console.error('No Recipe ID provided in the route');
      return; // Exit if no valid ID is found
    }
    console.log(this.recipeService.getRecipeId(this.recipeId));
    console.log('Recipe ID:', this.recipeId);
    const data = this.recipeService.getRecipeById(this.recipeId);

    if (data) {
      this.recipeForm.patchValue({
        // image: data.image,
        name: data.name,
        description: data.description,
        category: data.category,
        prepTime: data.prepTime, // Ensure preptime is set
        serves: data.serves, // Ensure serves is set
        preparation: data.preparation,
        favorites: data.favorites,
        // ingredients: data.ingredients,
      });

      this.image = data.image;
      console.log(data.image);
      console.log(data.ingredients);
      console.log(this.recipeForm.get('description')?.value); // Logs the value from the form.

      const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
      data.ingredients.forEach(
        (ingredient: { name: any; quantity: any; unit: any }) => {
          ingredientsArray.push(
            this.fb.group({
              name: [ingredient.name],
              quantity: [ingredient.quantity],
              unit: [ingredient.unit],
            })
          );
        }
      );

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
  goBack() {
    this.location.back();
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required], // Ingredient name
      quantity: ['', Validators.required], // Quantity
      unit: ['', Validators.required], // Unit
    });
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // onSubmit() {
  //   if (this.recipeForm.invalid) {
  //     console.error('Form is invalid. Please fill all required fields.');
  //     return;
  //   }

  //   // Ensure recipeId is not null
  //   const recipeId = this.recipeId || '';
  //   if (!recipeId.trim()) {
  //     console.error("Recipe ID is missing. Cannot update the recipe.");
  //     alert("Invalid Recipe ID");
  //     return;
  //   }

  //   const updatedRecipe = {
  //     id: recipeId, // Use the safe recipeId
  //     ...this.recipeForm.value, // Get the form data
  //     image: this.image, // Include the image if it exists
  //   };

  //   console.log('Submitting updated recipe:', updatedRecipe);

  //   // Call the service to update the recipe
  //   this.recipeService.updateEditRecipe(recipeId, updatedRecipe).subscribe(
  //     (response) => {
  //       console.log('Recipe updated successfully:', response);
  //       alert('Recipe updated successfully!');
  //       this.router.navigateByUrl('/recipes').then(() => {
  //         window.location.reload();
  //       });
  //     },
  //     (error) => {
  //       console.error('Error updating recipe:', error);
  //       alert(`Error updating recipe: ${error.message}`);
  //     }
  //   );
  // }
  onSubmit() {
    if (this.recipeForm.invalid) {
      console.error('Form is invalid. Please fill all required fields.');
      return;
    }

    const recipeId = this.recipeId?.trim(); // Ensure recipeId is valid
    if (!recipeId) {
      console.error('Recipe ID is missing. Cannot update the recipe.');
      alert('Invalid Recipe ID');
      return;
    }

    const updatedRecipe = {
      id: recipeId,
      ...this.recipeForm.value,
      image: this.image,
    };

    console.log('Submitting updated recipe:', updatedRecipe);

    this.recipeService
      .updateEditRecipe(recipeId, updatedRecipe)
      .then(() => {
        console.log('Recipe updated successfully!');
        alert('Recipe updated successfully!');
        this.router
          .navigateByUrl('/recipes')
          .then(() => window.location.reload());
      })
      .catch((error) => {
        console.error('Error updating recipe:', error);
        alert(`Error updating recipe: ${error.message}`);
      });
  }
  cancel() {
    // this.recipeForm.reset();
    this.router.navigate(['/home']);
  }

  // onImageChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.image = reader.result; // This will store the image as base64
  //     };
  //     reader.readAsDataURL(file); // Convert the image to base64
  //   }
  // }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.compressImage(e.target.result, 0.7, (compressedBase64: string) => {
          this.image = compressedBase64; // Store compressed base64 image
        });
      };
      reader.readAsDataURL(file);
    }
  }

  compressImage(
    base64: string,
    quality: number,
    callback: (compressedBase64: string) => void
  ) {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_WIDTH = 800; // Adjust width as needed
      const MAX_HEIGHT = 600; // Adjust height as needed

      let width = img.width;
      let height = img.height;

      // Resize if necessary
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width / height > MAX_WIDTH / MAX_HEIGHT) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to compressed base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality); // Adjust quality (0.0 - 1.0)
      callback(compressedBase64);
    };
  }

  removeImage(): void {
    this.image = null;
  }
}
