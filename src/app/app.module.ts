import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { RecipieService } from './recipie.service';
import { MealPlannerModalComponent } from './my-space/mealplanner-modal.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';


const firebaseConfig = {
    apiKey: "AIzaSyBDRTsmi1wi5okX4wqV5fR2iJfLdJZxlyg",
    authDomain: "recipe-32d20.firebaseapp.com",
    projectId: "recipe-32d20",
    storageBucket: "recipe-32d20.appspot.com",
    messagingSenderId: "1078180605683",
    appId: "1:1078180605683:android:90d41d4174b2db8f499186"
  };
  

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    IonicStorageModule.forRoot(), 
    MealPlannerModalComponent,
  ],
  providers: [RecipieService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
