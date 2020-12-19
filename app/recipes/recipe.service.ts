import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();

constructor(private shoppingListService: ShoppingListService){}

private recipes: Recipe [] = [];

//  private recipes: Recipe [] = [
//         new Recipe('Pav Bhaji', 'A traditional North Indian savoury dish', 'https://i2.wp.com/pipingpotcurry.com/wp-content/uploads/2018/09/Pav-Bhaji.jpg',[
//           new Ingredient('Pav',12),
//           new Ingredient('Potatoes',5),
//           new Ingredient('Tomatoes',5)
//         ]),
//         new Recipe('Undi', 'A traditional South Indian savoury dish', 'https://3.bp.blogspot.com/-ABwXW_ogrw0/Vrqx16LbmEI/AAAAAAAAVo4/rgvejfT2_Xw/s1600/Rava%2BUndi%2B%25282%2529%2B-%2B1.jpg',[
//           new Ingredient('Rice', 5),
//           new Ingredient('currey leaves',10)
//         ]),
//         new Recipe('Ukadiche Modak', 'A traditional Indian sweet', 'https://ranveerbrar.com/wp-content/uploads/2018/07/Ukdiche-Modak-1200x715.jpg',[
//           new Ingredient('Rice', 5),
//           new Ingredient('Jaggery',2)
//         ])
//       ];

getRecipes(){
    return this.recipes.slice();
}

setRecipes(recipes : Recipe[]){
  this.recipes = recipes;
  this.recipesChanged.next(this.recipes.slice());
}

getRecipe(id: any){
  console.log(this.recipes.slice());
  return this.recipes.slice()[id];
}

addNewRecipe(recipe: Recipe){
  this.recipes.push(recipe);
  this.addIngredientsToSL(recipe.ingredients);
  this.recipesChanged.next(this.recipes.slice());
}

updateRecipe(index: number, recipe:Recipe){
  this.recipes[index]=recipe;
  this.addIngredientsToSL(recipe.ingredients);
  this.recipesChanged.next(this.recipes.slice());
}

deleteRecipe(index: number){
  this.recipes.splice(index,1);
  this.recipesChanged.next(this.recipes.slice());
}

addIngredientsToSL(ingredients :Ingredient[]){
  this.shoppingListService.addIngredients(ingredients);
}

}