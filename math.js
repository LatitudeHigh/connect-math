// TODO fix so that it is always whole number division
function division() {
    var b = Randomizer.nextInt(1, 10);
    var c = Randomizer.nextInt(1, 12);
    //make it so a has to be less than 12
  var a = c * b;
    var solution = a/b;
    var correctAnswer = false;

    numberTries = 0;
    while(!correctAnswer && numberTries < 3) { 
      numberTries++;
        var resp = prompt("What is " + a + " ÷ " + b + "? ");
        var answer = parseFloat(resp);

         if(solution == answer) {
        println("Correct!");
        correctAnswer = true;
    } else if (answer == 1.1) {
        println("You quit!");
        correctAnswer = true;
    } else {
        println("Incorrect, try again!");
        correctAnswer = false;
       }
    }

  return correctAnswer;

}


function multiplication() {
    // multiplication
    var a = Randomizer.nextInt(1, 12);
   
    var b = Randomizer.nextInt(1, 12);
    //println(a + "*" + b + " = ");
    var solution = a*b
    var solutionRounded = solution.toFixed(1);
    var correctAnswer = false;

    var numberTries = 0;
    while(!correctAnswer && numberTries < 3) { 
      numberTries++;
        var resp = prompt("What is " + a + " x " + b + "? ");
        var answer = parseFloat(resp);

     
        var answerRounded = answer.toFixed(1);
        if(solutionRounded == answerRounded) {
          println("Correct!");
          correctAnswer = true;
        } else if (answerRounded == 1.1) {
          println("You quit!");
          correctAnswer = true;
            } else {
                println("Incorrect, try again!");
                correctAnswer = false;
            }
    }

  return correctAnswer;
}
function mathQuestions() {
    var num = Randomizer.nextInt(0, 1);
    var answeredCorrectly = false;
    if(num == 0) {
      answeredCorrectly = division();
    } else if(num == 1) {
      answeredCorrectly = multiplication();
    } 

  return answeredCorrectly;
}