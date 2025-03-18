import { Component, Input } from '@angular/core';
import { ModalController, RangeChangeEventDetail } from '@ionic/angular';
import { IonRangeCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent { 

    @Input() currentSort: string = 'asc'; // Default value
    @Input() selectedCategories: { [key: string]: boolean } = {}; // Default as empty object
    // @Input() prepTimeRange: { lower: number; upper: number } = { lower: 5, upper: 120 };
    @Input() prepTimeRange: { min: number; max: number } = { min: 0, max: 120 };
  
    // sortBy: string = 'asc'; // Also initializing this field here
  
    prepTimeRangeValues: number[] = [5, 120]; // <-- Change to array

  selectedFilter: string = 'category';
  categories: string[] = [
    'Uncheck All',
    'Breakfast',
    'Lunch',
    'Snacks',
    'Dinner',
    'Bread',
    'Curries',
    'Sadhya',
    'Healthy',
    'Rice',
    'Spicy',
    'Sweets',
    'Drinks',
    'Pickles',
    '5min Recipie'
  ];
  
  prepTime = { lower: 5, upper: 120 };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // this.sortBy = this.currentSort || 'asc';
    // if (!this.prepTimeRange) {
    //     this.prepTimeRange = { lower: 5, upper: 120 };
    //   }
    // this.prepTimeRangeValues = [
    //     this.prepTimeRange.lower || 5,
    //     this.prepTimeRange.upper || 120
    //   ];
    if (!this.prepTimeRange || this.prepTimeRange.min === undefined || this.prepTimeRange.max === undefined) {
      this.prepTimeRange = { min: 0, max: 120 };
    }
    
  }
  onCategoryChange(category: string) {
    if (category === 'Uncheck All') {
      // Uncheck everything except "Uncheck All" itself
      Object.keys(this.selectedCategories).forEach(cat => {
        if (cat !== 'Uncheck All') {
          this.selectedCategories[cat] = false;
        }
      });
      // Also uncheck the 'Uncheck All' itself
      this.selectedCategories['Uncheck All'] = false;
    } else {
      // If any other category is clicked, make sure "Uncheck All" stays false
      this.selectedCategories['Uncheck All'] = false;
    }
  }
  getSelectedCategories(): string[] {
    return Object.keys(this.selectedCategories)
      .filter(category => this.selectedCategories[category] && category !== 'Uncheck All');
  }
  selectFilter(filter: string) {
    this.selectedFilter = filter;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

//   applyFilter() {
//     this.modalCtrl.dismiss({
//       sortBy: this.sortBy,
//       selectedCategories: this.selectedCategories,
//       prepTimeRange: this.prepTime
//     });
//   }
applyFilter() {
    const selectedCategoriesArray = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat]);
    // const [lower, upper] = this.prepTimeRangeValues;

    this.modalCtrl.dismiss({
    //   sortBy: this.sortBy,
    sortBy: this.currentSort, // <-- now use currentSort directly
      selectedCategories: selectedCategoriesArray,
      prepTimeRange: this.prepTimeRange
    // prepTimeRange: { lower, upper }
});
  }
  onRangeChange(event: CustomEvent) {
    this.prepTimeRange = event.detail.value;
  }

  convertArrayToObj(selectedArray: string[]) {
    const obj: { [key: string]: boolean } = {};
    selectedArray.forEach(cat => obj[cat] = true);
    return obj;
  }
  setPrepTimeRange(event: CustomEvent) {
    const value = event.detail.value;
    if (typeof value === 'object' && value.lower !== undefined && value.upper !== undefined) {
      this.prepTimeRange = { min: value.lower, max: value.upper };
    }
  }
  
  // setPrepTimeRange(range: { min: number; max: number }) {
  //   this.prepTimeRange = range;
  // }
  clearAll() {
    // Reset categories
    Object.keys(this.selectedCategories).forEach(cat => {
      this.selectedCategories[cat] = false;
    });
  
    // Reset sort
    this.currentSort = 'asc';
  
    // Reset prep time range
    this.prepTimeRange = { min: 0, max: 120 };
  
    // Optional: Reset UI section to default view
    this.selectedFilter = 'category';
  }
  
}
