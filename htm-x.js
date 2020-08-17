'use strict'

/*    way/
 * handle the various parameter possiblities (defaulting
 * to tag = 'div'), extract classes and id's from css
 * shortcuts, then create the given element tag,
 * attributes and children. Add a `.c()` child creating
 * additional function.
 */
function h(tag, attr, children) {
  let args = handleParams('div', tag, attr, children)
  args.tag = xtract(args.tag, args.attr)

  let e = document.createElement(args.tag)
  addAttributes(e, args.attr)
  addChildren(e, args.children)

  e.c = function() {
    e.innerHTML = ""
    addChildren(e, Array.prototype.slice.call(arguments))
    return e
  }

  return e
}

/*    outcome/
 * handle the various parameter possiblities (defaulting
 * to tag = 'svg'), then create an SVG from the given
 * tag, attributes, or children OR from the given
 * SVG string
 */
function svg(tag, attr, children) {
  let args = handleParams('svg', tag, attr, children)
  let e
  if(args.tag[0] == "<") {
    e = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    e.innerHTML = tag
  } else {
    e = document.createElementNS("http://www.w3.org/2000/svg", args.tag)
    addAttributes(e, args.attr)
    addChildren(e, args.children)
  }

  e.c = function() {
    e.innerHTML = ""
    addChildren(e, Array.prototype.slice.call(arguments))
    return e
  }

  return e
}

/*    problem/
 * Support all possible combinations of tags, attributes
 * and children that the user provides:
 *    h('div', { id: "10" }, "child")
 *    h('div', { id: "10" }, ["child", "child"])
 *    h('div', { id: "10" }, h('span'))
 *    h('div')
 *    h('div', "child")
 *    h('div', ["child", "child"])
 *    h('div', h('span'))
 *    h()
 *    h({ id: "10" })
 *    h({ id: "10" }, "child")
 *    h({ id: "10" }, ["child", "child"])
 *    h({ id: "10" }, h('span'))
 *    h(h('span'))
 *    h(['child'])
 */
function handleParams(defaultTag, tag, attr, children) {

  if(typeof attr!='object'
    || Array.isArray(attr) || isNode(attr)) {

    children = attr
    attr = {}
  }

  if(typeof tag == 'object') {
    if(Array.isArray(tag) || isNode(tag)) children = tag
    else attr = tag
    tag = ''
  }
  if(!tag) tag = defaultTag
  tag = tag.trim()

  return { tag, attr, children }
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
  svg,
}
