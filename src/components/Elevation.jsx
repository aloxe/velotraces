import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import { getDistElevData } from "../helpers/gpxUtil";

Chart.register(CategoryScale);

const Elevation = ({geojson}) => { 

  // const ElevationData = geojson && geojson.features[0].geometry.coordinates;
  
  // console.log(ElevationData);
  const BrutoData = getDistElevData(geojson)
  console.log(BrutoData);
  // const FilteredData = BrutoData.filter((el,i) => i < 50)
  
  
  const FilteredData = [
        {
          id: 1,
          year: 2016,
          userGain: 80000,
          userLost: 823
        },
        {
          id: 2,
          year: 2017,
          userGain: 45677,
          userLost: 345
        },
        {
          id: 3,
          year: 2018,
          userGain: 78888,
          userLost: 555
        },
        {
          id: 4,
          year: 2019,
          userGain: 90000,
          userLost: 4555
        },
        {
          id: 5,
          year: 2020,
          userGain: 4300,
          userLost: 234
        }
      ];

    const [chartData] = useState({
        labels: FilteredData.map((data) => data.dist),  // x axis
        datasets: [
          {
            data: FilteredData.map((data) => data.elev), // y axis
            fill: true,
            borderColor: '#66ccff',
            backgroundColor: '#66ccff66',
            tension: 0.1,
            pointRadius: 0,
            spanGaps: true
          }
        ]
      });

      return (
        <div className="elevation-profile-container" style={{height:'150px'}}>
            <Line 
                data={chartData} 
                options={{
                  // https://www.geoapify.com/tutorial/draw-route-elevation-profile-with-chartjs
                  animation: false,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
            />
        </div>
    )
    }

export default Elevation;