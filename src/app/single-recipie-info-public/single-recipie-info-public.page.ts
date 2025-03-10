import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingListService } from '../service/shopping-list-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Location } from '@angular/common';

@Component({
  selector: 'app-single-recipie-info',
  templateUrl: './single-recipie-info-public.page.html',
  styleUrls: ['./single-recipie-info-public.page.scss'],
})
export class SingleRecipieInfoPublicPage implements OnInit {
  recipeId!: string; // Recipe ID from the route
  communityRecipes: any[] = []; // Store all community recipes
  recipe: any = null; // Store the selected recipe

  constructor(
    private route: ActivatedRoute,
    public shoppingListService: ShoppingListService,
    private router: Router,
    private firestore: AngularFirestore,
    private location: Location
  ) {}

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.recipeId) {
      console.error('Recipe ID is missing.');
      return;
    }

    console.log("Recipe ID in SingleRecipieInfoPage:", this.recipeId);

    // Fetch community recipes from Firestore
    this.firestore
      .collection('recipeCommunity')
      .valueChanges({ idField: 'id' })
      .subscribe((recipes) => {
        this.communityRecipes = recipes;
        console.log('Loaded community recipes:', this.communityRecipes);

        // Find the specific recipe by ID once data is fetched
        this.recipe = this.communityRecipes.find(r => r.id === this.recipeId);

        if (!this.recipe) {
          console.error(`Recipe not found for ID: ${this.recipeId}`);
        } else {
          console.log("Fetched Recipe:", this.recipe);
        }
      });

    // Fetch shopping list from Firebase
    this.shoppingListService.fetchFromFirebase();
  }

  goBack() {
    const previousPage = sessionStorage.getItem('previousPage');
    if (previousPage) {
      sessionStorage.removeItem('previousPage'); // Clear after use
      this.router.navigateByUrl(previousPage);
    } else {
      this.location.back();
    }
  }
  
  
  
}
