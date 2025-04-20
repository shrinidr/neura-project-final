import React, { useState } from 'react';
import '../styles/HomePage/emotions.css';

interface EmotionSelectorProps {
  userName: string;
}

const emotions = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😨', label: 'Anxious' },
  { emoji: '😐', label: 'Neutral' }
];

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ userName }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0].emoji);

  return (
    <div className="emotion-container">
      <div className="dropdown-section">
        <select
          id="emotion"
          value={selectedEmotion}
          onChange={(e) => setSelectedEmotion(e.target.value)}
          className="emoji-dropdown"
        >
          {emotions.map((emotion) => (
            <option key={emotion.label} value={emotion.emoji}>
              {emotion.emoji}
            </option>
          ))}
        </select>
      </div>

      
    <div className="newthinginmylife" style = {{marginLeft: '2%'}}>
        <p style = {{fontSize: '30px'}} id = "myanswers"><b>Welcome, {userName}!</b></p>
      </div>
    </div>
  );
};

export default EmotionSelector;
