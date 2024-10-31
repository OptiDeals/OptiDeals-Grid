var currentConstraint = 0;
var currentStore = "all";


const sqlPromise = initSqlJs({
    locateFile: file => `../sql-wasm.wasm`
});

async function fetchDatabase(sqlPromise) {
    const dataPromise = fetch("https://raw.githubusercontent.com/OptiDeals/OptiDeals-Data/refs/heads/main/data/optideals.db").then(res => res.arrayBuffer());
    const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
    return new SQL.Database(new Uint8Array(buf));
}
async function loadGroceryStoreIngredients(){
    const db = await fetchDatabase(sqlPromise);
    const latestDateStmt = db.prepare("SELECT MAX(date_scraped) as latest_date FROM grocery_ingredients");
    const latestDateRow = latestDateStmt.getAsObject();
    const latestDate = latestDateRow.latest_date;
    console.log(latestDateRow.latest_date);
    const stmt = db.prepare(`SELECT * FROM grocery_ingredients where date_scraped = '${latestDate}'`);

    while(stmt.step()){
        const row = stmt.getAsObject();
    }

}

async function loadRecipes() {
    const db = await fetchDatabase(sqlPromise);
    const latestDateStmt = db.prepare("SELECT MAX(recipe_date) as latest_date FROM recipes");
    const latestDateRow = latestDateStmt.getAsObject();
    const latestDate = latestDateRow.latest_date;
    //console.log(latestDate);

    const stmt = db.prepare(`SELECT * FROM recipes WHERE recipe_date = '${latestDate}'`);


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
    //console.log("hi");
    return document.getElementById("grid");
}
const getHorizontalScrollMenu = function(){
    return document.getElementById("horizontal-scroll-menu");
}
async function displayAllIngredientsHorizontally(selectedEssentials = []){
    getHorizontalScrollMenu().innerHTML = "";
    //console.log(currentStore);

    const db = await fetchDatabase(sqlPromise);
 // Build a dynamic query based on selected essentials
 let essentialsFilter = selectedEssentials.map(essential => `grocery_ingredient LIKE '%${essential.toLowerCase()}%'`).join(' OR ');
console.log(essentialsFilter);
 var query = `
 SELECT *
 FROM grocery_ingredients
 WHERE strftime('%Y-%m-%d', date_scraped) = (
     SELECT strftime('%Y-%m-%d', MAX(date_scraped))
     FROM grocery_ingredients
 )
 ${essentialsFilter ? `AND (${essentialsFilter})` : ''};
 `;

    console.log(selectedEssentials.length);
    if(selectedEssentials.length==0){//if no essentials are selected then defualt behaviour is to show all essentials from store
  
       query = `SELECT *
    FROM grocery_ingredients
    WHERE strftime('%Y-%m-%d', date_scraped) = (
        SELECT strftime('%Y-%m-%d', MAX(date_scraped))
        FROM grocery_ingredients
    )
    AND (grocery_ingredient LIKE '%eggs%' --essentials
    OR grocery_ingredient LIKE '%bread%'
    OR grocery_ingredient LIKE '%milk%'
    OR grocery_ingredient LIKE '%tomato%'--veggies
    OR grocery_ingredient LIKE '%onion%'
    OR grocery_ingredient LIKE '%cucumber%'
    OR grocery_ingredient LIKE '%vegetable%'
    OR grocery_ingredient LIKE '%chicken%'
    OR grocery_ingredient LIKE '%beef%'
    OR grocery_ingredient LIKE '%fish%'
    OR grocery_ingredient LIKE '%butter%');`;
                   

      }
    const recipes_stmt = db.prepare(query);
    //console.log(storeName);
    console.log(currentStore);
    //const storeName1=storeName;
    //recipes_stmt.bind([currentStore]); // Bind the store name parameter to the query
    let ingredientsHtml = '';
    let hasResults = false;
    //run through each ingredient in the grocery_ingredients table
    while (recipes_stmt.step()) {
        hasResults=true;
        const row = recipes_stmt.getAsObject();
        console.log(row.date_scraped);

        ingredientsHtml +=`<div class = "divContainerForAllStoreItems" data =${row.grocery_store}><strong>${row.grocery_ingredient}</strong><br>
                        ${row.grocery_amount} x
                        $${row.grocery_cost} from</div>`;        
    
        }
        if (!hasResults) {
            ingredientsHtml += `<div><strong>No products found matching criteria</strong></div>`;
        }
        getHorizontalScrollMenu().innerHTML+=`${ingredientsHtml}`;
        document.querySelectorAll('.divContainerForAllStoreItems').forEach(div => {
            const store = div.getAttribute('data');
            
            if (store === 'metro') {
                div.innerHTML+=`<div style="color: red;"> Metro</div>`;
                //div.style.backgroundColor = 'lightblue';  // Apply specific styles based on the store
            } else if (store === 'foodbasics') {
                //div.style.backgroundColor = 'lightgreen';
                div.innerHTML+=`<div style="color: green;"> Food Basics`;

            }
        });
}
async function displayIngredientsHorizontally(selectedEssentials = []) {

    getHorizontalScrollMenu().innerHTML = "";
    console.log(selectedEssentials.length);
    console.log(selectedEssentials.length);
    console.log(selectedEssentials.length);

    const db = await fetchDatabase(sqlPromise);
    console.log(selectedEssentials.length);

    if(currentStore =="all"){
        

        displayAllIngredientsHorizontally(selectedEssentials);
            return;
    }
    console.log(selectedEssentials.length);

    
    // Build a dynamic query based on selected essentials
let essentialsFilter = selectedEssentials.map(essential => `grocery_ingredient LIKE '%${essential.toLowerCase()}%'`).join(' OR ');

              var query = `
              SELECT *
              FROM grocery_ingredients
              WHERE grocery_store = ? 
              AND strftime('%Y-%m-%d', date_scraped) = (
                  SELECT strftime('%Y-%m-%d', MAX(date_scraped))
                  FROM grocery_ingredients
              )
              ${essentialsFilter ? `AND (${essentialsFilter})` : ''};
          `;
          console.log(essentialsFilter);
          if(selectedEssentials.length==0){//if no essentials are selected then defualt behaviour is to show all essentials from store
            query = `
                 SELECT *
                 FROM grocery_ingredients
                 WHERE grocery_store = ? 
                 AND strftime('%Y-%m-%d', date_scraped) = (
                     SELECT strftime('%Y-%m-%d', MAX(date_scraped))
                     FROM grocery_ingredients
                 )
                 AND (grocery_ingredient LIKE '%eggs%' --essentials
                 OR grocery_ingredient LIKE '%bread%'
                 OR grocery_ingredient LIKE '%milk%'
                OR grocery_ingredient LIKE '%tomato%'--veggies
                OR grocery_ingredient LIKE '%onion%'
                OR grocery_ingredient LIKE '%cucumber%'
                    OR grocery_ingredient LIKE '%vegetable%'
                 OR grocery_ingredient LIKE '%chicken%'
                 OR grocery_ingredient LIKE '%beef%'
                 OR grocery_ingredient LIKE '%fish%'
                 OR grocery_ingredient LIKE '%butter%');
                       `;
          }
          console.log(selectedEssentials.length);
  
    const recipes_stmt = db.prepare(query);
    //console.log(storeName);
    console.log(currentStore);
    //const storeName1=storeName;
    recipes_stmt.bind([currentStore]); // Bind the store name parameter to the query
    let ingredientsHtml = '';
    let hasResults = false;
    //run through each ingredient in the grocery_ingredients table
    while (recipes_stmt.step()) {
        const row = recipes_stmt.getAsObject();
        hasResults = true;
        console.log(row.date_scraped);

        ingredientsHtml +=`<div><strong>${row.grocery_ingredient}</strong><br>
                        ${row.grocery_amount} x
                        $${row.grocery_cost}</div>`;        
    
        }
        if (!hasResults) {
            ingredientsHtml += `<div><strong>No products found matching criteria</strong></div>`;
        }
        getHorizontalScrollMenu().innerHTML+=`${ingredientsHtml}`;

        
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
                    //console.log(ingredients_row.recipe_ingredient_amount);
                    //console.log("hi");
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
                            `+row.recipe_title+`
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
// function formatIngredients(name, amount, cost) {
//     let html = ``;

//     html += `<li>${name}, 
//                 ${amount}, 
//                 $${cost}</li>`


//     return html;
// }

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
    //setting storeItem3(all stores) to active as that is the defualt choice in dropdown menu
    //document.getElementById("storeItem3").classList.add('active');
    setStoreItem("storeItem3");


    var selectedEssentials = [];
    //loadGroceryStoreIngredients();
    //displayIngredients();
    displayAllIngredientsHorizontally(selectedEssentials);

    //loadRecipes();
    //displayRecipes();

    document.getElementById('storeItem1').addEventListener('click', async function () {
        setStore("metro")
        highlightButton('storeItem1');
        checkEssentials(selectedEssentials);
        console.log(selectedEssentials);
        await(displayIngredientsHorizontally(selectedEssentials));
        selectedEssentials.length = 0;

    })

    document.getElementById('storeItem2').addEventListener('click', async function () {
        setStore("foodbasics")
        highlightButton('storeItem2');
        checkEssentials(selectedEssentials);

        await(displayIngredientsHorizontally(selectedEssentials));
        selectedEssentials.length = 0;
    })

    document.getElementById('storeItem3').addEventListener('click', async function () {
        setStore("all")
        highlightButton('storeItem3');
        checkEssentials(selectedEssentials);

        await(displayAllIngredientsHorizontally(selectedEssentials));
        selectedEssentials.length = 0;

    })
    document.getElementById('submitBtn').addEventListener('click', function() {
        
      selectedEssentials.length = 0;
        if (document.getElementById('chicken').checked) {
          selectedEssentials.push('chicken');
          
        }
        if (document.getElementById('veggies').checked) {
            selectedEssentials.push('vegetable');
            selectedEssentials.push('tomato');
            selectedEssentials.push('onion');
            selectedEssentials.push('cucumber');
        }
        if (document.getElementById('eggs').checked) {
          selectedEssentials.push('egg');
        }
        if (document.getElementById('bread').checked) {
            selectedEssentials.push('bread');
          }
          if (document.getElementById('milk').checked) {
            selectedEssentials.push('milk');
          }
          if (document.getElementById('beef').checked) {
            selectedEssentials.push('beef');
          }
          if (document.getElementById('fish').checked) {
            selectedEssentials.push('fish');
          }
          if (document.getElementById('butter').checked) {
            selectedEssentials.push('butter');
          }
        //       // Check if 'storeItem3'-all stores is selected (i.e., has 'active' class)
        //checkForEssentials(selectedEssentials);
        if (document.getElementById('storeItem3').classList.contains('active')) {
            // Pass selected essentials to the display function
           
            displayIngredientsHorizontally(selectedEssentials);
        }
        else{

            displayIngredientsHorizontally(selectedEssentials);
        }
          

      });


}

function setStoreItem(itemId) {
    // Clear 'active' class from all items
    document.getElementById('storeItem1').classList.remove('active');
    document.getElementById('storeItem2').classList.remove('active');
    document.getElementById('storeItem3').classList.remove('active');

    // Add 'active' class to the clicked store item
    document.getElementById(itemId).classList.add('active');
}
function checkEssentials(selectedEssentials=[]){
    if (document.getElementById('chicken').checked) {
        selectedEssentials.push('chicken');       
      }
      if (document.getElementById('veggies').checked) {
        selectedEssentials.push('vegetable');
        selectedEssentials.push('tomato');
        selectedEssentials.push('onion');
        selectedEssentials.push('cucumber');

      }
      if (document.getElementById('eggs').checked) {
        selectedEssentials.push('egg');
      }
      if (document.getElementById('bread').checked) {
          selectedEssentials.push('bread');
        }
        if (document.getElementById('milk').checked) {
          selectedEssentials.push('milk');
        }
        if (document.getElementById('beef').checked) {
          selectedEssentials.push('beef');
        }
        if (document.getElementById('fish').checked) {
          selectedEssentials.push('fish');
        }
        if (document.getElementById('butter').checked) {
          selectedEssentials.push('butter');
        }
}