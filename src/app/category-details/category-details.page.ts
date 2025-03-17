import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.page.html',
  styleUrls: ['./category-details.page.scss'],
})
export class CategoryDetailsPage implements OnInit {
  categoryName: string = '';
  dishes: string[] = [];
  category: string = '';
  images: string[] = [];
  ids: string[] = [];
  filteredDishes: string[] = []; // Holds the filtered dishes

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.category = this.route.snapshot.paramMap.get('category') || '';
    const navState = this.router.getCurrentNavigation()?.extras.state;

    if (navState) {
      console.log('navState:', navState); // Debug: Check the structure of navState
      this.dishes = navState['recipes'] || []; // Ensure it's an array of recipe objects
      this.images = navState['images'] || [];
      this.ids = navState['ids'] || [];

      this.dishes.forEach((dish) => {
        console.log('Recipe name:', dish); // Debug: Check recipe name
      });
      this.images.forEach((image) => {
        console.log('Recipe image:', image); // Debug: Check recipe name
      });
      this.ids.forEach((id) => {
        console.log('Recipe id:', id); // Debug: Check recipe name
      });
    }
    // Initialize filteredDishes with all dishes
    this.filteredDishes = [...this.dishes];
    // console.log('Category:', this.category);  // Check the category
    // console.log('Recipes in category detail page:', this.dishes);  // Check the recipes
    // console.log('Recipie id : ', this.ids);
  }

  filterDishes(event: any) {
    const searchTerm = event.target.value?.toLowerCase().trim();
    if (!searchTerm) {
      // Show all dishes if the search term is empty
      this.filteredDishes = [...this.dishes];
    } else {
      // Filter dishes based on the search term
      this.filteredDishes = this.dishes.filter((dish) =>
        dish.toLowerCase().includes(searchTerm)
      );
    }
  }

  openRecipe(recipeId: string) {
    this.router.navigate(['/single-recipie-info', recipeId]); // Navigate to single-recipie-info with the ID
  }
}
