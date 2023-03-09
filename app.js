const c = console.log.bind(console)
// storage controller
const storageCtrl = (function(){
  return{
    getStrorageItems: function(){
      const storeItems = JSON.parse(localStorage.getItem('data'))
      if(storeItems !== null){
        return JSON.parse(localStorage.getItem('data'))
      } else{
        return []
      }
    },
    addItemToStorage: function(newData){
      localStorage.setItem('items', JSON.stringify(newData))
    },
    removeFromStorage: function(newData){
      localStorage.setItem('items', JSON.stringify(newData))
    },
    editInstorage: function(newData){
      localStorage.setItem('items', JSON.stringify(newData))
    },
    clearStorage: function(emptyData){
      localStorage.removeItem('items')
    }
  }
})()

// item controller
const itemCtrl =(function(){
    // item constructor
    const Item = function(id, name, calories){
      this.id = id
      this.name = name
      this.calories = calories
    }
    // Data Structure / State

    const data = {
        items:storageCtrl.getStrorageItems(),
        currentItem: null,
        totalCalories: 0
      }
    // const data = storageCtrl.getStrorageItems()  
    // public methods
    return{
      // get items
      getItems: function(){
        return data.items
      },
      // add an item 
      addItem: function(name, calories){
        
        // create id 
        let id;
        // id logic
        data.items.length > 0 ? id = data.items[data.items.length - 1].id + 1  : id = 0
        // crating an item and adding to item array
        data.items.push(new Item(id, name, parseFloat(calories)))
        // reiterating list
        UICtrl.populateItemList(data.items)
        // add to storage
        itemCtrl.getcals()
        storageCtrl.addItemToStorage(data.items)
      },
      // get total calorie
      getcals: function(){
        let totalCalories = 0
        data.items.forEach((item)=>{
          totalCalories += item.calories
  
        })
        data.totalCalories = totalCalories
        return totalCalories
      },
      // get an item by id
      getItemById: function(id){
        return data.items.find(item => item.id == id)
      },
      // get current item
      getCurrentItem: function(){
        return data.currentItem
      },
      // set current item
      setCurrentItem: function(item){
        data.currentItem = item
      },
      // edit current item
      editCurrentItem: function(name, calories){
        data.currentItem.name = name
        data.currentItem.calories = parseInt(calories)
        
      },
      // updata item
      updateItem: function(){
        let editedItem = itemCtrl.getItemById(data.currentItem.id)
        editedItem = data.currentItem   
        storageCtrl.editInstorage(data.items)     
      },
      // delete item
      deleteItem: function(){
        const index = data.items.indexOf(data.currentItem)
        data.items.splice(index, 1)
        // remove from storage
        storageCtrl.removeFromStorage(data.items)
      },
      // clear all items
      clearList: function(){
        data.currentItem = null
        data.totalCalories = 0
        data.items = []
        storageCtrl.clearStorage()
      },

      logData: function(){
        return data
      },
   
    }
})();


