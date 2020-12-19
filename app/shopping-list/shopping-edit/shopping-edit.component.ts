import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.less']
})
export class ShoppingEditComponent implements OnInit {
  constructor(private shoppingListService: ShoppingListService) { }
  @ViewChild('f') ingredientForm : NgForm;
  editMode = false;
  index: number;

  ngOnInit(): void {
    this.shoppingListService.startedEditing.subscribe( index => {
      this.editMode = true;
      this.index = index;
      let ingredientSelected = this.shoppingListService.getIngredient(index);
      this.ingredientForm.setValue({
        name: ingredientSelected.name,amount:ingredientSelected.amount
      });
    });
  }

  onAddIngredient(form: NgForm){
    let newIngredient = {name: form.value.name,amount:form.value.amount};
    if(!this.editMode){      
      this.shoppingListService.addIngredient(newIngredient);
    } else {
      this.shoppingListService.updateIngredient(this.index, newIngredient);
      this.onClear(form);
    }
  }

  onDeleteIngredient(){
    this.shoppingListService.deleteIngredient(this.index);
    this.onClear(this.ingredientForm);
  }

  onClear(form:NgForm){
    this.editMode = false;
    form.reset();
  }

}
