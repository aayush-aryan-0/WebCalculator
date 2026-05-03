
let angleMode="";

export function evaluateinfix(eq,angleUnit){
    angleMode=angleUnit;
    angleMode=angleMode.toLowerCase();
    if(!(angleMode==="deg"||angleMode==="rad"))throw new Error("Angle unit is invalid")
    return evaluatepostfix(InfixToPostfix(tokenize(eq)))
}
function tokenize(exp){
    const tokens=[];
    exp=exp.trim();
    let i=0;
    while(i<exp.length){
        if(exp[i]===" "){ 
            i++;
            continue;
        }
        if(exp[i]==="π"){
            tokens.push(Math.PI)
            i++;
            continue;
            
        }
        if(exp[i]==="e"){
            tokens.push(Math.E)
            i++;
            continue;
        }
        if(isDigit(exp[i])){
            let num="";
            while (i<exp.length&&(isDigit(exp[i]) || exp[i]===".")){
                num+=exp[i];
                i++;
            }
            tokens.push(num);
            continue;
        }
        if(isAlphabet(exp[i])){
            let func=""
            while(i<exp.length&&(isAlphabet(exp[i]))){
             func+=exp[i];
             i++;
            }
            tokens.push(func);

            continue;
        }
        if("+-/*%!()^√".includes(exp[i])){

            tokens.push(exp[i]);
            i++;
            continue;
        }
        throw new Error("Invalid Character");
    }
    return tokens;
}
function isBinaryOperator(op){
    return (["+","-","/","*","^","mod"].includes(op)) ;
}
function isFunction(op) { return ["log","ln","asin","acos","atan", "√", "sin", "cos", "tan"].includes(op); }
function isUniaryOperator(op) { return ["!", "%"].includes(op); }

function prefrence(op){
    if(op==='+' || op==='-')
        return 1;
    if(op==='*'|| op==='/' || op==="mod" )
        return 2;
    if(op==='^')
        return 3;



    return 0;
}
function InfixToPostfix(exp){
    if(!(exp instanceof Array)){
        throw new Error("Needs to be tokenized");
    }
       
    let postfix = []
    let stack=[]
 
    for(let i = 0; i < exp.length; i++){
        if ((exp[i] === '-' || exp[i] === '+') && 
            (i === 0 || exp[i - 1] === '(' || isBinaryOperator(exp[i - 1]))) {
            postfix.push(0); 
        }
        if (!isNaN(Number(exp[i]))){
            postfix.push(Number(exp[i]))
            continue
        }
         if (isFunction(exp[i])) {
            stack.push(exp[i]);
            continue;
        } 
         if (isUniaryOperator(exp[i])) {
            postfix.push(exp[i]);
            continue;
        }
        if (exp[i] === "("){
            stack.push(exp[i])
            continue;
        }
        if( exp[i] === ")"){
            while (stack.length>0 && (stack[stack.length-1] != "(")){
                postfix.push(stack.pop())
            }
            stack.pop();
            if(stack.length && isFunction(stack[stack.length - 1])){
                postfix.push(stack.pop());
            }
            continue;
        }           
        if (isBinaryOperator(exp[i])){
            while (
                stack.length>0 && (isBinaryOperator(stack[stack.length-1]))&&
                (
                        (prefrence(stack[stack.length-1]) > prefrence(exp[i])) ||  
                    (
                        (prefrence(stack[stack.length-1]) === prefrence(exp[i])) &&
                        (exp[i] !== '^')
                    )
                )
            ){
                postfix.push(stack.pop())
            }
            stack.push(exp[i]);
            continue;
        }

        throw new Error("Unknown Token");
       
    }       
    
    while (stack.length>0){
        postfix.push(stack.pop())
    }
    return postfix
}
function isAlphabet(char) {
  return /^[A-Za-z]$/.test(char);
}
function isDigit(char) {
  return /^[0-9]$/.test(char);
}
function evaluate(n1,n2,op){
     switch(op){
        case "+": 
            return n1+n2
        case "-":
            return n1-n2
        case "/":
            if(n2===0) throw new Error("Division by Zero is Undefined") ;            
            return n1/n2
        case "mod":
            return n1%n2
        case "*":
            return n1*n2
        case "^": 
            return Math.pow(n1,n2)
        default:
            throw new Error("Invalid oprator")
     }
}
function uninaryEvaluate(num ,op){
    let angleConv=1;
    if(angleMode==="deg") {
        angleConv=Math.PI / 180;
    } 
   switch (op){
        case "log": 
            return Math.log10(num);
        case "ln": 
            return Math.log(num);
        case "√":
            return Math.sqrt(num);
        case "sin": 
            return Math.sin(num * angleConv);
        case "cos":  
            return Math.cos(num * angleConv);
        case "tan":
            return Math.tan(num * angleConv);
        case "asin": 
            return Math.asin(num * angleConv);
        case "acos":  
            return Math.acos(num * angleConv);
        case "atan":
            return Math.atan(num * angleConv);
        case "!":
            return factorial(num) ;
        case "%":
            return num/100;
        default:
            throw new Error("Invalid oprator")
             
    }
}
function factorial(num){
    if((num<0 || !Number.isInteger(num)))
        throw new Error("Factorial of invalid number ");
    let fac=1;
    for(let i=2;i<=num;i++){
        fac*=i;
    }
    return fac;
}
function evaluatepostfix(postfix){
    let exp=[];
    for (let i of postfix){
        if(!isNaN(Number(i)))
            exp.push(i);
        else{
            if (isFunction(i) || isUniaryOperator(i)) {
                if (exp.length < 1) throw new Error("Expression Error");

                exp.push(Number(uninaryEvaluate(exp.pop(), i)));
            }
            else if(isBinaryOperator(i)){
                if (exp.length>=2) {
                    let n2=exp.pop();
                    let n1=exp.pop();
                    exp.push(evaluate(n1,n2,i));
                }
                else
                    throw new Error("Expression Error");
            }
        }
    }
    return exp.pop();
}    
    

