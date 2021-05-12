# HTML-X

Simple and Clean HTML node generator.

![icon](./htm-x.png)

## Usage

`htm-x` is a simple wrapper around [`createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) that makes it easier to use in one simple step:

```javascript
div("Text inside div")
```

This is especially helpful when we want to embed content cleanly:

```javascript
div([
  h('img', { src: "test.png"}),
  "Text Content"
])
```

We can also add classes, styles, and any other attributes:

```javascript
div({
  classes: "class1 class2",
  style: { color: "blue" }
}, "Content can be text, children, or just a single child")
```

Besides `div()`’s we can create any other types we want:

```javascript
const { div, h, x } = require('@tpp/htm-x')

h('a', { href: "www.abc.com"}, "ABC")
h('span', {
  classes: "big small",
  style: { color: "red" },
  onclick: (e) => ...,
}, "Click me too")
```

Helpfully we can also create our own custom tag functions that can hold components applicable to our project:

```javascript
const span = x('span', { classes: "big red"})
span("content")
span({style: { color: "blue" }}, "content")

const bigText = x('span', {
  classes: "big black",
  style: { color: "green" }
})
bigText("Green is Good")
bigText({classes: "red"}, "But Red is better")
```

Being functional, custom tags are also composable so you can do nice things like:

```javascript
const ul = x('ul', { classes: "my-component"})
const li = x('li', { onclick: e => alert(e.target.innerText) })
const myComponent = (items) => {
  return ul(items.map(li))
}
myComponent(["item1", "item2", "item3"])
// ==>
//  <ul class="my-component">
//    <li>item1</li>
//    <li>item2</li>
//    <li>item3</li>
//  </ul>
```

## SVG Support

`htm-x` also creates [`SVG`](https://developer.mozilla.org/en-US/docs/Web/SVG) elements using the `svg()` function:

```javascript
const { svg } = require("@tpp/htm-x")

let pic = svg({width: 100, height:100})
pic.c(svg("circle", { r: 50, fill: "red" }))
```

You can also load SVG images directly:

```javascript
let pic = svg(`svg width="100%" height="100%" viewBox="0 0 57 57" version="1.1...`)
```

This is useful when loading svg images from file data.

## CSS Names

We can also use “css names” for the tags as a shortcut instead of using `classes:` and `id:` attributes:

```javascript
h("ul#id.class1.class2")
h(".class") // defaults to "div"
```

This is helpful in making the code cleaner in some cases.

## Keeping the Hierarchy Clean

It can become hard to read nested tags when they are mixed with attributes and so on. For example:

```javascript
h("div#container", {
  onclick: () =>...,
  style: ...
}, [
  h("div.wrapper", [
    h("div.main_content", {
      onclick: () => ...
    }, [
      h('h1', "Main header"),
      h('p', "This is the main content"),
      h('div',...
    ]),
    h("div.sidebar", [
      h("div.nav", [
        h("div.item", "Nav1"),
        h("div.item", "Nav2"),
        h("div.item", "Nav3"),
        ...
      ])
    ])
  ])
])
```

One way of handling this problem - given we have the full power of javascript - is to give the components names:

```javascript
let nav1 = h(".item", "Nav1")
let nav2 = h(".item", "Nav2")
let nav3 = h(".item", "Nav3")
let nav = h(".nav", [ nav1, nav2, nav3 ])
let sidebar = h(".sidebar", nav)

let header = h("h1", "Main header")
let content = h("p", "This is the main content")
let mainContent = h(".main_content", [
  header, content, ...
])
  
let wrapper = h(".wrapper", [mainContent, sidebar])
let container = h(".container", wrapper)
```

This is much ‘cleaner’ to read but we have two problems:

1. While we can see each element in isolation we cannot see the entire hierarchy. We only know that ‘`container`’ container contains ‘`wrapper`’ and then we have to follow wrapper to trace what it contains and so on.
2. In some ways the heirarchy is exactly backwards - we have to define container _last_ and the most in-depth element first.

To solve both these problems you can use the `.c()` (set children) method. This allows us to give nicely defined names to each element (as above) but then stitch them all together neatly in one place:

```javascript
let container = h(".container")
let wrapper = h(".wrapper")

let mainContent = h(".main_content")
let header = h("h1", "Main header")
let content = h("p", "This is the main content")

let sidebar = h(".sidebar")
let nav = h(".nav")
let nav1 = h(".item", "Nav1")
let nav2 = h(".item", "Nav2")
let nav3 = h(".item", "Nav3")

return container.c(
  wrapper.c(
    mainContent.c(
      header, content,...
    ),
    sidebar.c(
      nav.c(nav1, nav2, nav3, ...)
    )
  )
)
```

Now we can see the entire hierarchy neatly and also have it nicely named. With all these abilities it is easy to keep the generated HTML both understandable and easy to handle and mantain.

---

