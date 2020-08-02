'use strict'

/*    way/
 * create an element with the given tag and add the
 * attributes and children
 */
function h(tag, attr, children) {
  if(typeof attr == 'string' || Array.isArray(attr)) {
    children = attr
    attr = {}
  }

  let e = document.createElement(tag)

  addAttributes(e, attr)
  addChildren(e, children)

  return e
}

/*    way/
 * append classes, styles, event listeners, and attributes
 * to the element
 */
function addAttributes(e, attr) {
  if(!attr) return

  for(let k in attr) {

    if(k == 'class' || k == 'classes') {

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
      if(typeof curr == 'string') {
        curr = document.createTextNode(curr)
      }
      e.appendChild(curr)
    }
  } else if(typeof children == "string") {
    e.innerHTML = children
  } else {
    e.appendChild(children)
  }
}

module.exports = {
  h
}
