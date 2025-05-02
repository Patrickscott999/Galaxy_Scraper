"use client"

import { useState } from "react"
import { BarChart, LineChart, Activity, Download, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DataVisualizationProps {
  data: {
    type: string
    labels: string[]
    datasets: any[]
  }
}

export function DataVisualization({ data }: DataVisualizationProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("chart")

  // This would be replaced with actual chart rendering in a real app
  const renderChart = () => {
    const chartHeight = expanded ? "h-96" : "h-64"

    if (data.type === "line") {
      return (
        <div
          className={`${chartHeight} w-full flex items-center justify-center relative overflow-hidden rounded-lg bg-white/5 border border-white/10`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full p-6">
              <div className="relative h-full w-full">
                {/* X-axis */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
                {/* Y-axis */}
                <div className="absolute top-0 bottom-0 left-0 w-px bg-white/20"></div>

                {/* Line chart visualization */}
                {data.datasets.map((dataset, index) => (
                  <div key={index} className="absolute bottom-0 left-0 right-0 h-full">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={`M0,${100 - (data.datasets[index].data[0] / 100) * 80} ${data.labels.map((_, i) => `L${i * (100 / (data.labels.length - 1))},${100 - (data.datasets[index].data[i] / 100) * 80}`).join(" ")}`}
                        fill="none"
                        stroke={dataset.borderColor}
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                ))}

                {/* Data points */}
                {data.datasets.map((dataset, datasetIndex) => (
                  <div key={datasetIndex}>
                    {dataset.data.map((value: number, index: number) => (
                      <div
                        key={index}
                        className="absolute w-2 h-2 rounded-full bg-white"
                        style={{
                          bottom: `${(value / 100) * 80}%`,
                          left: `${index * (100 / (data.labels.length - 1))}%`,
                          transform: "translate(-50%, 50%)",
                          backgroundColor: dataset.borderColor,
                        }}
                      />
                    ))}
                  </div>
                ))}

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/60 pt-2">
                  {data.labels.map((label, index) => (
                    <div key={index} className="text-center" style={{ width: `${100 / data.labels.length}%` }}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {data.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-white/80">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dataset.borderColor }}></div>
                <span>{dataset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (data.type === "bar") {
      return (
        <div
          className={`${chartHeight} w-full flex items-center justify-center relative overflow-hidden rounded-lg bg-white/5 border border-white/10`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full p-6">
              <div className="relative h-full w-full">
                {/* X-axis */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
                {/* Y-axis */}
                <div className="absolute top-0 bottom-0 left-0 w-px bg-white/20"></div>

                {/* Bar chart visualization */}
                <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-around">
                  {data.labels.map((label, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-8 rounded-t-sm transition-all duration-500 ease-out"
                        style={{
                          height: `${(data.datasets[0].data[index] / 100) * 80}%`,
                          backgroundColor: data.datasets[0].backgroundColor[index] || data.datasets[0].backgroundColor,
                        }}
                      ></div>
                      <div className="text-xs text-white/60 mt-2">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3">
            <div className="text-sm font-medium text-white/80">{data.datasets[0].label}</div>
          </div>
        </div>
      )
    }

    if (data.type === "radar" || data.type === "doughnut") {
      // Simplified placeholder for radar and doughnut charts
      return (
        <div
          className={`${chartHeight} w-full flex items-center justify-center relative overflow-hidden rounded-lg bg-white/5 border border-white/10`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {data.type === "radar" ? (
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Radar background */}
                  <polygon
                    points="50,50 50,10 80,20 90,50 80,80 50,90 20,80 10,50 20,20"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points="50,50 50,20 70,30 80,50 70,70 50,80 30,70 20,50 30,30"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points="50,50 50,30 65,35 70,50 65,65 50,70 35,65 30,50 35,35"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                  />

                  {/* Dataset 1 */}
                  <polygon
                    points="50,50 50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25"
                    fill={data.datasets[0].backgroundColor}
                    stroke={data.datasets[0].borderColor}
                    strokeWidth="1.5"
                  />

                  {/* Dataset 2 if exists */}
                  {data.datasets[1] && (
                    <polygon
                      points="50,50 50,25 65,30 75,50 65,70 50,75 35,70 25,50 35,30"
                      fill={data.datasets[1].backgroundColor}
                      stroke={data.datasets[1].borderColor}
                      strokeWidth="1.5"
                    />
                  )}
                </svg>

                {/* Axis labels */}
                {data.labels.map((label, i) => {
                  const angle = (i * 2 * Math.PI) / data.labels.length - Math.PI / 2
                  const x = 50 + 45 * Math.cos(angle)
                  const y = 50 + 45 * Math.sin(angle)
                  return (
                    <div
                      key={i}
                      className="absolute text-xs text-white/70"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="20" />

                  {/* Doughnut segments */}
                  {data.datasets[0].data.map((value: number, i: number) => {
                    const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
                    const startAngle =
                      (data.datasets[0].data.slice(0, i).reduce((a: number, b: number) => a + b, 0) / total) *
                        2 *
                        Math.PI -
                      Math.PI / 2
                    const endAngle = startAngle + (value / total) * 2 * Math.PI

                    const startX = 50 + 40 * Math.cos(startAngle)
                    const startY = 50 + 40 * Math.sin(startAngle)
                    const endX = 50 + 40 * Math.cos(endAngle)
                    const endY = 50 + 40 * Math.sin(endAngle)

                    const largeArcFlag = value / total > 0.5 ? 1 : 0

                    return (
                      <path
                        key={i}
                        d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                        fill={data.datasets[0].backgroundColor[i]}
                      />
                    )
                  })}

                  <circle cx="50" cy="50" r="20" fill="#1e1e2f" />
                </svg>
              </div>
            )}
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4">
            {data.labels.map((label, i) => (
              <div key={i} className="flex items-center gap-1 text-xs text-white/80">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      data.datasets[0].backgroundColor[i] ||
                      (data.type === "radar" ? data.datasets[0].borderColor : "#a855f7"),
                  }}
                ></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div
        className={`${chartHeight} w-full flex items-center justify-center bg-white/5 border border-white/10 rounded-lg`}
      >
        <Activity className="h-12 w-12 text-white/30" />
        <span className="ml-2 text-white/50">Chart visualization</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:shadow-purple-900/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Data Visualization</h2>

        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger
                value="chart"
                className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
              >
                <BarChart className="h-4 w-4 mr-1" />
                Chart
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="data-[state=active]:bg-white/10 text-white data-[state=active]:text-white"
              >
                <LineChart className="h-4 w-4 mr-1" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9 w-9"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9 w-9"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TabsContent value="chart" className="mt-0">
        {renderChart()}
      </TabsContent>

      <TabsContent value="table" className="mt-0">
        <div className={`${expanded ? "h-96" : "h-64"} w-full overflow-auto rounded-lg border border-white/10`}>
          <table className="w-full text-white/80 text-sm">
            <thead className="bg-white/5 sticky top-0">
              <tr>
                <th className="text-left p-3 font-medium">Category</th>
                {data.datasets.map((dataset, i) => (
                  <th key={i} className="text-left p-3 font-medium">
                    {dataset.label || `Dataset ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.labels.map((label, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-3">{label}</td>
                  {data.datasets.map((dataset, j) => (
                    <td key={j} className="p-3">
                      {dataset.data[i]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </div>
  )
}
