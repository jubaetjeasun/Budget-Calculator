//data module
//data controller

var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    var Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var calculateTotal = function (type) {

        sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;



    };








    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        percentage: -1


    };

    return {

        addItem: function (type, des, val) {

            var newItem, ID;

            //add new Item
            // [ 1,2,5,7] next ID 5 for that problem we use following solution
            //data.allitems[exp][4-1].id + 1

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            else {
                ID = 0;
            }


            //check exp or inc and add new item
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            }
            else if (type === 'inc') {

                newItem = new Income(ID, des, val);
            }

            //push new item to data allitems
            data.allItems[type].push(newItem);

            //returning new item

            return newItem;


        },

        deleteItem: function (type, id) {

            var currentIDs, index;

            currentIDs = data.allItems[type].map(function (current) {

                return current.id;
                //[2,5,7,9]
            });

            index = currentIDs.indexOf(id);

            if (index !== -1) {

                data.allItems[type].splice(index, 1);
            }



        },


        calculatebudget: function () {

            //calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate total budget income - expense
            data.budget = data.totals.inc - data.totals.exp;
            //calculate percentage of total expense
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },


        calculatePercentages: function () {

            data.allItems.exp.forEach(function (curr) {

                curr.calcPercentage(data.totals.inc);
            });

        },

        returnPercentages: function () {
            var newPercentage;
            newPercentage = data.allItems.exp.map(function (curr) {
                return curr.getPercentage();
            });
            return newPercentage;

        },



        getBudget: function () {

            return {
                totalbudget: data.budget,
                totalexp: data.totals.exp,
                totalinc: data.totals.inc,
                expensePercentage: data.percentage

            };


        },


    };


})();

//UI Module
//UI Controller

var UIController = (function () {

    DOMString = {

        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        totalBudgetlabel: '.budget__value',
        expenseLabel: '.budget__expenses--value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageContainer: '.item__percentage',
        monthLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };



    var nodeListForEach = function (list, callback) {

        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }

    };

    var monthandYear = function () {
        var now, months, year;
        now = new Date();
        months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
        month = now.getMonth();
        year = now.getFullYear();
    }


    return {

        getInput: function () {

            return {

                type: document.querySelector(DOMString.inputType).value, //either inc or dec
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            };
        },

        addListItem: function (obj, type) {

            var html, newHtml, element;

            //create html string with placeholder text
            if (type === 'inc') {
                element = DOMString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            else if (type === 'exp') {
                element = DOMString.expenseContainer;
                html = '<div class="item clearfix" id = "exp-%id%" ><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >'
            }

            //replace the placeholder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },


        deleteItem: function (selectedID) {

            var id = document.getElementById(selectedID);
            id.parentNode.removeChild(id);



        },




        clearFeild: function () {
            var feild, feildsArr;

            feild = document.querySelectorAll(DOMString.inputDescription + ',' + DOMString.inputValue);

            feildsArr = Array.prototype.slice.call(feild);

            feildsArr.forEach(function (current, index, array) {
                current.value = "";

            });

            feildsArr[0].focus();


        },


        displaytotalBudget: function (obj) {

            var type;

            obj.totalbudget > 0 ? type = 'inc' : type = 'exp';


            document.querySelector(DOMString.totalBudgetlabel).textContent = formatNumber(obj.totalbudget, type);
            document.querySelector(DOMString.expenseLabel).textContent = formatNumber(obj.totalexp, 'exp');
            document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalinc, 'inc');


            if (obj.totalinc > 0) {
                document.querySelector(DOMString.percentageLabel).textContent = obj.expensePercentage + '%';

            }
            else {
                document.querySelector(DOMString.percentageLabel).textContent = '--';

            }
        },

        displayPercentage: function (percentages) {


            var feilds = document.querySelectorAll(DOMString.expPercentageContainer);




            nodeListForEach(feilds, function (current, index) {
                if (percentages[index] > 0) {

                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }


            });
        },

        displayMonth: function () {

            var now, months, year;
            now = new Date();
            months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMString.monthLabel).textContent = months[month] + ' ' + year;



        },

        changeType: function () {
            var feilds;

            feilds = document.querySelectorAll(DOMString.inputType + ',' + DOMString.inputDescription + ',' + DOMString.inputValue);

            nodeListForEach(feilds, function (curr) {
                curr.classList.toggle('red-focus');

            });

            document.querySelector(DOMString.inputBtn).classList.toggle('red');

        },



        getDOMString: function () {

            return DOMString;
        }

    };






})();


//Global App controller

var appController = (function (budgetCntrl, uicntrl) {



    var inputEventListener = function () {

        var DOM = uicntrl.getDOMString();

        document.querySelector(DOM.inputBtn).addEventListener("click", cntrlAddItem);


        document.addEventListener('keypress', function (event) {

            if (event.keycode === 13 || event.which === 13) {
                cntrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener("click", cntrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', uicntrl.changeType);

    };




    var budgetInfo = function () {

        //1.calculate the budget
        budgetCntrl.calculatebudget();



        //2.return the budget
        var returnBudget;
        returnBudget = budgetCntrl.getBudget();


        //3.update budget to the UI
        // uicntrl.displayBudget(returnBudget);
        uicntrl.displaytotalBudget(returnBudget);

    };



    var updatePercentage = function () {
        var percentageValue;
        //calculate percentage
        budgetCntrl.calculatePercentages();

        //get the percentage value
        percentageValue = budgetCntrl.returnPercentages();


        // send percentage value to the UI
        uicntrl.displayPercentage(percentageValue);
    };


    var cntrlAddItem = function () {


        var input, newItem;

        //1.get input data from feild
        input = uicntrl.getInput();





        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {


            //2.add the item to the budget controller
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);

            //3.add the item to the UI 

            uicntrl.addListItem(newItem, input.type);


            //4.clear feild

            uicntrl.clearFeild();

            //calculate the budget info

            budgetInfo();

            //calculate and show new percentage

            updatePercentage();
        }


    };


    var cntrlDeleteItem = function (event) {

        var targetElement, splitID, type, ID;

        targetElement = (event.target.parentNode.parentNode.parentNode.parentNode.id);

        if (targetElement) {

            //delete the item from data structure

            splitID = targetElement.split('-');

            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCntrl.deleteItem(type, ID);

            //delete the item from the UI

            uicntrl.deleteItem(targetElement);


            //calculate and show new budget 

            budgetInfo();


            //calculate and show new percentage

            updatePercentage();
        }

    };


    return {
        init: function () {
            console.log("App started");
            uicntrl.displayMonth();
            uicntrl.displaytotalBudget({

                totalbudget: 0,
                totalexp: 0,
                totalinc: 0,
                expensePercentage: -1

            });
            inputEventListener();
        }
    };





})(budgetController, UIController);

appController.init();