<p align="center">
  <img height="400" src="https://i.imgur.com/eMYYMla.jpg" />
</p>

    yarn add react-use-motion-measure

This small tool will measure the boundaries (for instance width, height, top, left) of a view you reference. It is reactive and responds to changes in size, window-scroll and nested-area-scroll.

This is fork of [react-use-measure](https://github.com/pmndrs/react-use-measure) modified to use MotionValue (from [Motion](https://motion.dev/)) instead of state. This allows to avoid unnecessary re-renders if you use element size/position only in animation. Everything else is same as in original package, for options and more info refer to its readme.

**This project uses Motion as peer dependency, don't forget to install it.**

You can try live demo [here](https://codesandbox.io/s/react-use-motion-measure-demo-eej9m3).

# Usage

```jsx
import useMotionMeasure from 'react-use-motion-measure'

function App() {
  const [ref, bounds] = useMotionMeasure()

  // bounds.x, bounds.width, etc are MotionValue<number>
  // and will be updated if component changes size

  return <div ref={ref} />
}
```

# Api

```jsx
interface MotionRectReadOnly {
  readonly x: MotionValue<number>
  readonly y: MotionValue<number>
  readonly width: MotionValue<number>
  readonly height: MotionValue<number>
  readonly top: MotionValue<number>
  readonly right: MotionValue<number>
  readonly bottom: MotionValue<number>
  readonly left: MotionValue<number>
}

type Options = {
  // Debounce events in milliseconds
  debounce?: number | { scroll: number; resize: number }
  // React to nested scroll changes, don't use this if you know your view is static
  scroll?: boolean
  // You can optionally inject a resize-observer polyfill
  polyfill?: { new (cb: ResizeObserverCallback): ResizeObserver }
  // Measure size using offsetHeight and offsetWidth to ignore parent scale transforms
  offsetSize?: boolean
}

useMotionMeasure(
  options: Options = { debounce: 0, scroll: false }
): [ref: React.MutableRefObject<HTMLElement | SVGElement>, bounds: MotionRectReadOnly, forceRefresh: () => void]
```
