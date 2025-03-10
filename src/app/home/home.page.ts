import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipieService } from '../service/recipie.service';
import { AuthService } from '../service/auth.service';
import { Recipe } from '../recipe.model'; // Adjust the path based on your project structure

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  quotes = [
    'Make your day special',
    'Cooking is an art, and every dish tells a story!',
    'A plate full of flavors is a plate full of memories',
    'A pinch of patience, a dash of kindness, and a spoonful of laughter make every meal perfect',
    'Life is better with layers of rice, spice, and everything nice—Biryani!',
    'A great salad is a symphony of colors, textures, and taste',
  ];
  currentQuote: string = '';

  slideIndex = 0;
  // recipes = [
  //   { title: 'Beetroot Pachadi', image: 'assets/images/beetroot pachadi.png', description: 'A delicious recipe you will love!' },
  //   { title: 'Recipe 2', image: 'assets/images/olan.webp', description: 'Another tasty recipe for you to try!' },
  // ];
  recipes: any[] = []; // Fetch recipes dynamically
  userId: string | null = null;
  fullName: string = '';

  constructor(
    private router: Router,
    private recipeService: RecipieService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.displayRandomQuote();

    this.authService.getCurrentUser().subscribe((userId) => {
      console.log('User ID in Home:', userId); // ✅ Check if user ID is received

      if (userId) {
        this.authService.getUserData(userId).subscribe((userData) => {
          console.log('User Data in Home:', userData);
          this.userId = userData?.userId;
          // ✅ Check if user data is received
          this.fullName = userData?.fullName || 'User';
          console.log(this.userId, this.fullName);
          // this.loadRecipes(); // Fetch recipes on component initialization
          // this.loadUserRecipes();
          if (this.userId) {
            this.loadUserRecipes(); // Only fetch recipes when userId is available
          }
        });
      }
    });
    setInterval(() => {
      this.displayRandomQuote();
    }, 5000); // Update quote every 5 seconds
  }
  logout() {
    console.log('logout');
    this.authService.logout();
  }
  displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[randomIndex];
  }

  // loadRecipes() {
  //   this.recipeService.getRecipes().then((recipes) => {
  //     console.log('Loaded recipes:', recipes);
  //   });
  //   // this.recipeService.recipes$.subscribe((recipes) => {
  //     this.recipeService.getRecipes().subscribe((recipes) => {
  //     if (recipes && recipes.length > 0) {
  //       console.log(this.getRandomRecipes(recipes, 5));
  //       this.recipes = this.getRandomRecipes(recipes, 5); // Get 5 random recipes
  //     }
  //   });
  // }
  loadRecipes() {
    this.recipeService
      .getRecipes()
      .then((recipes) => {
        console.log('Loaded recipes:', recipes);
        this.recipes = this.getRandomRecipes(recipes, 5); // Get 5 random recipes
      })
      .catch((error) => {
        console.error('Error loading recipes:', error);
      });
  }
  loadUserRecipes() {
    console.log('Fetching recipes for user ID:', this.userId);
    if (!this.userId) return;

    this.recipeService.getUserRecipes(this.userId).subscribe(
      (recipes) => {
        console.log('Recipes received:', recipes); // ✅ Debugging output

        // this.recipes = recipes;
        // if (this.recipes.length > 5) {
        //   this.recipes = this.recipes
        //     .sort(() => Math.random() - 0.5) // Shuffle array
        //     .slice(0, 5); // Take first 5 elements
        // }
        this.recipes = this.getRandomRecipes(recipes, 5); // Get 5 random recipes
      },
      (error) => {
        console.error('Error fetching recipes:', error); // ✅ Catch errors
      }
    );
  }
  getFormattedName(): string {
    if (!this.fullName) return '';
    return this.fullName.charAt(0).toUpperCase() + this.fullName.slice(1);
  }
  
  // getGreeting(): string {
  //   const now = new Date();
  //   const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  //   const hour = istTime.getHours(); // Get hours in IST
  
  //   // console.log(`IST Hour: ${hour}`); // Debugging log
  
  //   if (hour < 12) {
  //     return 'Good Morning';
  //   } else if (hour < 17) { // Change 18 to 17 to ensure evening starts at 5 PM
  //     return 'Good Afternoon';
  //   } else {
  //     return 'Good Evening';
  //   }
  // }
  getGreeting(): string {
    const now = new Date();
    const hour = now.getHours(); // Get the current hour in the user's local time
  
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) { // 12 PM - 4:59 PM
      return 'Good Afternoon';
    } else if (hour < 21) { // 5 PM - 8:59 PM
      return 'Good Evening';
    } else { // 9 PM - 11:59 PM
      return 'Good Night';
    }
  }
  
  getFood(): string {
    const now = new Date();
    const hour = now.getHours(); // Get the current hour in the user's local time
  
    if (hour < 12) {
      return 'BreakFast';
    } else if (hour < 17) { // 12 PM - 4:59 PM
      return 'Lunch';
    } else if (hour < 21) { // 5 PM - 8:59 PM
      return 'Snacks';
    } else { // 9 PM - 11:59 PM
      return 'Dinner';
    }
  }
  
  
  

  // Refresh recipes when pull-to-refresh is triggered
  // doRefresh(event: any) {
  //   console.log('Refreshing recipes...');
  //   this.recipeService
  //     .getRecipes()
  //     .then((recipes) => {
  //       console.log('Recipes refreshed:', recipes);
  //       this.recipes = this.getRandomRecipes(recipes, 5); // Update recipes with 5 random items
  //       event.target.complete(); // Complete the refresh action
  //     })
  //     .catch((error) => {
  //       console.error('Error refreshing recipes:', error);
  //       event.target.complete(); // Complete the refresh even if there's an error
  //     });
  // }
  // getRandomRecipes(array: any[], count: number): any[] {
  //   const shuffled = [...array].sort(() => Math.random() - 0.5); // Shuffle array
  //   return shuffled.slice(0, count); // Return `count` recipes
  // }
  doRefresh(event: any) {
    console.log('Refreshing recipes...');

    if (!this.userId) {
      console.warn('No user ID found. Cannot refresh recipes.');
      event.target.complete(); // Stop refreshing
      return;
    }

    this.recipeService.getUserRecipes(this.userId).subscribe({
      next: (recipes) => {
        console.log('Recipes refreshed:', recipes);
        this.recipes = this.getRandomRecipes(recipes, 5);
        event.target.complete();
      },
      error: (error) => {
        console.error('Error refreshing recipes:', error);
        event.target.complete();
      },
    });
  }

  getRandomRecipes(array: any[], count: number): any[] {
    const shuffled = [...array].sort(() => Math.random() - 0.5); // Shuffle array
    return shuffled.slice(0, count); // Return `count` recipes
  }

  addRecipe() {
    console.log('Add Recipe button clicked!');
    this.router.navigate(['/add-recipe']);
  }
  allRecipes() {
    this.router.navigate(['/all-recipes']);
    console.log('All Recipe button clicked!');
  }

  prevSlide() {
    this.slideIndex =
      this.slideIndex > 0 ? this.slideIndex - 1 : this.recipes.length - 1;
  }

  nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % this.recipes.length;
  }

  goToFavorites() {
    console.log('clicked fav');
    sessionStorage.setItem('previousPage', this.router.url); // Store last page

    this.router.navigate(['/tabs/favorites']); // Adjust the route based on your app's routing setup
  }
  goToMySpace() {
    console.log('clicked myspace');
    sessionStorage.setItem('previousPage', this.router.url); // Store last page

    this.router.navigate(['/my-space']); // Adjust the route based on your app's routing setup
  }

  openRecipe(recipeId: string) {
    console.log('slider open');
    console.log(recipeId);
    sessionStorage.setItem('previousPage', this.router.url); // Store last page

    this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
  }

  goToMySpaceSegment(segment: string) {
    this.router.navigate(['/my-space'], { queryParams: { segment } });
  }
}
