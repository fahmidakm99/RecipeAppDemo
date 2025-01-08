import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipieService } from '../recipie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  quotes = [
    "Make your day special",
    "Cooking is an art, and every dish tells a story!",
    "A plate full of flavors is a plate full of memories",
    "A pinch of patience, a dash of kindness, and a spoonful of laughter make every meal perfect",
    "Life is better with layers of rice, spice, and everything nice—Biryani!",
    "A great salad is a symphony of colors, textures, and taste",
  ];
  currentQuote: string = '';
  
  slideIndex = 0;
  // recipes = [
  //   { title: 'Beetroot Pachadi', image: 'assets/images/beetroot pachadi.png', description: 'A delicious recipe you will love!' },
  //   { title: 'Recipe 2', image: 'assets/images/olan.webp', description: 'Another tasty recipe for you to try!' },
  // ];
  recipes: any[] = []; // Fetch recipes dynamically

  constructor(
    private router: Router,
    private recipeService: RecipieService
  ) {}

  ngOnInit() {
    this.displayRandomQuote();
    setInterval(() => {
      this.displayRandomQuote();
    }, 5000); // Update quote every 5 seconds
    this.loadRecipes(); // Fetch recipes on component initialization
  }

  displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[randomIndex];
  }
  // loadRecipes() {
  //   this.recipeService.recipes$.subscribe((recipes) => {
  //     this.recipes = recipes; // Dynamically update recipes
  //   });
  // }
  loadRecipes() {
    this.recipeService.getRecipes().then(recipes => {
      console.log('Loaded recipes:', recipes);
    });
    this.recipeService.recipes$.subscribe((recipes) => {
      if (recipes && recipes.length > 0) {
        console.log(this.getRandomRecipes(recipes, 5));
        this.recipes = this.getRandomRecipes(recipes, 5); // Get 5 random recipes
      }
    });
    
  }

   // Refresh recipes when pull-to-refresh is triggered
 doRefresh(event: any) {
  console.log('Refreshing recipes...');
  this.recipeService.getRecipes().then((recipes) => {
    console.log('Recipes refreshed:', recipes);
    this.recipes = this.getRandomRecipes(recipes, 5); // Update recipes with 5 random items
    event.target.complete(); // Complete the refresh action
  }).catch((error) => {
    console.error('Error refreshing recipes:', error);
    event.target.complete(); // Complete the refresh even if there's an error
  });
}
  
  getRandomRecipes(array: any[], count: number): any[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5); // Shuffle array
    return shuffled.slice(0, count); // Return `count` recipes
  }

  addRecipe() {
    console.log('Add Recipe button clicked!');
    this.router.navigate(['/add-recipe']);
    // Navigate to another page or perform your desired action
  }
  allRecipes(){
    this.router.navigate(['/all-recipes']);
    console.log('All Recipe button clicked!');
  
  }

  
  prevSlide() {
    this.slideIndex = (this.slideIndex > 0) ? this.slideIndex - 1 : this.recipes.length - 1;
  }
  
  nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % this.recipes.length;
  }
  
  goToFavorites() {
    console.log("clicked fav")
    this.router.navigate(['/favorites']); // Adjust the route based on your app's routing setup
  }
  openRecipe(recipeId: string) {
    console.log("slider open");
    this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
  }

}
