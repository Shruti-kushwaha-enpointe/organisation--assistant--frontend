











console.log("hello, shruti");

let role ="developer";
console.log("I am a " + role);


//old way 
 var a = 10;
 var a = 20;
 console.log(a); //output : 20



//modern way 
let b=50;
//let b = 60 ; error you can not  redeclare let in the same scope
b=60; // but you can reassign it 

if (true){
    let b = 100;// allowed this is a diffrent block scope
    
}