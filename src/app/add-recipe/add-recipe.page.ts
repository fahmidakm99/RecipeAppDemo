import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipieService } from '../service/recipie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.page.html',
  styleUrls: ['./add-recipe.page.scss'],
})
export class AddRecipePage implements OnInit {
  recipeForm!: FormGroup;
  image: string | ArrayBuffer | null = null;
  recipeId: string | null = null;
  userId!: string; // Store userId

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipieService,
    private route: ActivatedRoute,
    private router: Router,
    private afAuth: AngularFireAuth // Inject Firebase Auth
  ) {}

  // ngOnInit() {
  //   this.recipeForm = this.fb.group({
  //     name: ['', Validators.required], // Recipe name
  //     category: ['', Validators.required],
  //     ingredients: this.fb.array([this.createIngredient()]), // Ingredients as FormArray
  //     preparation: [''],
  //     description: [''], // No Validators.required, so it's optional
  //     favorites: [], // Boolean field for favourites
  //     shoppinglist: [], // Boolean field for shopping list
  //   });
  //   this.recipeService.getRecipes().then(recipes => {
  //     console.log('Loaded recipes:', recipes);
  //   });
  // }
  ngOnInit() {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      preparation: [''],
      description: [''],
      favorites: [],
      shoppinglist: [],
    });

    // Get logged-in user ID
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // Assign user ID
      } else {
        console.error('User not logged in');
      }
    });
  }

  async onSubmit() {
    if (this.recipeForm.valid) {
      const user = await this.recipeService.getCurrentUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const recipeData = {
        ...this.recipeForm.value,
        image: this.image, // ✅ Store only the image URL
        userId: user.uid,
      };

      if (this.recipeId) {
        this.recipeService
          .updateRecipe(this.recipeId, recipeData)
          .then(() => {
            console.log('Recipe updated successfully');
            this.router.navigate(['/tabs/home']);
          })
          .catch((err) => console.error('Failed to update recipe:', err));
      } else {
        this.recipeService
          .addRecipe(recipeData)
          .then(() => {
            console.log('Recipe added successfully');
            this.recipeForm.reset();
            this.image = null;
          })
          .catch((err) => console.error('Failed to add recipe:', err));
      }
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
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // onSubmit() {
  //   if (this.recipeForm.valid) {
  //     const recipeData = {
  //       ...this.recipeForm.value,
  //       image: this.image,
  //     };

  //     if (this.recipeId) {
  //       this.recipeService.updateRecipe(this.recipeId, recipeData).then(() => {
  //         console.log('Recipe updated successfully');
  //         this.router.navigate(['/add-recipe']); // Navigate back to all recipes
  //       }).catch(err => {
  //         console.error('Failed to update recipe:', err);
  //       });
  //     } else {
  //       this.recipeService.addRecipe(recipeData).then(() => {
  //         console.log('Recipe added successfully');
  //         this.recipeForm.reset(); // Reset the form
  //         this.image = null; // Clear the image preview
  //       }).catch(err => {
  //         console.error('Failed to add recipe:', err);
  //       });
  //     }
  //   }
  // }

  cancel() {
    this.recipeForm.reset(); // Clear the form and image
    this.image = null; // Clear the image preview
    this.ingredients.clear(); // Clear all ingredients
    this.addIngredient(); // Add an initial empty ingredient
    this.router.navigate(['/tabs/home']);
  }
  reset() {
    this.recipeForm.reset(); // Reset the form fields
    this.image = null; // Clear the image preview
    this.ingredients.clear(); // Clear all ingredients
    this.addIngredient(); // Add an initial empty ingredient
  }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result; // This will store the image as base64
      };
      reader.readAsDataURL(file); // Convert the image to base64
    }
  }
  // removeImage(): void {
  //   this.image = null;  // Clears the selected image
  // }
}
