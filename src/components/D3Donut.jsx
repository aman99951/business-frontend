// components/D3Donut.jsx
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'

export default function D3Donut({ 
  data, 
  width = 320, 
  height = 240,
  colorScheme = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
}) {
  const ref = useRef()
  const [dimensions, setDimensions] = useState({ width, height })

  useEffect(() => {
    const handleResize = () => {
      const container = ref.current?.parentElement
      if (container) {
        const { width: containerWidth } = container.getBoundingClientRect()
        const size = Math.min(containerWidth - 32, width)
        setDimensions({
          width: size,
          height: Math.min(size, height)
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width, height])

  useEffect(() => {
    if (!data || data.length === 0) return

    const outerRadius = Math.min(dimensions.width, dimensions.height) / 2 - 20
    const innerRadius = outerRadius * 0.65

    // Clear previous chart
    d3.select(ref.current).selectAll('*').remove()

    // Create SVG
    const svg = d3.select(ref.current)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('class', 'overflow-visible')

    const g = svg.append('g')
      .attr('transform', `translate(${dimensions.width / 2},${dimensions.height / 2})`)

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'absolute hidden px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700')
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Calculate total
    const total = d3.sum(data, d => d.value)

    // Pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)

    // Arc generators
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(4)

    const arcHover = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius + 10)
      .cornerRadius(4)

    const arcLabel = d3.arc()
      .innerRadius((innerRadius + outerRadius) / 2)
      .outerRadius((innerRadius + outerRadius) / 2)

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(colorScheme)

    // Create arcs
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc cursor-pointer')

    // Draw paths with animation
    arcs.append('path')
      .attr('fill', d => color(d.data.label))
      .attr('class', 'transition-all duration-300')
      .style('opacity', 0.9)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover)
          .style('opacity', 1)

        tooltip.transition()
          .duration(200)
          .style('opacity', .9)

        const percentage = ((d.data.value / total) * 100).toFixed(1)
        tooltip.html(`
          <div class="font-semibold">${d.data.label}</div>
          <div class="text-yellow-300">$${d.data.value.toLocaleString()}</div>
          <div class="text-gray-300">${percentage}%</div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .style('display', 'block')
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc)
          .style('opacity', 0.9)

        tooltip.transition()
          .duration(500)
          .style('opacity', 0)
          .style('display', 'none')
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return function(t) {
          return arc(interpolate(t))
        }
      })

    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-bold fill-white')
      .style('opacity', 0)
      .text(d => {
        const percentage = ((d.data.value / total) * 100).toFixed(0)
        return percentage > 5 ? `${percentage}%` : ''
      })
      .transition()
      .duration(800)
      .delay(800)
      .style('opacity', 1)

    // Center text showing total
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('class', 'text-xs font-medium fill-gray-500 dark:fill-gray-400')
      .text('Total')

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('class', 'text-lg font-bold fill-gray-700 dark:fill-gray-300')
      .text(`$${total >= 1000 ? (total / 1000).toFixed(0) + 'K' : total}`)

    // Cleanup
    return () => {
      tooltip.remove()
    }
  }, [data, dimensions, colorScheme])

  return <div ref={ref} className="w-full flex justify-center" />
}