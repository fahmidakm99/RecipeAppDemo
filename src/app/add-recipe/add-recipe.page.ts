import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;

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

  ngOnInit() {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      ingredients: this.fb.array([this.createIngredient()]),
      preparation: [''],
      description: [''],
      favorites: [],
      shoppinglist: [],
      prepTime: ['', Validators.required], // Added prep time
      serves: ['', Validators.required], // Added serves
      
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
    this.clearFileInput();
  }
  reset() {
    this.recipeForm.reset(); // Reset the form fields
    this.image = null; // Clear the image preview
    this.ingredients.clear(); // Clear all ingredients
    this.addIngredient(); // Add an initial empty ingredient
    this.clearFileInput();
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
  clearFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
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
  
  compressImage(base64: string, quality: number, callback: (compressedBase64: string) => void) {
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
  // removeImage(): void {
  //   this.image = null;  // Clears the selected image
  // }
}
