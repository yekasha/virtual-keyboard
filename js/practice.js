// const Animal = {
//     name: 'Animal',
//     age: 5,
//     hasTail: true
// }


// классы удобны - полноценное наследование
class Animal {
  static type = 'ANIMAL'
  // доступна только у класса, не у обьекта

  constructor(options) {
    this.name = options.name
    this.age = options.age
    this.hasTail = options.hasTail
  }

  voice() {
   console.log('I am animal')
  }
}

//  не просто обьект, а наследник класса
const animal = new Animal({
  name: 'Animal',
  age: 5,
  hasTail: true,
});

class Cat extends Animal {
  static type = 'CAT'

  constructor(options) {
    // appends parent options
    super(options)
    this.color = options.color
  }
  // можно переписать методы
  voice() {
    super.voice()
    console.log('Meow')
  }

  // а тут мы к ним обращаемся
  get ageInfo() {
    return this.age * 7
  }

  // тут мы меняем данные
  set ageInfo(newAge) {
    this.age = newAge
  }
}

const cat = new Cat({
  name: 'Whiskers',
  age: 2,
  hasTail: true,
  color: 'black'
});


class Component {
  constructor(selector) {
    // c $ пишут дом-ноды, приватные variables 
    this.$el = document.querySelector(selector)
  }

  hide() {
    this.$el.style.display = 'none'
  }

  show() {
    this.$el.style.display = 'block'
  }
}

class Box extends Component {
  constructor(options) {
    super(options.selector)

    this.$el.style.width = this.$el.style.height = options.size + 'px'
    this.$el.style.background = options.color 
  }
}

const box = new Box({
  selector: '#div',
  size: 100,
  color: 'red'
})


class Circle extends Box {
  constructor(options){
    super(options)

    this.$el.style.borderRadius = '50%'
  }
}

const circle = new Circle({
  selector: '#circle',
  size: 90,
  color: 'green'
})