'use strict'

/*    way/
 * find and return the element with the given id
 */
function getH(id, e) {
  if(!e) e = document
  if(e.contentDocument) e = e.contentDocument
  return wrap(e.getElementById(id))
}

/*    way/
 * handle the various parameter possiblities (defaulting
 * to tag = 'div'), extract classes and id's from css
 * shortcuts, then make the given element
 */
function h(tag, attr, children) {
  let args = handleParams('div', tag, attr, children)
  args.tag = xtract('div', args.tag, args.attr)
  return makeElement(args)
}

/*    way/
 * create the given element tag, wrap it in helper
 * functions then add the attributes and children
 */
function makeElement(args) {
  let e = document.createElement(args.tag)
  wrap(e)

  e.attr(args.attr)
  e.add(args.children)

  return e
}

/*    way/
 * wrap the element with a couple of helper functions to
 * add attributes, children, and a heirarchy
 */
function wrap(e) {
  if(!e) return
  e.c = function() {
    if(arguments.length === 1
      && typeof arguments[0] === "string") {
      e.innerHTML = arguments[0]
    } else {
      e.innerHTML = ""
      if(arguments.length) addChildren(e, Array.prototype.slice.call(arguments))
    }
    return e
  }

  e.attr = a => addAttributes(e, a)
  e.add = c => addChildren(e, c)

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
  args.tag = xtract('svg', args.tag, args.attr)

  let e
  if(args.tag[0] == "<") {
    e = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    e.innerHTML = tag
    const r = e.getElementsByTagName("svg")[0]
    if(r) e = r
  } else {
    e = document.createElementNS("http://www.w3.org/2000/svg", args.tag)
    addAttributes(e, args.attr)
    addChildren(e, args.children)
  }

  e.c = function() {
    if(arguments.length === 1
      && typeof arguments[0] === "string") {
      e.innerHTML = arguments[0]
    } else {
      e.innerHTML = ""
      addChildren(e, Array.prototype.slice.call(arguments))
    }
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
  const r = { tag: null, attr: {}, children: [] }
  handle_1(tag)
  handle_1(attr)
  handle_1(children)

  return r

  function handle_1(v) {
    if(!r.tag) {
      if(!v) {
        r.tag = defaultTag
        return
      }
      if(typeof v === 'string') {
        r.tag = v
        return
      }
      r.tag = defaultTag
    }
    if(!v) return
    if(Array.isArray(v) || isNode(v) || typeof v === 'string' || typeof v === 'number') {
      r.children = r.children.concat(v)
      return
    }
    r.attr = Object.assign(r.attr, v)
  }

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
function xtract(defaultTag, tag, attr) {
  if(attr.class && attr.classes) attr.class += " "+attr.classes
  else if(attr.classes)  attr.class = attr.classes
  else if(!attr.class) attr.class = ""
  delete attr.classes

  tag = tag.replace(/#/g, ".#")
  let s = tag.split('.')
  tag = s.shift()
  if(!tag) tag = defaultTag
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

    if(k === 'class' || k === 'classes') {

      if(attr[k]) {
        const existing = e.getAttribute('class')
        let class_ = attr[k].trim().split(/[ \t]+/g).join(' ')
        if(existing) class_ += " " + existing;
        e.setAttribute('class', class_)
      }

    } else if(k === 'style') {

      let style = attr[k]
      if(typeof style == 'string') e.style.cssText = style
      else for(let s in style) e.style.setProperty(s, style[s])

    } else if(k.startsWith('on')) {

      e.addEventListener(k.substring(2).toLowerCase(), attr[k])

    } else {

      if(attr[k] === false) e.removeAttribute(k)
      else if(!attr[k]) e.setAttribute(k, "")
      else e.setAttribute(k, attr[k])

    }
  }
}

function addChildren(e, children) {
  if(!children) return
  if(!Array.isArray(children)) children = [ children ]

  for(let i = 0;i < children.length;i++) {
    let curr = children[i]
    if(!curr) continue
    if(Array.isArray(curr)) {
      addChildren(e, curr)
      continue
    }
    if(!isNode(curr)) curr = document.createTextNode(curr)
    e.appendChild(curr)
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
  let args_ = handleParams('div', tag, attr_)
  args_.tag = xtract('div', args_.tag, args_.attr)

  return (tag, attr, children) => {
    let args = handleParams('div', tag, attr, children)
    args.tag = xtract('div', args.tag, args.attr)

    if(args_.attr.class && args.attr.class) {
      args.attr.class = args_.attr.class + " " + args.attr.class
    }
    if(args_.attr.style && args.attr.style) {
      if(typeof args_.attr.style === typeof args.attr.style) {
        if(typeof args_.attr.style === 'string') {
          args.attr.style = args_.attr.style + ";" + args.attr.style
        } else {
          args.attr.style = Object.assign({}, args_.attr.style, args.attr.style)
        }
      }
    }
    args.attr = Object.assign({}, args_.attr, args.attr)

    return makeElement(args)
  }
}


module.exports = {
  h,
  wrap,
  getH,
  x,
  div: x('div'),
  svg,
}

