import _ from 'lodash'
import './style/reset.css'
import './style/base.scss'

function createDivElement () {
  const divElement = document.createElement('div')
  divElement.innerHTML = _.join(['kobe', 'cpul'], ' ')
  return divElement
}

const divEle = createDivElement()
document.body.appendChild(divEle)

console.log('测试开发环境调试模式22')
// 测试babel编译

class Person {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  say () {
    console.log(`my name is ${this.name}, and age is ${this.age}`)
  }
}

const xm = new Person('xiaoming', 20)
xm.say()
