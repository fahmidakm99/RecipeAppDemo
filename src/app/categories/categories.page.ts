import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipieService } from '../service/recipie.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss']
})
export class CategoriesPage {
  // categorizedRecipes: { [category: string]: any[] } = {};
  categorizedRecipes: { [category: string]: { name: string; [key: string]: any }[] } = {};
  namesByCategory: { [key: string]: string[] } = {};
  imagesByCategory: { [key: string]: string[] } = {}; 
  idsByCategory: { [key: string]: string[] } = {}; 
  userId: string | null = null;

  categories = [
    { name: 'Breakfast', img: 'assets/images/breakfast.jpeg'},
    { name: 'Lunch', img: 'assets/images/Lunch.jpeg'},
    { name: 'Snacks', img: 'assets/images/snacks.jpeg'},
    { name: 'Dinner', img: 'assets/images/Dinner.jpeg'},
    { name: 'Bread', img: 'assets/images/Bread.jpeg'},
    { name: 'Curries', img: 'assets/images/curries.jpeg' },
    { name: 'Sadhya', img: 'assets/images/sadhya.jpeg'},
    { name: 'Healthy', img: 'assets/images/health.jpeg'},
    { name: 'Rice', img: 'assets/images/rice.jpeg' },
    { name: 'Spicy', img: 'assets/images/spicy.jpeg'},
    { name: 'Sweets', img: 'assets/images/sweet .jpeg' },
    { name: 'Drinks', img: 'assets/images/Drinks.jpeg'},
    { name: 'Pickles', img: 'assets/images/Pickles.jpeg'},
    { name: '5min Recipie', img: 'assets/images/5min.jpeg'},
  ];

  constructor(private router: Router,
    private recipeService: RecipieService,
    private authService: AuthService
  ) {}

  onCategoryClick(category: string) {
    const categoryRecipes = this.namesByCategory[category] || [];
    const categoryImage = this.imagesByCategory[category] || [];
    const categoryId = this.idsByCategory[category]|| [];

    console.log('Category Recipes:', categoryRecipes);
    console.log('Category Images:', categoryImage);
    console.log('Category Ids: ', categoryId);
  
    this.router.navigate(['/category-details', category], {
      state: { recipes: categoryRecipes , images: categoryImage, ids: categoryId},
    });
  }
  
  // ngOnInit() {
  //   this.loadCategorizedRecipes();
  //   console.log(this.loadCategorizedRecipes());
  // }
  ngOnInit() {
    // Fetch the logged-in user ID
    this.authService.getCurrentUser().subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        console.log('Current User ID:', this.userId);
        this.loadCategorizedRecipes(); // Load categories after getting userId
      } else {
        console.log('No user logged in.');
      }
    });
  }

  ionViewWillEnter() {
    this.loadCategorizedRecipes();
  }

  
  loadCategorizedRecipes() {
    if (!this.userId) return;

    this.recipeService.getUserRecipes(this.userId).subscribe((recipes) => {
      if (!recipes || recipes.length === 0) {
        console.log('No recipes found for this user.');
        return;
      }

      const groupedRecipes = recipes.reduce((acc: { [category: string]: any[] }, recipe: any) => {
        if (!recipe.category) return acc; // ✅ Check if category exists

        recipe.category.forEach((cat: string) => {
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({
            ...recipe,
            isFavorite: this.recipeService.isFavorite(recipe),
          });
        });
        return acc;
      }, {});

      this.categorizedRecipes = groupedRecipes;

      // ✅ Store names grouped by category
      this.namesByCategory = this.transformGroupedData('name');
      this.imagesByCategory = this.transformGroupedData('image');
      this.idsByCategory = this.transformGroupedData('id');

      console.log('Categorized Recipes:', this.categorizedRecipes);
      console.log('Recipe Names by Category:', this.namesByCategory);
      console.log('Recipe Images by Category:', this.imagesByCategory);
      console.log('Recipe IDs by Category:', this.idsByCategory);
    });
  }

  // 🔹 Helper function to extract data by category
  private transformGroupedData(key: string): { [category: string]: string[] } {
    return Object.keys(this.categorizedRecipes).reduce((acc: { [key: string]: string[] }, category) => {
      acc[category] = this.categorizedRecipes[category].map((recipe) => recipe[key] || 'N/A');
      return acc;
    }, {});
  }
}
