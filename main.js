class Calculator {
  constructor (digits, buttons) {
    this.special = {'C': 'clear', 'N': 'negate', "E": 'evaluate', 'D': "decimal"}
    this.operation = {'PLUS': '+', 'MINUS': '-', "MULTI": '*', 'DIVBY': "/"}
    this.digits = digits
    this.attach_buttons(buttons)
    this.expr = ""
    this.next = false
    this.err = false
  }

  attach_buttons (buttons) {
    for (let button of buttons) {
      button.addEventListener('click', ev => {
        let value = ev.target.value
        this.entry(value)
      })
    }
  }

  entry (value) {
    if(!this.capture(value) && !this.sign(value)) {
      if(this.next) {
        this.digits.innerHTML = value
        this.next = false
        return true
      }
      this.digits.innerHTML = this.check_zero()
        ? value
        : this.digits.innerHTML + value
    }
  }

  capture (value) {
    if(this.err && value != "C") {
      return true
    }
    if(value in this.special) {
      eval("this." + this.special[value] + "()")
      return true
    }
  }

  sign (value) {
    let curr = this.digits.innerHTML
    if(value in this.operation) {
      this.expr = curr + ` ${this.operation[value]} `
      this.next = true
      return true
    }

  }

  negate () {
    let curr = this.digits.innerHTML
    if(curr.charAt(0) === "-") {
      this.digits.innerHTML = curr.substr(1)
    } else {
      this.digits.innerHTML = "-" + this.digits.innerHTML
    }
    return true
  }

  clear (value) {
    this.digits.innerHTML = "0"
    this.expr = ""
    this.err = false
    this.next = false
  }

  decimal (value) {
    let curr = this.digits.innerHTML
    if(!curr.match(/\./g)) {
      this.digits.innerHTML = this.digits.innerHTML + "."
    }
    return true
  }

  evaluate () {
    let curr = this.digits.innerHTML
    let expr = this.expr.split(" ")
    let result = ""

    if(expr[2] == "")
      this.expr = this.expr + `${curr}`
    else
      this.expr = this.expr


    expr = this.expr.split(" ")

    result = eval(this.expr)
    if(result == "Infinity") {
      this.err = true
      this.digits.innerHTML = "Error: Cannot Divide By Zero"
      return true
    }

    this.digits.innerHTML = result
    this.expr = result + ` ${expr[1]} ` + expr[2]
  }

  check_zero() {
    return this.digits.innerHTML == "0";
  }
}

let digits = document.getElementById('digits')
let buttons = document.querySelectorAll('button')
let Main = new Calculator(digits, buttons)
