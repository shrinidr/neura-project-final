
import { useEffect, useState } from 'react';

const DateDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(formattedDate);
    };

    updateDate();
    const intervalId = setInterval(updateDate, 1000 * 60 * 60 * 24); // Update every day

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return <div id="date-container">{currentDate}</div>;
};

export default DateDisplay;