document.addEventListener("DOMContentLoaded", () => {
  let buttons = document.getElementsByClassName("button");
  let screen = document.getElementById("screen");

  let clr = document.getElementById("clr");
  let Enter = document.getElementById("Enter");
  let bkspace = document.getElementById("backspace");

  Array.from(buttons).forEach((button) => {
    button.addEventListener("click", () => {
      screen.innerText += button.innerHTML;
      button.classList.add("blink");

      setTimeout(() => {
        button.classList.remove("blink");
      }, 200);
    });
  });

  clr.addEventListener("click", () => {
    screen.innerText = "";
    clr.classList.add("blink");

    setTimeout(() => {
      clr.classList.remove("blink");
    }, 100);
  });

  Enter.addEventListener("click", () => {
    try {
      screen.innerText = evaluate(screen.innerText) ?? "undefined";
    } catch (error) {
      screen.innerText = "Invalid !";
      setTimeout(() => {
        screen.innerText = "";
      }, 500);
    }
    Enter.classList.add("blink");

    setTimeout(() => {
      Enter.classList.remove("blink");
    }, 100);
  });
  bkspace.addEventListener("click", () => {
    screen.innerText = screen.innerText.slice(0, -1);
    bkspace.classList.add("blink");

    setTimeout(() => {
      bkspace.classList.remove("blink");
    }, 100);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      try {
        screen.innerText = evaluate(screen.innerText);
      } catch {
        screen.innerText = "Invalid !";
        setTimeout(() => {
          screen.innerText = "";
        }, 500);
      }
    } else if (event.key === "Backspace") {
      screen.innerText = screen.innerText.slice(0, -1);
    } else if (!isNaN(event.key) || isoperator(event.key)) {
      let key = document.getElementById(event.key);

      screen.innerText += event.key;

      key.classList.add("blink");

      setTimeout(() => {
        key.classList.remove("blink");
      }, 100);
    } else if (
      !(
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        event.key == "ArrowLeft" ||
        event.key == "ArrowRight"
      ) &&
      isNaN(event.key)
    ) {
      let screen = document.getElementById("screen");
      screen.classList.add("shake");
      setTimeout(() => {
        screen.classList.remove("shake");
      }, 30);
    }
  });
});

function isoperator(key) {
  return ["+", "-", "/", "*"].includes(key);
}


// function evaluation logic 

function infixToPostfix(expression) {
  let output = [];
  let operators = [];
  let precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2
  };

  for (let i = 0; i < expression.length; i++) {
      let char = expression[i];

      if (!isNaN(char)) {
          let num = '';
          while (!isNaN(char)) {
              num += char;
              char = expression[++i];
          }
          output.push(num);
          i--;
      } else if (char in precedence) {
          while (operators.length && precedence[operators[operators.length - 1]] >= precedence[char]) {
              output.push(operators.pop());
          }
          operators.push(char);
      }
  }

  while (operators.length) {
      output.push(operators.pop());
  }

  return output;
}

function evaluatePostfix(postfix) {
  let stack = [];

  for (let i = 0; i < postfix.length; i++) {
      let char = postfix[i];

      if (!isNaN(char)) {
          stack.push(parseInt(char, 10));
      } else {
          let b = stack.pop();
          let a = stack.pop();
          switch (char) {
              case '+':
                  stack.push(a + b);
                  break;
              case '-':
                  stack.push(a - b);
                  break;
              case '*':
                  stack.push(a * b);
                  break;
              case '/':
                  stack.push(a / b);
                  break;
          }
      }
  }

  return stack.pop();
}

function evaluate(expression) {
  try {
      let postfix = infixToPostfix(expression);
      return evaluatePostfix(postfix);
  } catch (error) {
      return 'Error: please input valid';
  }
}


