# HTML-X

Simple and Clean HTML node generator.

![icon](./htm-x.png)

## Usage

```javascript
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
```

---

