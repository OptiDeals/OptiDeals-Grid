var currentRecipeJson;
var filteredJson;

window.addEventListener('load', Init)

const links =
[
    "https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/main/data/requestedRecipes/metro/",
    "https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/main/data/requestedRecipes/foodBasics/"
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
    .then(data => saveJson(data));
}


//start adding recipe cards to page
function saveJson(obj){
    currentRecipeJson = obj;
    displayJson(currentRecipeJson);
}

function displayJson(obj){

    getGrid().innerHTML = "";
    
    for(let i = 0; i < obj.length ; i++){
        if(obj[i] != null){
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

}
 

//populate each card with recipe
function populateCard(ingredients){
    let html = ``;
    
    for(let i = 0; i < ingredients.length ; i++){

        html += `<li>${ingredients[i].name}, 
                ${ingredients[i].amount}, 
                $${ingredients[i].cost}</li>`
    }

    return html;
}

function filterJsonData(constraint){

    filteredJson = JSON.parse(JSON.stringify(currentRecipeJson));

    //filter json
    for(let i = 0; i < filteredJson.length ; i++){

        if(filteredJson[i].total_cost > constraint){

            filteredJson[i] = null;

        }

    }

    //check if all json data is null
    if(filteredJson.every(e => e === null)){
        getGrid().innerHTML = "Could not find any recipes with selected filters.";
    }else{
        displayJson(filteredJson);      
    }


}



function dropdownItem(id){
    document.getElementById(id).classList.toggle("show");
}

function Init(){

    getJson(defaultLink);  //change back to default github link

    document.getElementById('storeItem1').addEventListener('click', function () {
        getJson(links[0]);
    })

    document.getElementById('storeItem2').addEventListener('click', function () {
        getJson(links[1]);
    })

    document.getElementById('priceUnder10').addEventListener('click', function () {
        filterJsonData(10);
    })

    document.getElementById('priceUnder20').addEventListener('click', function () {
        filterJsonData(20);
    })

    document.getElementById('priceUnder30').addEventListener('click', function () {
        filterJsonData(30);
    })
}
