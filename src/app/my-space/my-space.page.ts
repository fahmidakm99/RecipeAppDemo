import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealPlannerModalComponent } from './mealplanner-modal.component';
import { RecipieService } from '../service/recipie.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../service/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private modalCtrl: ModalController,
    private recipeService: RecipieService,
    // private auth: Auth,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.highlightToday();
    this.getUserIdAndLoadMeals();
    this.fetchCommunityRecipes();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
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
      });
  }
  
}
