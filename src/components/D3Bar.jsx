// components/D3Bar.jsx
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

export default function D3Bar({ 
  data, 
  width = 480, 
  height = 280,
  colorScheme = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'] 
}) {
  const ref = useRef()
  const tooltipRef = useRef()
  const [dimensions, setDimensions] = useState({ width, height })

  useEffect(() => {
    const handleResize = () => {
      const container = ref.current?.parentElement
      if (container) {
        const { width: containerWidth } = container.getBoundingClientRect()
        setDimensions({
          width: Math.min(containerWidth - 32, width),
          height: height
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width, height])

  useEffect(() => {
    if (!data || data.length === 0) return

    const margin = { top: 40, right: 40, bottom: 60, left: 60 }
    const w = dimensions.width - margin.left - margin.right
    const h = dimensions.height - margin.top - margin.bottom

    // Clear previous chart
    d3.select(ref.current).selectAll('*').remove()

    // Create SVG
    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('class', 'overflow-visible')

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'absolute hidden px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700')
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, w])
      .padding(0.3)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([h, 0])

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(colorScheme)

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y)
        .tickSize(-w)
        .tickFormat('')
      )

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${h})`)
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('class', 'text-xs fill-gray-600 dark:fill-gray-400')

    // Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).tickFormat(d => {
        if (d >= 1000000) return `$${(d / 1000000).toFixed(1)}M`
        if (d >= 1000) return `$${(d / 1000).toFixed(0)}K`
        return `$${d}`
      }))
      .selectAll('text')
      .attr('class', 'text-xs fill-gray-600 dark:fill-gray-400')

    // Style axis lines
    g.selectAll('.domain')
      .attr('class', 'stroke-gray-300 dark:stroke-gray-600')

    g.selectAll('.tick line')
      .attr('class', 'stroke-gray-300 dark:stroke-gray-600')

    // Bars with animation
    const bars = g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar cursor-pointer transition-all duration-200')
      .attr('x', d => x(d.label))
      .attr('y', h)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', d => color(d.label))
      .attr('rx', 4)
      .attr('ry', 4)

    // Animate bars
    bars.transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d.value))
      .attr('height', d => h - y(d.value))

    // Add hover effects
    bars
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1.02)')

        tooltip.transition()
          .duration(200)
          .style('opacity', .9)

        tooltip.html(`
          <div class="font-semibold">${d.label}</div>
          <div class="text-yellow-300">$${d.value.toLocaleString()}</div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .style('display', 'block')
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('transform', 'scale(1)')

        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
          .style('display', 'none')
      })

    // Add value labels on bars
    g.selectAll('.text')
      .data(data)
      .enter().append('text')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-semibold fill-gray-700 dark:fill-gray-300')
      .text(d => `$${d.value >= 1000 ? (d.value / 1000).toFixed(0) + 'K' : d.value}`)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 400)
      .style('opacity', 1)

    // Cleanup
    return () => {
      tooltip.remove()
    }
  }, [data, dimensions, colorScheme])

  return <div ref={ref} className="w-full" />
}