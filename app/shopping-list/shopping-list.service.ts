import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('pav', 6),
    new Ingredient('tomatoes', 6),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index, ingredient){
    // this.ingredients.splice(index,1,ingredient);
    this.ingredients[index]= ingredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index){
    this.ingredients.splice(index,1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients); //passes each ingredient from the ingredients array one by one
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
