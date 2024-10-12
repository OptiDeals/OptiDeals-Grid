var currentConstraint = 0;
var currentStore = "all";

const sqlPromise = initSqlJs({
    locateFile: file => `sql-wasm.wasm`
});

async function fetchDatabase(sqlPromise) {
    const dataPromise = fetch("https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/refs/heads/main/data/optideals.db").then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
    return new SQL.Database(new Uint8Array(buf));
}

async function loadRecipes() {
    const db = await fetchDatabase(sqlPromise);
    const stmt = db.prepare("SELECT recipe_title, recipe_image FROM recipes");

    while (stmt.step()) {
        const row = stmt.getAsObject();

    }
}
window.addEventListener('load', Init)

window.onscroll = function () { myFunction() };



function myFunction() {

    var header = document.getElementById("header");
    var sticky = header.offsetTop;

    if (window.scrollY > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

//get header html container
const getHeader = function () {
    return document.getElementById("header");
}

//get grid html container
const getGrid = function () {
    return document.getElementById("grid");
}

async function displayRecipes() {

    getGrid().innerHTML = "";

    const db = await fetchDatabase(sqlPromise);
    const recipes_stmt = db.prepare("SELECT * FROM recipes");

    //run through each recipe in the recipes table
    while (recipes_stmt.step()) {
        const row = recipes_stmt.getAsObject();
        const ingredients_stmt = db.prepare("SELECT * FROM recipe_ingredients WHERE recipe_id = " + row.id);

        if(currentStore == "all" || row.recipe_store == currentStore)
        {
            if(currentConstraint == 0 || row.recipe_total_cost < currentConstraint)
                {
                let ingredientsHTML = "";
        
                //run through each ingredient of current recipe
                while (ingredients_stmt.step()) {
        
                    const ingredients_row = ingredients_stmt.getAsObject();
                    ingredientsHTML += 
                    `<li>${ingredients_row.recipe_ingredient}, 
                        ${ingredients_row.recipe_ingredient_amount}, 
                        $${ingredients_row.recipe_ingredient_cost}</li>`
                }
        
                const blob = new Blob([row.recipe_image], { type: 'image/jpeg' });
                recipe_img = URL.createObjectURL(blob);
        
                getGrid().innerHTML +=
                    `<button onclick="viewRecipe('recipe')" class="recipe-item-button" type="button">
                          <div class="recipe-item">
                            <div class="recipe-info">
                            `+ row.recipe_title + row.recipe_store +`
                            <br><br>
                            <span>`+ row.recipe_description + `</span>
                            <br><br>
                            <span>Serves `+ row.recipe_serving_size + `<span>
                            <br>
                            <div class = "recipe-list">
                                <ul>
                                `+ingredientsHTML+`
                                </ul> 
                            </div>
                            <br>
                            <span>Total Cost: $`+ Math.round(row.recipe_total_cost * 100) / 100 + `</span>     
                            </div>
                            <div class="recipe-img">
                            <img src="`+recipe_img+`" width="550" height ="500">
                            </div>
                          </div>
                    </button>`
            }else{
                continue
            }
        }

        
}


}


//populate each card with recipe
function formatIngredients(name, amount, cost) {
    let html = ``;

    html += `<li>${name}, 
                ${amount}, 
                $${cost}</li>`


    return html;
}

function setConstraint(constraint) {
    currentConstraint = constraint;
}

function setStore(store) {
    currentStore = store;
}

function highlightButton(id) {

    var clickedElement = document.getElementById(id);


    document.querySelectorAll("[class='highlight-button']").forEach
        (
            item => {

                //any button with the same parent as the clicked dropdown button will have it's checkmark removed
                //so that only one checkmark per dropdown is active
                var dropdownParent = item.parentElement.parentElement;

                if (dropdownParent == clickedElement.parentNode) {

                    item.classList.add("hide");

                }
            }

        );

    document.querySelectorAll("[id=" + CSS.escape(id) + "] > *").forEach(item => item.classList.remove("hide"));
}



function dropdownItem(id) {

    if (document.getElementById(id).classList.contains("show")) {
        document.getElementById(id).classList.remove("show");
    } else {
        document.getElementById(id).classList.add("show");
    }


}

function Init() {

    loadRecipes();
    displayRecipes();

    document.getElementById('storeItem1').addEventListener('click', function () {
        setStore("metro")
        highlightButton('storeItem1');
        displayRecipes();
    })

    document.getElementById('storeItem2').addEventListener('click', function () {
        setStore("foodbasics")
        highlightButton('storeItem2');
        displayRecipes();
    })

    document.getElementById('storeItem3').addEventListener('click', function () {
        setStore("all")
        highlightButton('storeItem3');
        displayRecipes();
    })

    document.getElementById('priceUnder20').addEventListener('click', function () {
        setConstraint(20);
        highlightButton('priceUnder20');
        displayRecipes()
    })

    document.getElementById('priceUnder30').addEventListener('click', function () {
        setConstraint(30);
        highlightButton('priceUnder30');
        displayRecipes()
    })

    document.getElementById('priceUnder40').addEventListener('click', function () {
        setConstraint(40);
        highlightButton('priceUnder40');
        displayRecipes()
    })

    document.getElementById('priceNoFilter').addEventListener('click', function () {
        setConstraint(0);
        highlightButton('priceNoFilter');
        displayRecipes();
    })
}