// ui controller
const UICtrl =(function(items){
  const UIselectors = {
    itemList: '#item-list',
    itemNameInput : '#item-name',
    itemCalsInput : '#item-calories',
    addMeal : '#add-meal',
    totalCalories: '#total-calories',
    uptdateBtn : '.update-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    listItems : 'li',
    clearBtn: '.clear-btn'
  
  }
  return{
    populateItemList: function(items){  
      output = '';
      items.forEach(item => {
        output +=`
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`
      });
      if(items.length !== 0){
        document.querySelector(UIselectors.itemList).style.display = 'block'
      }
      document.querySelector(UIselectors.itemList).innerHTML = output
      
    },
    getItemInput: function(){
      return{
        name: document.querySelector(UIselectors.itemNameInput).value,
        calories: document.querySelector(UIselectors.itemCalsInput).value
      }
    },
    // show total calories
    showTotalCalories:function(totalCalories){
      document.querySelector(UIselectors.totalCalories).innerHTML = totalCalories
    },
    clearFields: function (){
      document.querySelector(UIselectors.itemCalsInput).value = ''
      document.querySelector(UIselectors.itemNameInput).value = ''
    },
    hideList: function(){
      document.querySelector(UIselectors.itemList).style.display = 'none'
    },
    showList: function(){
      document.querySelector(UIselectors.itemList).style.display = 'block'
    },
    clearEditState: function(){
      UICtrl.clearFields();
      document.querySelector(UIselectors.deleteBtn).style.display = 'none'
      document.querySelector(UIselectors.uptdateBtn).style.display = 'none'
      document.querySelector(UIselectors.backBtn).style.display = 'none'
      document.querySelector(UIselectors.addMeal).style.display = 'inline-block'

    },
    editState: function(calories, name){
      document.querySelector(UIselectors.itemCalsInput).value = calories
      document.querySelector(UIselectors.itemNameInput).value = name
      document.querySelector(UIselectors.deleteBtn).style.display = 'inline-block'
      document.querySelector(UIselectors.uptdateBtn).style.display = 'inline-block'
      document.querySelector(UIselectors.backBtn).style.display = 'inline-block'
      document.querySelector(UIselectors.addMeal).style.display = 'none'

    },
    updateItem: function(editedItem){
      const listItems = document.querySelectorAll(UIselectors.listItems)
      Array.from(listItems)
      listItems.forEach(listItem=>{
        const itemId = listItem.getAttribute('id')
        if(itemId === `item-${editedItem.id}`){
          listItem.innerHTML=`
            <strong>${editedItem.name}: </strong> <em>${editedItem.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
        }
      })
    },
    deleteItem: function(id){
      const itemId = `#item-${id}`
      const item = document.querySelector(itemId)  
      item.remove()
    },
    // clear all items
    clearList: function(){
      document.querySelector(UIselectors.itemList).textContent = ''
      document.querySelector(UIselectors.totalCalories).textContent = 0
    },
  
    getSelectors :function(){return UIselectors},
  }
})();


// app controller
const App = (
  function(storageCtrl, itemCtrl,  UICtrl){
    // load event listeners 
    const loadEventListeners = function(){
      // get ui selectors
      const UIselectors = UICtrl.getSelectors()

      // disable submit on enter
      document.addEventListener('keypress', function(e){
        if(e.keyCode === 13 || e.which ===13){
          e.preventDefault()
          return false
        }
      })
      // add event listeners 
      document.querySelector(UIselectors.addMeal).addEventListener('click', addMeal)
    
      document.querySelector(UIselectors.itemList).addEventListener('click', editState)

      document.querySelector(UIselectors.backBtn).addEventListener('click', (e)=>{
        UICtrl.clearEditState()
        e.preventDefault()
      })
      document.querySelector(UIselectors.deleteBtn).addEventListener('click', deleteItem)
      document.querySelector(UIselectors.uptdateBtn).addEventListener('click', updateItem)
      document.querySelector(UIselectors.clearBtn).addEventListener('click', clearList)
    }
    function deleteItem(e){
      // delete from data structure
      itemCtrl.deleteItem()
      // delete from you
      UICtrl.deleteItem(itemCtrl.getCurrentItem().id)
      // update ui state 
      const cals  = itemCtrl.getcals()
      UICtrl.showTotalCalories(cals)   
      UICtrl.clearEditState()
      const items = itemCtrl.getItems()
      if(items.length === 0){
        UICtrl.hideList()
      }

      e.preventDefault()
    }
    function editState(e){
      if(e.target.classList.contains('edit-item')){
        // get list item id
        const listId = e.target.parentNode.parentNode.id; // item-id
        // break the out put to get the id
        const listIdArr = listId.split('-')
        // get actual id
        const id = parseInt(listIdArr[1])
        // get item from array
        const itemToEdit = itemCtrl.getItemById(id)
        UICtrl.editState(itemToEdit.calories, itemToEdit.name, id)
        // set current item
        itemCtrl.setCurrentItem(itemToEdit)
      }
      e.preventDefault()
    }
    function addMeal(e){
      const input = UICtrl.getItemInput()
      if(input.name !== ''&& input.calories !== ''){
        UICtrl.showList()
        itemCtrl.addItem(input.name, input.calories)
        UICtrl.clearFields()
        const cals  = itemCtrl.getcals()
        UICtrl.showTotalCalories(cals)          
      }
      e.preventDefault()
    }
    function updateItem(e){
      const input = UICtrl.getItemInput()
      if(input.name !== ''&& input.calories !== ''){
        itemCtrl.editCurrentItem(input.name, input.calories)
        UICtrl.clearFields()
        itemCtrl.updateItem()
        UICtrl.clearEditState()
        //update in ui
        let editedItem = itemCtrl.getCurrentItem()
        UICtrl.updateItem(editedItem)   
        // re calculate total calories
        const cals  = itemCtrl.getcals()
        UICtrl.showTotalCalories(cals)          
      }
      e.preventDefault()
    }
    function clearList(){
      UICtrl.clearList()
      itemCtrl.clearList()
      UICtrl.hideList()
      UICtrl.clearEditState()
      UICtrl.clearFields()
    }
    // public methods
  return{
    init:function(){
       // clear edit state / set initial state
       UICtrl.clearEditState()  
       // fetch items from data structire
      const items = itemCtrl.getItems() 
  
      if(items.length === 0){
        UICtrl.hideList()
      } else{
        // poulate UI with data
        UICtrl.populateItemList(items)   
      }
      const cals  = itemCtrl.getcals()
      UICtrl.showTotalCalories(cals) 
      loadEventListeners()
    },
   
  }    

})(storageCtrl, itemCtrl, UICtrl);

// initialize app
App.init()
