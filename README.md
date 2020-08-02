# HTML-X

Simple and Clean HTML node generator.

![icon](./htm-x.png)

## Usage

```javascript
const { h, div, x } = require('@tpp/htm-x')

/*** Basic Usage ***/
h('a', { href: "www.abc.com"}, "ABC")

h('div', [
  h('img', { src: "test.png"}),
  h('span', {
    classes: "big small",
    style: { color: "red" },
    onclick: (e) => ...,
  }, "Click me too")
  "Just some text"
])

/*** Most of the time we need divs ***/
div("Content")
div({classes: "class1 class2"}, "Content")

/*** We can create our own custom functions ***/
const span = x('span')
span("content")
span({style: { color: "blue" }}, "content")

/*** Or use custom components ***/
const bigText = x('span', {
  classes: "big black",
  style: { color: "green" }
})
bigText("Green is Good")
bigText({style: { color: "red" }}, "But Red is better")
```

---

