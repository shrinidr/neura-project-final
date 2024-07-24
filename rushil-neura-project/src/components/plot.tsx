
import Plot from 'react-plotly.js'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

interface PlotProps {
  url: string;
}

interface PlotData {
  data: any[];
  layout: any;
}

const PlotComponent: React.FC<PlotProps> = ({ url }) => {
  const [plotData, setPlotData] = useState<PlotData | null>(null);

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setPlotData(JSON.parse(response.data));
      })
      .catch(error => console.error('Error fetching the plot data:', error));
  }, [url]);

  return (
    <div>
      {plotData ? (
        <Plot
          data={plotData.data}
          layout={plotData.layout}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlotComponent