import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipieService } from '../service/recipie.service';

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

  categories = [
    { name: 'Sweets', img: 'assets/images/sweet .jpeg' },
    { name: 'Curries', img: 'assets/images/curries.jpeg' },
    { name: 'Sadhya', img: 'assets/images/sadhya.jpeg'},
    { name: 'Rice', img: 'assets/images/rice.jpeg' },
    { name: 'Breakfast', img: 'assets/images/breakfast.jpeg'},
    { name: 'Snacks', img: 'assets/images/snacks.jpeg'},
    { name: 'Healthy', img: 'assets/images/health.jpeg'},
    { name: 'Spicy', img: 'assets/images/spicy.jpeg'},
    { name: 'Drinks', img: 'assets/images/Drinks.jpeg'},
    { name: 'Pickles', img: 'assets/images/Pickles.jpeg'},
    { name: '5min Recipie', img: 'assets/images/5min.jpeg'},
  ];

  constructor(private router: Router,
    private recipeService: RecipieService
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
  
  ngOnInit() {
    this.loadCategorizedRecipes();
    console.log(this.loadCategorizedRecipes());
  }

  ionViewWillEnter() {
    this.loadCategorizedRecipes();
  }

  
  loadCategorizedRecipes() {
    this.recipeService.recipes$.subscribe((recipes) => {
      const groupedRecipes = recipes.reduce((acc: { [category: string]: any[] }, recipe: any) => {
        recipe.category.forEach((cat: string) => {
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({
            ...recipe,
            isFavorite: this.recipeService.isFavorite(recipe),
          });
        });
        console.log(acc);
        return acc;
      }, {});
  
      this.categorizedRecipes = groupedRecipes;
  console.log(groupedRecipes);

      // Store recipe names grouped by category
      this.namesByCategory = Object.keys(this.categorizedRecipes).reduce((acc: { [key: string]: string[] }, category) => {
        acc[category] = this.categorizedRecipes[category].map((recipe) => recipe.name);
        return acc;
      }, {});
  
      console.log('Recipe Names by Category:', this.namesByCategory);
  
      // Store recipe images grouped by category
      this.imagesByCategory = Object.keys(this.categorizedRecipes).reduce((acc: { [key: string]: string[] }, category) => {
        acc[category] = this.categorizedRecipes[category].map((recipe) => recipe['image']);
        return acc;
      }, {});
    
      console.log('Recipe Images by Category:', this.imagesByCategory);

      this.idsByCategory = Object.keys(this.categorizedRecipes).reduce((acc: { [key: string]: string[] }, category) => {
        acc[category] = this.categorizedRecipes[category].map((recipe) => recipe['id']);
        return acc;
      }, {});
    
      console.log('Recipe Images by Category:', this.idsByCategory);
    });
  
  
  
  }
  

}
