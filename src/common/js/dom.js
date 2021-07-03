/** 定义通用DOM操作方法 */

/**
 * 添加class
 * @param el 需要添加class的对象
 * @param className 待添加的class名称
 */
export function addClass(el, className) {
  // 判断待添加的class是否已存在
  if (hasClass(el, className)) {
    return
  }

  // 拆分el已存在的class列表
  let existClasses = el.className.split(' ')
  // 将待添加的class加入该列表
  existClasses.push(className)

  // 将添加了新的class的列表重新回传到el中
  el.className = existClasses.join(' ').substring(1)
}

/**
 * 判断是否存在class
 * @param el 需要被判断的对象
 * @param className 带判断是否存在的class名称
 */
export function hasClass(el, className) {
  // 定义正则来判断class是否存在
  // \\s表示空白字符
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')

  // 使用定义好的正则表达式对el的所有className进行匹配，直接返回匹配结果
  return reg.test(el.className)
}

/**
 * 获取DOM元素的data值
 * @param el DOM元素
 * @param name data名称
 * @param val data值
 * @returns {*}
 */
export function getData(el, name, val) {
  // data全称
  name = 'data-' + name

  // 判断是否存在传值
  if (val) {
    // 存在则赋值并返回
    return el.setAttribute(name, val)
  } else {
    // 不存在则直接返回
    return el.getAttribute(name)
  }
}

/**
 * 验证获取浏览器对css3的支持前缀
 * @type {function()}
 */
let vendor = (() => {
  // 创建一个预备元素用于检测浏览器对于css3的兼容性
  let elementStyle = document.createElement('div').style

  // 创建一个css3兼容性列表，用于匹配当前浏览器的兼容性情况
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // 遍历兼容性列表
  for (let key in transformNames) {
    // 如果存在对应属性，则表示当前浏览器支持该前缀，直接返回
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  // 都不支持说明浏览器版本太老
  return false
})()

/**
 * 为样式添加兼容性前缀
 * @param style 原始样式
 * @returns {*}
 */
export function prefixStyle(style) {
  // 判断是否找到对应兼容性
  if (vendor === false) {
    return vendor
  }

  // 判断是否直接为默认样式
  if (vendor === 'standard') {
    return style
  }

  // 对正确兼容性做拼接
  // 因为在js中对于例如webkit-transform的书写方式是webkitTransform，所以需要将样式的首字母大写在拼接其他字符
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
