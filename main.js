class Calculator {
  constructor (digits, buttons) {
    this.special = {'C': 'clear', 'N': 'negate', "E": 'evaluate', 'D': "decimal"}
    this.operation = {'PLUS': '+', 'MINUS': '-', "MULTI": '*', 'DIVBY': "/"}
    this.digits = digits
    this.buttons = buttons
    this.attach_buttons()
    this.keyin()
    this.expr = ""
    this.next = false
    this.err = false
    this.max = 16
  }

  attach_buttons () {
    for (let button of this.buttons) {
      button.addEventListener('click', ev => {
        let value = ev.target.value
        this.entry(value)
        console.log(this.expr)
      })
    }
  }

  keyin() {
    window.addEventListener('keypress', ev => {
      let key = ev.key

      for (let button of this.buttons) {
        if(key.match(/[0-9]/g)) {
          if(button.value === key) {
            button.click()
            return
          }
        }
        if(key.match(/[\+\-*\/]/g)) {
          for (let operation in this.operation) {
            if(key === this.operation[operation] && button.value === operation) {
              button.click()
              return
            }
          }
        }
        if(key === "Enter" && button.value === "E") {
          button.click()
          return
        }
      }
    })
  }

  entry (value) {
    if(!this.capture(value) && !this.sign(value)) {
      if(this.next) {
        this.digits.innerHTML = value
        this.next = false
        let expr = this.expr.split(" ");
        if(expr[2] != "") {
          this.expr = ""
        }
        return true
      }
      this.digits.innerHTML = this.check_zero()
        ? value
        : this.digits.innerHTML + value;
      if(this.maxed(this.digits.innerHTML)) {
        this.err = true
        this.digits.innerHTML = "Overflow"
      }
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
    this.expr = ""
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
    let expr = this.expr.split(" ")
    if(this.next) {
      this.next = false
      if(expr.length == 3) {
        this.expr = ""
      }
      this.digits.innerHTML = "0."
      return true
    }
    if(!curr.match(/\./g)) {
      this.digits.innerHTML = this.digits.innerHTML + "."
    }
    return true
  }

  evaluate () {
    let curr = this.digits.innerHTML
    let expr = this.expr.split(" ")
    let result = ""

    if(expr.length == 1) {
      return true
    }

    this.next = true;

    if(expr[2] == "")
      this.expr = this.expr + `${curr}`
    else
      this.expr = this.expr


    expr = this.expr.split(" ")

    result = eval(this.expr)

    if(this.maxed(result)) {
      this.err = true
      this.digits.innerHTML = "Overflow"
      return true
    }

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

  maxed(value) {
    value = value.toString()
    value = value.replace("/[^0-9\\s+]/")
    return value.length > 16
  }
}

let digits = document.getElementById('digits')
let buttons = document.querySelectorAll('button')
let Main = new Calculator(digits, buttons)
