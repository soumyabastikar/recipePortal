import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put<Recipe[]>(
        'https://ng-recipe-portal.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://ng-recipe-portal.firebaseio.com/recipes.json')
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => this.recipeService.setRecipes(recipes))
      );
  }
}

// Another approach
// fetchRecipes() {
//   return this.authService.user.pipe(
//     take(1),
//     exhaustMap((user) => {
//       return this.http.get<Recipe[]>(
//         'https://ng-recipe-portal.firebaseio.com/recipes.json',
//       {
//         params: new HttpParams().set('auth', user.token)
//       }
//       );
//     }),
//     map((recipes) => {
//       return recipes.map((recipe) => {
//         return {
//           ...recipe,
//           ingredients: recipe.ingredients ? recipe.ingredients : [],
//         };
//       });
//     }),
//     tap((recipes) => this.recipeService.setRecipes(recipes))
//   );
// }
