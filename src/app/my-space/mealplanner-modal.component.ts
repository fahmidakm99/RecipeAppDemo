import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mealplanner-modal',
  standalone: true,
  templateUrl: 'mealplanner-modal.html',
  styleUrls: ['mealplanner-modal.scss'],
  imports: [IonicModule, FormsModule], // ✅ Import IonicModule
})
export class MealPlannerModalComponent {
  name: string = '';
  @Input() existingRecipe: string = ''; // Receive the existing recipe

  constructor(private modalCtrl: ModalController) {}
  
  ngOnInit() {
    this.name = this.existingRecipe; // Pre-fill with existing recipe
  }
  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel'); // ✅ Fix modal dismiss function
  }

  saveRecipe() {
    if (this.name.trim()) {
      this.modalCtrl.dismiss(this.name, 'confirm'); // ✅ Send data back on save
    }
  }
}
