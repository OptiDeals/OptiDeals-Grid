var recipeJsonObject;

window.addEventListener('load', Init)

const links =
[
    "recipeStore1.json",
    "recipeStore2.json"
]

const defaultLink = "https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/main/data/requestedRecipes/metro/recipe_20240321.json";

//get header html container
const getHeader = function(){
    return document.getElementById("header");
}

//get grid html container
const getGrid = function(){
    return document.getElementById("grid");
}

//fetch json
function getJson(link){
    console.log("entered get json");
    fetch(link)
    .then(response => response.json())
    .then(data => doJson(data));
}


//start adding recipe cards to page
function doJson(obj){

    getGrid().innerHTML = "";

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
                <span>Total Cost: $`+obj[i].total_cost+`</span>     
              </div>
        </button>`
    }

}

//populate each card with recipe
function populateCard(ingredients){
    let html = ``;
    
    for(let i = 0; i < ingredients.length ; i++){

        html += `<li>${ingredients[i].name}, 
                ${ingredients[i].amount}, 
                $${ingredients[i].cost}</li><br>`
    }

    return html;
}

function dropdownItem(id){
    document.getElementById(id).classList.toggle("show");
}

function Init(){
    getJson(defaultLink);  
    document.getElementById('storeItem1').addEventListener('click', function () {
        getJson(links[0]);
    })

    document.getElementById('storeItem2').addEventListener('click', function () {
        getJson(links[1]);
    })
}
