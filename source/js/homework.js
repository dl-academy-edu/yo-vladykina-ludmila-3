// Homework-1

// Написать свой первый JS код, создайте 8 переменных с разными типами данных
//  и выведите их в консоль приведя к 3-ем типам: Number, String, Boolean

 let age = 48;
 let drink = 'coffee';
 let chikenFly = false;
 
 console.log(Number(age), String(age), Boolean(age));
 console.log(String(drink), Boolean(drink), Number(drink));
 console.log(Boolean(chikenFly), Number(chikenFly), String(chikenFly));
 

//  Homework-2
// Создать программу, которая запрашивает у
// пользователя число, в консоль выводит числа от 1 до
// до этого числа, но пропускает числа, которые кратны
// (делятся без остатка) 4-м.

// Написать проверку, чтобы если
// пользователь вводил неверные данные, например
// слово вместо числа, то должно вывестись сообщение
// об ошибке.


let num = +prompt('Введите число');
let number = Number(num);

if (Number.isNaN(num)) {
    console.error('Это не число, попробуйте еще раз!');
} else {
    for (let i = 1; i < num; i++) {
        if (i === num) {
            break;
        } else if ((i % 4) === 0) {
            continue;
        } 
        console.log(i);
    }
}

// Написать программу, которая будет получать число и с
// помощью цикла while считать его факториал.

// Написать проверку, чтобы если
// пользователь вводил неверные данные, например
// слово вместо числа, то должно вывестись сообщение
// об ошибке.


let num = +prompt('Введите число для вычисления факториала');

if (Number.isNaN(num)) {
    console.error('Это не число, введите число');
} else {
    let factorial = 1;
    while (num > 1) {
        factorial = factorial * num;
        num--;
    }
    console.log(factorial);
}


// Написать программу, которая будет получать число и
// его степень, с помощью цикла for возвести число в
// степень.

// Написать проверку, чтобы если
// пользователь вводил неверные данные, например
// слово вместо числа, то должно вывестись сообщение
// об ошибке.


let num1 = +prompt('введите число');
let num2 = +prompt('введите степень для этого числа');
let degree;

if (Number.isNaN(num1) || Number.isNaN(num2)) {
	console.error('Это не число, введите число');
}
for (i = 1; i <= num2; i++) {
	degree = Math.pow(num1, num2);
	if (i === num2) {
		console.log(`число ${num1} в степени ${num2} равно ${degree}`);
	}
}


// Написать игру “Угадай число”, для генерации
// случайного числа использовать следующий код:
// let rand = Math.floor(1 + Math.random() * 10);
// Игра должна продолжаться до тех пор, пока
// пользователь не укажет правильное число. Можете
// использовать пустой for или while(true).


let rand = Math.floor(1 + Math.random() * 10);
let num;

while (true) {
	num = +prompt('введите число от 1 до 10');
	if (num === rand) {
			alert('Это победа!'); 
			break;
	} else if (num === null) {
			alert('Возвращайтесь поскорее!');
			break;
	} else {
			alert('В следующий раз повезет!');
            break;
	}
}
