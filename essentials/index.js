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
    var chosenEssentials=[];
    const options = document.querySelectorAll('.choice-dropdown-content a');
    options.forEach(option => {
      if (option.classList.contains('active')) {
        chosenEssentials.push(option.id.replace('-option', ''));
      }
    });
    getHorizontalScrollMenu().innerHTML = "";
    //console.log(currentStore);

    const db = await fetchDatabase(sqlPromise);
 // Build a dynamic query based on selected essentials
 let essentialsFilter = chosenEssentials.map(essential => `grocery_ingredient LIKE '%${essential.toLowerCase()}%'`).join(' OR ');
console.log(chosenEssentials);
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
    console.log(query);
    if(chosenEssentials.length==0){//if no essentials are selected then defualt behaviour is to show all essentials from store
  
       query = `SELECT *
    FROM grocery_ingredients
    WHERE strftime('%Y-%m-%d', date_scraped) = (
        SELECT strftime('%Y-%m-%d', MAX(date_scraped))
        FROM grocery_ingredients
    )
    AND (grocery_ingredient LIKE '%eggs%' --essentials
    OR grocery_ingredient LIKE '%bread%'
    OR grocery_ingredient LIKE '%milk%'
    OR grocery_ingredient LIKE '%cheese%'
    OR grocery_ingredient LIKE '%oil%'
    OR grocery_ingredient LIKE '%butter%');`;
                   

      }
      console.log(query);
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

    if(currentStore =="all" ){
        

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
                OR grocery_ingredient LIKE '%cheese%'
                 OR grocery_ingredient LIKE '%milk%'
                 OR grocery_ingredient LIKE '%oil%'
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
       // console.log(row.date_scraped);

        ingredientsHtml += 
        `<div class = "divContainerForAllStoreItems" data =${row.grocery_store}><strong>${row.grocery_ingredient}</strong><br>
                        ${row.grocery_amount} x
                        $${row.grocery_cost} from </div>`;    
                        console.log(row.grocery_store);
                        
                        
        }
        if (!hasResults) {
            ingredientsHtml += `<div><strong>No products found matching criteria</strong></div>`;
        }
        getHorizontalScrollMenu().innerHTML+=`${ingredientsHtml}`;

       

        document.querySelectorAll('.divContainerForAllStoreItems').forEach(div => {
            const store = div.getAttribute('data');
            
            if (store === 'metro') {
                div.innerHTML+=`<div style="color: red;">Metro</div>`;
      
                //div.style.backgroundColor = 'lightblue';  // Apply specific styles based on the store
            } else if (store === 'foodbasics') {
                //div.style.backgroundColor = 'lightgreen';
                div.innerHTML+=`<div style="color: green;">Food Basics`;

            }
        });

        
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
    displayIngredientsHorizontally(selectedEssentials);

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

        await(displayIngredientsHorizontally(selectedEssentials));
        selectedEssentials.length = 0;

    })
    document.getElementById('submitBtn').addEventListener('click', function() {
        
      selectedEssentials.length = 0;
        if (document.getElementById('cheese').checked) {
          selectedEssentials.push('cheese');
          
        }
       
        if (document.getElementById('eggs').checked) {
          selectedEssentials.push('eggs');
        }
        if (document.getElementById('bread').checked) {
            selectedEssentials.push('bread');
          }
          if (document.getElementById('milk').checked) {
            selectedEssentials.push('milk');
          }
          if (document.getElementById('oil').checked) {
            selectedEssentials.push('oil');
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
function toggleCheckbox(id) {
    
    const aTag = document.getElementById(`${id}-option`);
    const highlightButton = aTag.querySelector('.highlight-button');

    aTag.classList.toggle('active');
    highlightButton.classList.toggle('hide');

  
    // Clear the selectedEssentials array
    selectedEssentials = [];
  
    // Loop through all dropdown options and check their active state
    const options = document.querySelectorAll('.choice-dropdown-content a');
    options.forEach(option => {
      if (option.classList.contains('active')) {
        selectedEssentials.push(option.id.replace('-option', ''));
      }
    });

    //    if (option.id === 'all-option') { // Check for "all" option
    //     selectedEssentials.push('milk'); // Add "all" to array if active
    //     selectedEssentials.push('egg');
    //     selectedEssentials.push('cheese');
    //     selectedEssentials.push('oil');
    //     selectedEssentials.push('butter');
    //     selectedEssentials.push('bread');
    //   }
   
  
    // Update the ingredient display
    //setStore()
    displayIngredientsHorizontally(selectedEssentials);
  }
function setFilterItem(itemId){
    if(document.getElementById(itemId).classList.contains('active')==0){
        document.getElementById(itemId).classList.add('active');
    }
}
function checkEssentials(selectedEssentials=[]){
    const options = document.querySelectorAll('.choice-dropdown-content a');
    options.forEach(option => {
      if (option.classList.contains('active') && option.id !== 'all-option') {
        selectedEssentials.push(option.id.replace('-option', ''));
      }
    });
}