
import Plot from 'react-plotly.js'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'; // Import the Clerk useAuth hook

interface PlotProps {
  url: string;
}

interface PlotData {
  data: any[];
  layout: any;
}

const PlotComponent: React.FC<PlotProps> = ({ url }) => {
  const {getToken} = useAuth();
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (loading){
    if (error){
    }
  }
   const makeBackendCall = async () => {

        try{
        const token = await getToken();
        console.log("Data Sent to the Flask Server")
        const response2 = await axios.post( `${import.meta.env.VITE_PYTHON_BACKEND_URL}/storeCache`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response2)
        }
        catch (error) {
        console.error("Error sending token data", error);
        }
    }

    useEffect(() => {
        let isCalled = false;
        if (!isCalled) {
            makeBackendCall();
            isCalled = true;
        }
    }, [])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await getToken(); // Get the token
          if (!token) {
            throw new Error("User not authenticated");
          }
    
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }, // Pass token
          });
    
          setPlotData(JSON.parse(response.data));
        } catch (error) {
          console.error("Error fetching the plot data:", error);
          setError("Failed to load graph data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [url]);
    

  return (
    <div className="plotS">
      {plotData ? (
        <Plot data={plotData.data} layout={plotData.layout} />
      ) : (
        <p style = {{paddingLeft : '10px'}}>Wait for 25-30s, return to Home if you still see this message. </p>
      )}
    </div>
  );
};

export default PlotComponent;