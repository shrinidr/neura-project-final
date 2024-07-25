
import Plot from 'react-plotly.js'
import { useRef } from "react";
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
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (mainContentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainContentRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
    }
  };

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <>

    <div className = "plotS" >
      {plotData ? (
        <Plot
          data={plotData.data}
          layout={plotData.layout}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
      </>

  );
};

export default PlotComponent