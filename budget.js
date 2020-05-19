// budget controller
var budgetcontroller= (function(){
var Expense = function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
};
Expense.prototype.calcpercentage =  function(totalincome){
if(totalincome>0){
    this.percentage=Math.round((this.value/totalincome)*100);
}else this.percentage= -1;

this.percentage=Math.round((this.value/totalincome)*100);

};
Expense.prototype.getpercentage = function(){
   return  this.percentage;
}; 


var Income = function(id,description,value){ 
    this.id=id;
    this.description=description;
    this.value=value;
};
var calculatetotal=function(type){
var sum=0;
data.allItem[type].forEach(function(cur){
    sum+=cur.value;

});
data.total[type]=sum;


};


var data={
allItem:{
exp:[],
inc:[]

},total:{
    exp:0,
    inc:0
},
budget:0,
percentage:-1


}

return {
addItem:function(type,des,val){
  var newItem,ID;
if(data.allItem[type].length>0){
    ID=data.allItem[type][data.allItem[type].length-1].id+1;
}else {ID=0;} 

 
  if(type==='inc'){
      newItem = new Income(ID,des,val);
  }else if(type==='exp'){
      newItem=new Expense(ID,des,val);
  }
data.allItem[type].push(newItem);
return newItem;

},
deleteItem: function(type,id){
    var ids,index;
    
 ids = data.allItem[type].map(function(current){

return current.id;


  });
 index=ids.indexOf(id);
if(index!==-1){
  data.allItem[type].splice(index,1);
}




},





calculatebudget:function(){
// calculate total budget
calculatetotal('exp');
calculatetotal('inc');
//calculate budget inc-exp
data.budget=data.total.inc-data.total.exp;
// calculate %
if(data.total.inc>0){
    data.percentage=Math.round((data.total.exp/data.total.inc)*100);

}else data.percentage=-1;



},
calculatepercentage:function(){


data.allItem.exp.forEach(function(cur){

cur.calcpercentage(data.total.inc);



});


},


getpercentages:function(){


    var allperc=data.allItem.exp.map(function(cur){
        return cur.getpercentage();


    });
return allperc;

},


getbudget:function(){
   return {
       budget:data.budget,
       totalInc:data.total.inc,
       totalExp:data.total.exp,
       totalpecentage:data.percentage



   };



},



testing: function(){
console.log(data);
}

};





})();



















//UI controller
var UIcontroller=(function(){
    var DOMstring={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__Btn',
        incomecontainer:'.income__list',
        expensecontainer:'.expenses__list',
        budgetlabel:'.budget__value',
        incomelabel:'.budget__income--value',
        expenselabel:'.budget__expenses--value',
        pecentagelabel:'.budget__expenses--percentage',
        container:'.container'


    };


   return {
      
              getInput: function(){

                return {
                     type: document.querySelector(DOMstring.inputType).value,
                    description: document.querySelector(DOMstring.inputDescription).value,
                      Value: parseFloat(document.querySelector(DOMstring.inputValue).value)
                };
              
         
       },
      addListitem : function(obj,type){
      var html,newHtml,element;
      //create html string with placeholder
      if(type==='inc'){
          element=DOMstring.incomecontainer;
          html =  '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">    <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      }else if(type==='exp'){
          element=DOMstring.expensecontainer;
          html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix">       <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace the placeholder text with some actual data
      newHtml=html.replace('%id%',obj.id);
      newHtml=newHtml.replace('%description%',obj.description);
      newHtml=newHtml.replace('%value%',obj.value);

     document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


      },
    clearfields:  function() {
     var fields,fieldsarr;
     fields=document.querySelectorAll(DOMstring.inputDescription + ',' +DOMstring.inputValue);
     fieldsarr=Array.prototype.slice.call(fields);
     fieldsarr.forEach(function(current,index,array){
      current.value="";
      fieldsarr[0].focus();
     });



    },
    deleteListItem: function(selectorID){
var el=document.getElementById(selectorID);
el.parentNode.removeChild(el);



    },
    displayBudget:function(obj){
       document.querySelector(DOMstring.budgetlabel).textContent=obj.budget;
       document.querySelector(DOMstring.incomelabel).textContent=obj.totalInc;
       
       document.querySelector(DOMstring.expenselabel).textContent=obj.totalExp;
       document.querySelector(DOMstring.pecentagelabel).textContent=obj.percentage;





    },

   



       getDOMstring: function(){
           return DOMstring;
       }
   };



})();













// total controller
var controller=(function(budgetctrl,UIctrl){

    var setUpeventListner = function(){
        var DOM = UIctrl.getDOMstring();
       // document.querySelector(DOM.InputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.which===13 ||event.keyCode===13){
            ctrlAddItem();
            
            
            }
            
            
            });
        document.querySelector(DOM.container).addEventListener('click',ctrldelete);



   };
  var updatebudget= function(){
        budgetctrl.calculatebudget();
// return budget
var budget=budgetctrl.getbudget();
UIctrl.displayBudget(budget); 
updatepercentages();

};
var updatepercentages =function(){

budgetctrl.calculatepercentage();


var percentage =  getpercentages();

console.log(percentage);



}; 




 var ctrlAddItem = function(){
     

//give field input data
 var input = UIctrl.getInput();
if(input.description!=="" && !isNaN(input.Value) && input.Value>0){
//add item to budgetcontroller
newItem=budgetctrl.addItem(input.type,input.description,input.Value);
// add item to UI
 UIctrl.addListitem(newItem,input.type);
// clear the field
UIctrl.clearfields();
//update budget
updatebudget();
}


 

 };
 var ctrldelete=function(event){
var itemid,splitID;
itemid= event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemid){
splitID=itemid.split('-');
type=splitID[0];
ID=parseInt(splitID[1]);



//delete item from datastructure
budgetctrl.deleteItem(type,ID);



//delete item from UI
UIctrl.deleteListItem(itemid);



//update and show
updatebudget(); 

}
updatepercentages();

 };


return {
      init: function(){
         console.log('started');
          setUpeventListner();
      }


};








})(budgetcontroller,UIcontroller);

controller.init();
