import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MealPlannerModalComponent } from './mealplanner-modal.component';
import { RecipieService } from '../recipie.service';
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
  constructor(
    private modalCtrl: ModalController,
    private recipeService: RecipieService
  ) {
    this.highlightToday();
    this.loadMealPlan();
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

  async openInlineModal(day: string, meal: string) {
    console.log('Opening modal for:', day, meal);
    const existingRecipe = this.weekDays.find(d => d.name === day)?.meals[meal] || '';

    const modal = await this.modalCtrl.create({
      component: MealPlannerModalComponent,
      componentProps: { day, meal, existingRecipe },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.weekDays.find(d => d.name === day)!.meals[meal] = data; // ✅ Store the recipe
      this.recipeService.saveRecipeToMealPlanner(day, meal, data).subscribe(); // Save to Firebase
    }
  }
  // Load saved recipes on app start
loadMealPlan() {
  this.recipeService.getMealplannerRecipes().subscribe((recipes) => {
    if (recipes) {
      Object.values(recipes).forEach((recipe: any) => {
        const dayObj = this.weekDays.find(d => d.name === recipe.day);
        if (dayObj) {
          dayObj.meals[recipe.mealType] = recipe.recipe;
        }
      });
    }
  });
}
}
