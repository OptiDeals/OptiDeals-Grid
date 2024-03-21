var recipeJsonObject;

const getHeader = function(){
    return document.getElementById("header");
}

const getGrid = function(){
    return document.getElementById("grid");
}

const getJson = function(){
    fetch('https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/main/data/requestedRecipes/metro/recipe_20240321.json')
    .then(response => response.json())
    .then(data => doJson(data));
}

function doJson(obj){

    for(let i = 0; i < obj.length ; i++){
        getGrid().innerHTML += 
        `<button onclick="viewRecipe('recipe')" class="recipe-item-button" type="button">
              <div class="recipe-item">
                `+obj[i].name+`
                <br><br>
                <span>`+obj[i].description+`</span>
                <br><br>
                <ul>
                `+populateCard(obj[i].ingredients)+`
                </ul>      
              </div>
        </button>`
    }

}

function populateCard(ingredients){
    let html = ``;
    
    for(let i = 0; i < ingredients.length ; i++){

        html += `<li>${ingredients[i].product}, 
                ${ingredients[i].amount}, 
                $${ingredients[i].cost}</li><br>`
    }

    return html;
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

    getJson();

    

    
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