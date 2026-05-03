import{evaluateinfix} from './calc.js';

let expression="";
let isAnswered=false;
let answer=0;
const display=document.getElementById("display");

document.querySelectorAll(".delButton").forEach(btn=>{btn.addEventListener('click',remove)});
document.querySelectorAll(".clearButton").forEach(btn=>{btn.addEventListener('click',clearAll)});
document.querySelectorAll(".calButton").forEach(btn=>{btn.addEventListener('click',calculate)});

//input buttons
document.querySelectorAll('.appending').forEach(btn => {
    btn.addEventListener('click', (btn)=>{        
        const func = btn.target.textContent;
         console.log('appending button selected',func,btn.textContent,btn)

        if (["sin", "cos", "tan", "log", "√","ln","asin", "acos", "atan"].includes(func)) {
            append(func + "(");
        }
        else if(func==="10ˣ"){
            append("10^");
        }
        else if(func==="eˣ"){
            append("e^");
        }
        else if(func==="×"){
            append("*");
        }
        else if(func==="÷"){
            append("/");
        }
        else {
            append(func);
        }
    })
});

//select advance layout toggle
document.getElementById("select").addEventListener("change",(select)=>{
    const option=select.target.value;
    if(option==="basic"){
        document.getElementById("advance-button-container").classList.remove("active");
        document.getElementById("basic-button-container").classList.add("active");

    }
    else if(option==="advance"){
        document.getElementById("basic-button-container").classList.remove("active");
        document.getElementById("advance-button-container").classList.add("active");
    }
})

//toggle angle mode
document.getElementById("angleMode").addEventListener("click",(angleMode)=>{

    const angleModeBtn=angleMode.target;

    angleModeBtn.classList.toggle("deg-btn");
    angleModeBtn.classList.toggle("rad-btn");

    if(angleModeBtn.classList.contains("rad-btn")){
        
        angleModeBtn.textContent="RAD";

    }
    else if(angleModeBtn.classList.contains("deg-btn")){
        
        angleModeBtn.textContent="DEG";

    }

})

//inverse button
document.getElementById("inv").addEventListener("click",(inv)=>{
    const sinBtn = document.getElementById("sinBtn");
    const cosBtn = document.getElementById("cosBtn"); 
    const tanBtn = document.getElementById("tanBtn");
    const lnBtn  = document.getElementById("lnBtn");
    const logBtn = document.getElementById("logBtn");

    inv.target.classList.toggle("inv-on-btn");

    if(inv.target.classList.contains("inv-on-btn")){
        sinBtn.textContent="asin";
        cosBtn.textContent="acos";
        tanBtn.textContent="atan";
        lnBtn.textContent="10ˣ";
        logBtn.textContent="eˣ";
        
    }
    else{
        sinBtn.textContent="sin";
        cosBtn.textContent="cos";
        tanBtn.textContent="tan";
        lnBtn.textContent="log";
        logBtn.textContent="ln";
    }
})


//keyboard
document.addEventListener("keydown",(e)=>{
    if (document.activeElement !== display) return;
    const allowedkeys="1234567890-+/*()%^!.";
    const controlKeys = [
        "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        "Tab"
    ];
    const key=e.key;
    if(controlKeys.includes(key))return;

    e.preventDefault();

    if(allowedkeys.includes(key)) append(key);
    else if(key==="Enter"||key==="=") calculate();
    else if(key==="Backspace") remove();
    else if(key==="Delete") {
        const start = display.selectionStart ?? expression.length;
        const end = display.selectionEnd ?? expression.length;
       
        if(start===end){
            expression=expression.slice(0,start)+expression.slice(start+1);
            setCursor(start);
        }
        else{
            expression=expression.slice(0,start)+expression.slice(end)
            setCursor(start);
        }

        updateDisplay();
        setCursor(start);
    }
    else if(key==="Escape") clearAll();
});

//functions 

function append(input){
    
    console.log("append() triggered");

    const start = display.selectionStart ?? expression.length;
    const end = display.selectionEnd ?? expression.length;

    if(isAnswered&&!isNaN(Number(input))){
        
        clearAll();
        
        
    }
    isAnswered=false;

    const operator=['+','-','*','/','.','%','!'];
    if(operator.includes(input)&&operator.includes(expression.slice(start-1,start))){
        if (input==='-'){
            append('(');
            append('-');
        }
        return;
    }
    if(expression===""&&operator.includes(input)&&input!=='-')return;
    if(input==='.'){
        let leftPart=expression.slice(0,start);
        let lastNum=leftPart.split(/[\+\-\*\/%]/).pop();
        if(lastNum.includes('.')) return;        
    }
    if(input===")"&&(expression===""||expression.split('(')<=expression.split(')')||expression==="(")) return;
   

    expression=expression.slice(0,start)+input+expression.slice(end);
    updateDisplay();
    setCursor(start+input.length);

}
function calculate(){
    console.log("calculate triggred");
    console.log("inside calculate(): expression=",expression);
    if(!expression) return;
    if(!/[0-9)!πe]/.test(expression.slice(-1))) return;
    try{
        console.log("calculate() inside try-catch")
        answer=evaluateinfix(expression,angleMode.textContent);
        console.log(answer);
        expression=answer.toString();
        isAnswered=true;
        if(expression==="Infinity"){
            throw new Error("Cannot divde by zero");
        }
        updateDisplay();

    }
    catch(error){
        console.error(error)
        display.expression=error.message;
        setTimeout(clearAll,1000);

    }
    
    
}
function remove(){
    console.log("remove() triggered");
    const start = display.selectionStart ?? expression.length;
    const end = display.selectionEnd ?? expression.length;
    if(start===0&&end===0)return;
    if(start===end){
        expression=expression.slice(0,start-1)+expression.slice(end);
        setCursor(start-1);
    }
    else{
        expression=expression.slice(0,start)+expression.slice(end)
        setCursor(start);
    }
    
    updateDisplay();
}

function clearAll(){
    console.log("clear() triggred")
    expression="";
    updateDisplay();
}

function updateDisplay(){
    display.value=expression.replace(/\*/g, '×').replace(/\//g, '÷');

    console.log("display updated",display.expression)
}

function setCursor(pos) {
    requestAnimationFrame(() => {
        display.focus();
        display.setSelectionRange(pos, pos);
    });
}

