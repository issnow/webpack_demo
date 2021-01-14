/**
 * 热更新
 * 再修改代码，不会造成整个页面的刷新
 */
console.log(213234)
if(module && module.hot) {
  module.hot.accept()
}

import fn from 'Com/fn'
fn()

// 再在入口文件中引入此 less
import './index.less'
//index.js
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

const dog = new Animal('dog');
console.log('fff')
$('#btn').on('click', function(){
  console.log(import('./console') instanceof Promise)
  // 按需加载js
  import('./console').then(d=>d.default())
})

console.log(BOOLEAN, 'BOOLEAN')
console.log(NUM, 'NUM')
console.log(STRING, 'STRING')
let type = Object.prototype.toString
console.log(ARR,type.call(ARR), 'ARR')
console.log(OBJ, 'OBJ')

// 请求数据,使用代理(proxy)达到跨域的效果
// fetch('/api/book/10/2').then(res=>res.json()).then(res=>{
//   console.log(res, 'fetch')
// })
fetch('/get/data').then(d=>d.json()).then(res=>{
  console.log(res, 'fetch')
})
fetch('/api/book/10/6').then(d=>d.json()).then(s=>{
  console.log(s, 'book')
})
fetch('/api/book/10/8').then(d=>d.json()).then(s=>{
  console.log(s, 'book')
})

