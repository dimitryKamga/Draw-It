import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { DocumentationComponent } from './pages/documentation/documentation.component';
import { Routes, RouterModule } from '@angular/router';
import { DrawComponent } from './pages/draw/draw.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NewDrawComponent, ConfirmationDialog } from './pages/new-draw/new-draw.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MccColorPickerModule } from 'material-community-components';


// *************************** Angular Material ***************************************
import { MaterialModule } from './material.module';



// *************************** Rooting ********************************
const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'draw', component: DrawComponent },
	{ path: 'documentation', component: DocumentationComponent },
	{ path: 'new', component: NewDrawComponent },
	{ path: '**', component: NotFoundPageComponent }
];


@NgModule({
    declarations: [
        AppComponent, 
        HomeComponent, 
        DocumentationComponent, 
        DrawComponent, 
        NotFoundPageComponent,
        NewDrawComponent,
        ConfirmationDialog
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule, 
        HttpClientModule, 
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MccColorPickerModule.forRoot({
            empty_color: '0000FF',
            used_colors: ['#000000', '#FFF555']
        }),

    ],
    providers: [],
    entryComponents: [ConfirmationDialog],
    bootstrap: [AppComponent],
})
export class AppModule {}
