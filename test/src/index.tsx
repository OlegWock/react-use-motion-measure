import React, { Fragment, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import useMotionMeasure from 'react-use-motion-measure'
import { Global, Container, Box, ScrollArea, ScrollContent, Button } from './styles'
import { MotionValue, motion, useMotionValue, useTransform } from 'motion/react'

function ScrollBox({ size, color, children }: { size: number | string; color: string; children: any }) {
  const scrollBoxRef = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    if (!scrollBoxRef.current) return
    const height = scrollBoxRef.current!.offsetHeight
    const width = scrollBoxRef.current!.offsetWidth
    scrollBoxRef.current.scrollTop = 1000 / 2 - height / 2
    scrollBoxRef.current.scrollLeft = 1000 / 2 - width / 2
  }, [])

  return (
    <ScrollArea ref={scrollBoxRef} size={size} color={color}>
      <ScrollContent>{children}</ScrollContent>
    </ScrollArea>
  )
}

function MeasuredBox({ color, offsetSize }: { color: string; offsetSize: boolean }) {
  // This line is all you need ...
  const [ref, bounds] = useMotionMeasure({ scroll: true, debounce: { scroll: 0, resize: 0 }, offsetSize: offsetSize })
  // The rest is just for effects, hover and mouse tracking

  const rendersCount = useRef(0)
  rendersCount.current++

  const sizeRef = useRef(false)
  const size = useMotionValue(250)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xFinal = useTransform<number, string>([bounds.left, x], ([left, x]) => {
    return `${Math.round(x - left)}px`
  })
  const yFinal = useTransform<number, string>([bounds.top, y], ([top, y]) => {
    return `${Math.round(y - top)}px`
  })

  const transformedBounds: Record<string, MotionValue<string>> = {}
  Object.keys(bounds).map(
    (key) => (transformedBounds[key] = useTransform<number, string>(bounds[key], (val) => Math.round(val) + 'px')) // eslint-disable-line
  )

  return (
    <Box
      ref={ref}
      onMouseMove={({ clientX, clientY }) => {
        x.set(clientX)
        y.set(clientY)
      }}
      onMouseLeave={() => {
        x.set(bounds.left.get())
        y.set(bounds.top.get())
      }}
      onClick={() => {
        sizeRef.current = !sizeRef.current
        size.set(sizeRef.current ? 350 : 250)
      }}
      style={{
        width: size,
        height: size,
      }}
      color={color}>
      <span>Renders count</span>
      <span>{rendersCount.current}</span>
      {Object.keys(transformedBounds).map((key) => (
        <Fragment key={key}>
          <span>{key}</span>
          <motion.span>{transformedBounds[key]}</motion.span>
        </Fragment>
      ))}

      <span>mouse x</span>
      <motion.span>{xFinal}</motion.span>
      <span>mouse y</span>
      <motion.span>{yFinal}</motion.span>
    </Box>
  )
}

function Example() {
  const [offsetSize, setOffsetSize] = useState(false)
  return (
    <>
      {/* @ts-ignore */}
      <Global color="white" />
      <div style={{ width: '150vw', height: '150vh', marginLeft: '-25vw', paddingTop: '20vh' }}>
        <Container scale={0.9}>
          <ScrollBox size="66vh" color="#272730">
            <ScrollBox size="55vh" color="#676770">
              <MeasuredBox color="#F7567C" offsetSize={offsetSize} />
            </ScrollBox>
          </ScrollBox>
          <Button onClick={() => setOffsetSize(!offsetSize)}>
            <span>OffsetSize: </span>
            {offsetSize ? 'True' : 'False'}
          </Button>
        </Container>
      </div>
    </>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Example />)
