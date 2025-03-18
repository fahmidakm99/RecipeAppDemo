import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { MealPlannerModalComponent } from './mealplanner-modal.component';
import { RecipieService } from '../service/recipie.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterModalComponent } from './filter-modal.component';
import { Recipe } from '../recipe.model';
@Component({
  selector: 'app-my-space',
  templateUrl: './my-space.page.html',
  styleUrls: ['./my-space.page.scss'],
})
export class MySpacePage {
  isModalOpen = false;
  selectedMeal: string = 'Recipe'; // Ensure it's initialized
  newRecipe: string = '';
  showInlineModal = false;
  communityRecipes: any[] = []; // Store fetched recipes
  searchTerm: string = '';

  // Variables to hold the state
  // selectedCategories: string[] = [];
  selectedCategories: { [key: string]: boolean } = {}; // <-- FIXED
  sortBy: string = '';
  prepTimeRange: { min: number; max: number } = { min: 0, max: 0 };

  weekDays = [
    { name: 'Monday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Tuesday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Wednesday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Thursday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Friday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Saturday', expanded: false, meals: {} as Record<string, string> },
    { name: 'Sunday', expanded: false, meals: {} as Record<string, string> },
  ];

  mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  today: string = '';

  name!: string;
  modal: any;
  userId!: string; // ✅ Store user ID

  selectedSegment: string = 'mealPlanner'; // Default segment

  publicRecipes: any[] = []; // Variable to store public recipes
  recipeId!: string; // ✅ Added this property
  recipe: any = {}; // ✅ Declare the recipe property

  myPublicRecipes: any[] = []; // Recipes created by the user
  otherUsersRecipes: any[] = []; // Recipes from other users

