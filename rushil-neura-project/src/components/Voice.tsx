import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaMicrophone } from "react-icons/fa"; // Mic icon
import "../styles/Sidebar/sidebar.css"; // Assuming you have general styles

const Voice = () => {
  const [transcript, setTranscript] = useState("");

  return (
    <div className="voice-card">
      <h2 className="voice-title">Open Mic</h2>
      <p className="voice-subtitle">Not in the mood to answer questions?</p>
      <div className="voice-mic">
        <FaMicrophone size={32} />
      </div>
      <textarea
        className="voice-textarea"
        placeholder="transcript..."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
    </div>
  );
};

export default Voice;
