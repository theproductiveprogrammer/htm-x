'use strict'

/*    way/
 * create an element with the given tag and add the
 * attributes and children
 */
function h(tag, attr, children) {
  if(!tag) return document.createElement('div')

  if(typeof attr!='object'||Array.isArray(attr)||isNode(attr)) {
    children = attr
    attr = {}
  }

  tag = xtract(tag, attr)

  let e = document.createElement(tag)

  addAttributes(e, attr)
  addChildren(e, children)

  e.c = function() {
    e.innerHTML = ""
    addChildren(e, Array.prototype.slice.call(arguments))
    return e
  }

  return e
}

/*    understand/
 * The tag can be a 'short-form' like 'div#id.class1.class2'
 * and the attributes can contain 'classes' and 'class'
 * values.
 *    way/
 * We 'standardize' classes/class attribute to 'class'
 * and then we break up and add any additional classes
 * and id
 */
function xtract(tag, attr) {
  if(attr.class && attr.classes) attr.class += " "+attr.classes
  else if(attr.classes)  attr.class = attr.classes
  else if(!attr.class) attr.class = ""
  delete attr.classes

  tag = tag.replace(/#/g, ".#")
  let s = tag.split('.')
  tag = s.shift()
  if(!tag) tag = "div"
  for(let i = 0;i < s.length;i++) {
    if(s[i][0] == '#') {
      if(!attr.id) attr.id = s[i].substring(1)
    } else {
      attr.class += " " + s[i]
    }
  }
  if(!attr.class) delete attr.class

  return tag
}

/*    way/
 * append classes, styles, event listeners, and attributes
 * to the element
 */
function addAttributes(e, attr) {
  if(!attr) return

  for(let k in attr) {

    if(k == 'class') {

      e.className = attr[k]

    } else if(k == 'style') {

      let style = attr[k]
      if(typeof style == 'string') e.style.cssText = style
      else for(let s in style) e.style.setProperty(s, style[s])

    } else if(k.startsWith('on')) {

      e.addEventListener(k.substring(2).toLowerCase(), attr[k])

    } else {

      e.setAttribute(k, attr[k])

    }
  }
}

/*    understand/
 * Supports:
 *    h(..., [ child, child, "text", ...])
 *    h(..., "Some inner <b>HTML</b>")
 *    h(..., child)
 */
function addChildren(e, children) {
  if(!children) return

  if(Array.isArray(children)) {
    for(let i = 0;i < children.length;i++) {
      let curr = children[i]
      if(!isNode(curr)) {
        curr = document.createTextNode(curr)
      }
      e.appendChild(curr)
    }
  } else if(typeof children == "string") {
    e.innerHTML = children
  } else {
    let node = children
    if(!isNode(node)) node = document.createTextNode(node)
    e.appendChild(node)
  }
}

function isNode(e) { return e && e.nodeName && e.nodeType }

/*    understand/
 * return a generator that creates a defined element
 * with the given attributes
 *    div = x('div')
 *    div2 = x('div', { classes: 'big black' })
 *
 *    div("Content inside div")
 *    div2([
 *      div("Content inside div"],
 *      "Wrapped in content with 'big black' class"
 *    ])
 */
function x(tag, attr_) {
  if(!attr_) return (attr, children) => h(tag, attr, children)

  return (attr, children) => {

    if(typeof attr == 'string' || Array.isArray(attr)) {
      children = attr
      attr = attr_
    } else {
      attr = Object.assign(attr_, attr)
    }

    return h(tag, attr, children)
  }
}


module.exports = {
  h,
  x,
  div: x('div'),
}