  combinedRecipes: any[] = []; // New array for combined recipes
  filteredCombinedRecipes: any[] = []; // Filtered combined array
  filteredOtherUsersRecipes: any[] = [];
  filteredMyPublicRecipes: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private recipeService: RecipieService,
    // private auth: Auth,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.highlightToday();
    this.getUserIdAndLoadMeals();
    this.fetchCommunityRecipes();
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['segment']) {
        this.selectedSegment = params['segment']; // Set the segment
      }
    });
  }
  viewRecipeDetails(recipeId: string) {
    console.log('Viewing recipe:', recipeId);

    // Fetch the recipe details from Firestore before navigating
    this.firestore
      .collection('recipeCommunity')
      .valueChanges({ idField: 'id' })
      .subscribe((recipes) => {
        this.communityRecipes = recipes;
        console.log('Loaded community recipes:', this.communityRecipes);

        // Find the specific recipe by ID
        const recipe = this.communityRecipes.find((r) => r.id === recipeId);

        if (recipe) {
          console.log(`Recipe: ${recipe.name}, isPublic: ${recipe.isPublic}`);

          // if (recipe.isPublic && this.userId) {
          if (recipe.userId === this.userId) {
            sessionStorage.setItem('previousPage', this.router.url); // Store last page
            this.router.navigate(['/single-recipie-info', recipeId]);
          } else {
            sessionStorage.setItem('previousPage', this.router.url); // Store last page
            this.router.navigate(['/single-recipie-info-public', recipeId]);
          }
        } else {
          console.error(`Recipe not found for ID: ${recipeId}`);
        }
      });
  }

  async getUserIdAndLoadMeals() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid; // ✅ Assign user ID
        console.log('User logged in:', this.userId);
        this.loadMealPlan(this.userId); // ✅ Load meals only after user ID is available
      } else {
        console.error('User not logged in');
        this.userId = ''; // Clear user ID if not logged in
      }
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
  }
  highlightToday() {
    const todayIndex = new Date().getDay();
    this.today =
      todayIndex === 0 ? 'Sunday' : this.weekDays[todayIndex - 1].name;
    this.weekDays.forEach((day) => {
      if (day.name === this.today) {
        day.expanded = true;
      }
    });
  }

  async openInlineModal(userId: string, day: string, meal: string) {
    console.log('Opening modal for:', day, meal);
    const existingRecipe =
      this.weekDays.find((d) => d.name === day)?.meals[meal] || '';

    const modal = await this.modalCtrl.create({
      component: MealPlannerModalComponent,
      componentProps: { day, meal, existingRecipe },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      console.log('Recipe saved:', data); // ✅ Debugging output

      this.weekDays.find((d) => d.name === day)!.meals[meal] = data; // ✅ Store the recipe
      this.recipeService
        .saveRecipeToMealPlanner(userId, day, meal, data)
        .subscribe(); // Save to Firebase
    }
  }
  // Load saved recipes on app start
  loadMealPlan(userId: string) {
    this.recipeService.getMealplannerRecipes(userId).subscribe((recipes) => {
      console.log('Fetched meal planner data:', recipes); // ✅ Debugging output

      if (recipes.length > 0) {
        recipes.forEach((recipe: any) => {
          const dayObj = this.weekDays.find((d) => d.name === recipe.day);
          if (dayObj) {
            dayObj.meals[recipe.mealType] = recipe.recipe;
          }
        });
      } else {
        console.log('No saved meal plan found.');
      }
    });
  }

  // fetchCommunityRecipes() {
  //   this.firestore
  //     .collection('recipeCommunity')
  //     .valueChanges({ idField: 'id' })
  //     .subscribe((recipes) => {
  //       this.communityRecipes = recipes;
  //       console.log('Loaded community recipes:', this.communityRecipes);
  //     });
  // }
  fetchCommunityRecipes() {
    this.firestore
      .collection('recipeCommunity')
      .valueChanges({ idField: 'id' })
      .subscribe((recipes: any[]) => {
        console.log('Fetched recipes from Firestore:', recipes);

        // Separate my recipes and other users' recipes
        this.myPublicRecipes = recipes.filter(
          (recipe) => recipe.userId === this.userId
        );
        this.otherUsersRecipes = recipes.filter(
          (recipe) => recipe.userId && recipe.userId !== this.userId
        );

        console.log('My Public Recipes:', this.myPublicRecipes);
        console.log("Other Users' Recipes:", this.otherUsersRecipes);
        this.filterRecipes();
      });
  }
  filterRecipes() {
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      // Filter both arrays separately
      this.filteredOtherUsersRecipes = this.otherUsersRecipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(term) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(term))
      );

      this.filteredMyPublicRecipes = this.myPublicRecipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(term) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(term))
      );
    } else {
      // If no search term, show all
      this.filteredOtherUsersRecipes = [...this.otherUsersRecipes];
      this.filteredMyPublicRecipes = [...this.myPublicRecipes];
    }
  }

  // async openFilterModal() {
  //   const modal = await this.modalController.create({
  //     component: FilterModalComponent,
  //     componentProps: {
  //       currentSort: this.sortBy,
  //       selectedCategories: this.selectedCategories,
  //       prepTimeRange: this.prepTimeRange
  //     }
  //   });

  //   modal.onDidDismiss().then((data) => {
  //     if (data.data) {
  //       // Update filters here
  //       this.sortBy = data.data.sortBy;
  //       this.selectedCategories = data.data.selectedCategories;
  //       this.prepTimeRange = data.data.prepTimeRange;
  //       this.filterRecipes();
  //     }
  //   });

  //   await modal.present();
  // }
  createCategoryObject(selectedArray: string[]) {
    const obj: { [key: string]: boolean } = {};
    selectedArray.forEach((cat) => (obj[cat] = true));
    return obj;
  }

  applyFilterLogic() {
    const selectedCategoriesArray = Object.keys(this.selectedCategories).filter(
      (cat) => this.selectedCategories[cat]
    );
    console.log('Selected Categories:', selectedCategoriesArray);

    const combineRecipes = [...this.otherUsersRecipes, ...this.myPublicRecipes];
    console.log('Combined Recipes:', combineRecipes);

    // Step 1:  Filter recipes where any category matches selected category
    let filteredRecipes = combineRecipes;
    if (selectedCategoriesArray.length > 0) {
      filteredRecipes = combineRecipes.filter((recipe) =>
        recipe.category?.some((cat: string) =>
          selectedCategoriesArray.includes(cat)
        )
      );
    }
    console.log('Filtered Recipes:', filteredRecipes);

    // Step 2: Sort logic
    if (this.sortBy) {
      if (this.sortBy === 'asc') {
        console.log(this.sortBy);
        filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortBy === 'desc') {
        filteredRecipes.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
    console.log('Filtered Recipes:', filteredRecipes);

    // Step 3: Filter by prepTimeRange
    // ✅ Prep Time Range Filter (ACTIVATED NOW)
    if (this.prepTimeRange) {
      const { min, max } = this.prepTimeRange;
      console.log(
        `Filtering recipes by prep time between ${min} and ${max} mins`
      );

      filteredRecipes = filteredRecipes.filter((recipe) => {
        const prepTime = Number(recipe.prepTime) || 0;
        const isInRange = prepTime >= min && prepTime <= max;
        console.log(
          `Recipe: ${recipe.name} - prepTime: ${prepTime} - inRange: ${isInRange}`
        );
        return isInRange;
      });
    }

    // Optional split into "otherUsers" and "myPublic" buckets
    this.filteredOtherUsersRecipes = filteredRecipes.filter((recipe) =>
      this.otherUsersRecipes.includes(recipe)
    );
    this.filteredMyPublicRecipes = filteredRecipes.filter((recipe) =>
      this.myPublicRecipes.includes(recipe)
    );
  }

  // async openFilterModal() {
  //   const modal = await this.modalController.create({
  //     component: FilterModalComponent,
  //     componentProps: {
  //       currentSort: this.sortBy,
  //       selectedCategories: Object.keys(this.selectedCategories),
  //       prepTimeRange: this.prepTimeRange,
  //     },
  //   });

  //   modal.onDidDismiss().then((result) => {
  //     if (result.data) {
  //       const { sortBy, selectedCategories, prepTimeRange } = result.data;
  //       // this.sortBy = sortBy;
  //       this.sortBy = result.data.sortBy;
  //       this.selectedCategories = this.createCategoryObject(selectedCategories);
  //       this.prepTimeRange = prepTimeRange;
  //       this.applyFilterLogic();
  //     }
  //   });

  //   await modal.present();
  // }
  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        selectedCategories: this.selectedCategories,
        currentSort: this.sortBy,
        prepTimeRange: this.prepTimeRange,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedCategories = this.convertArrayToObj(
          result.data.selectedCategories
        );
        this.sortBy = result.data.sortBy;
        this.prepTimeRange = result.data.prepTimeRange;
        this.applyFilterLogic();
      }
    });

    await modal.present();
  }

  convertArrayToObj(selectedArray: string[]): { [key: string]: boolean } {
    const obj: { [key: string]: boolean } = {};
    selectedArray.forEach((cat) => (obj[cat] = true));
    return obj;
  }
}
