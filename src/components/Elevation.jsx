import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getDistElevData } from "../helpers/gpxUtil";

Chart.register(CategoryScale);

const Elevation = ({geojson}) => { 

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (geojson) {
      const geoData = getDistElevData(geojson)
      setChartData({
        labels: geoData.map((data) => Math.round(data.dist)),  // x axis
        datasets: [
          {
            data: geoData.map((data) => data.elev), // y axis
            fill: true,
            borderColor: '#66ccff',
            backgroundColor: '#66ccff66',
            tension: 0.1,
            pointRadius: 0,
            spanGaps: true
          }
        ]
      })
    }
  }, [geojson]);

      return (
        <div className="elevation-profile-container">
          {!chartData && <></>}
          {chartData &&<Line 
              data={chartData} 
              options={{
                // https://www.geoapify.com/tutorial/draw-route-elevation-profile-with-chartjs
                animation: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
          />}
        </div>
    )
    }

export default Elevation;