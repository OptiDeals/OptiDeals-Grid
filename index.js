const getHeader = function(){
    return document.getElementById("header");
}

const getGrid = function(){
    return document.getElementById("grid");
}

const recipeJsonObject = '{}';

const json = function(){
    fetch('recipe.json')
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse));
    recipeJsonObject = JSON.parse(jsonResponse);
    console.log(recipeJsonObject);
}

const recipes = new Array(12);


var headerContent;
var gridContent;

function dropdownItem(id){
    document.getElementById(id).classList.toggle("show");
}

function selectDropdownItem(item){
    document.getElementById("footer").innerHTML = document.getElementById(item).innerHTML;
}

function createRecipes(){
    for(let i = 0; i < recipes.length ; i++){
        getGrid().innerHTML += 
        `<button onclick="viewRecipe('recipe')" class="recipe-item-button" type="button">
              <div class="recipe-item">
  
                Recipe` +i+ `
                
              </div>
        </button>`
    }
    
    json();
}

/*function viewRecipe(recipe){

    headerContent = getHeader().innerHTML;
    gridContent = getGrid().innerHTML;

    getHeader().innerHTML = "<button onclick='returnToSelection()'>Go back</button>";
    getGrid().innerHTML = "Recipe 1";
}*/

function returnToSelection(){

    getHeader().innerHTML = headerContent;
    getGrid().innerHTML = gridContent;

}