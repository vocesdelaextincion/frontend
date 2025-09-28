import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Icon } from "@iconify/react";
import styles from "./RecordingPlayer.module.css";

const RecordingPlayer = () => {
  // Sample recordings simulating API response based on Recording interface
  const recordings = [
    {
      id: "rec_001",
      title: "Crespin Clásico",
      description: "Canto clásico del crespín. Grabado en diciembre a las 19hs",
      fileUrl: "/audio/crespin-clasico-diciembre-19hs-1.mp3",
      tags: [
        { id: "tag_001", name: "crespín", color: "#4CAF50" },
        { id: "tag_002", name: "aves", color: "#2196F3" },
        { id: "tag_003", name: "diciembre", color: "#9C27B0" },
        { id: "tag_004", name: "atardecer", color: "#FFC107" },
      ],
    },
    {
      id: "rec_002",
      title: "Carpintero Negro",
      description: "Un carpintero negro en el monte. Grabado en julio. 16hs",
      fileUrl: "/audio/carpintero-negro-julio-16hs.mp3",
      tags: [
        { id: "tag_001", name: "abejas", color: "#4CAF50" },
        { id: "tag_002", name: "insectos", color: "#1E88E5" },
      ],
    },
    {
      id: "rec_003",
      title: "Caballos comiendo",
      description:
        "Caballos comiendo. Grabado el 1 de mayo de 2019 a las 22:35",
      fileUrl: "/audio/alicuco-caballos-comiendo.mp3",
      tags: [
        { id: "tag_001", name: "animales", color: "#4CAF50" },
        { id: "tag_002", name: "noche", color: "#1E88E5" },
      ],
    },
    {
      id: "rec_004",
      title: "Chicharras",
      description: "Chicharras. Grabado en marzo. 17hs.",
      fileUrl: "/audio/chicharras-marzo-17hs.mp3",
      tags: [
        { id: "tag_001", name: "caballos", color: "#4CAF50" },
        { id: "tag_002", name: "animales", color: "#1E88E5" },
      ],
    },
    {
      id: "rec_005",
      title: "Carpintero negro, zorzal, paloma",
      description:
        "Un carpintero negro, zorzal y paloma en el monte. Grabado el 8 de agosto de 2019 a las 14:28pm",
      fileUrl: "/audio/carpintero-negro-zorzal-paloma.mp3",
      tags: [
        { id: "tag_001", name: "caballos", color: "#4CAF50" },
        { id: "tag_002", name: "animales", color: "#1E88E5" },
      ],
    },
  ];

  const [selectedRecording, setSelectedRecording] = useState(recordings[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const wavesurferRef = useRef(null);
  const waveformRef = useRef(null);

  // Handle recording selection
  const handleRecordingSelect = (recording) => {
    setSelectedRecording(recording);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (!selectedRecording || !wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
  };

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#F6F6F6",
        progressColor: "#F6F6F6",
        cursorColor: "#ffffff",
        barWidth: 3,
        barGap: 0,
        responsive: true,
        height: 60,
        normalize: true,
        backend: "WebAudio",
        mediaControls: false,
        interact: true,
      });

      // WaveSurfer event listeners
      wavesurferRef.current.on("play", () => {
        setIsPlaying(true);
      });

      wavesurferRef.current.on("pause", () => {
        setIsPlaying(false);
      });

      wavesurferRef.current.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      wavesurferRef.current.on("ready", () => {
        setDuration(wavesurferRef.current.getDuration());
      });

      wavesurferRef.current.on("audioprocess", () => {
        setCurrentTime(wavesurferRef.current.getCurrentTime());
      });

      wavesurferRef.current.on("seek", () => {
        setCurrentTime(wavesurferRef.current.getCurrentTime());
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  // Update audio source when selected recording changes
  useEffect(() => {
    if (selectedRecording && wavesurferRef.current) {
      wavesurferRef.current.load(selectedRecording.fileUrl);
      setCurrentTime(0);
      setIsPlaying(false);

      // Reset the cursor position to the beginning
      wavesurferRef.current.on("ready", () => {
        wavesurferRef.current.seekTo(0);
        setDuration(wavesurferRef.current.getDuration());
      });
    }
  }, [selectedRecording]);

  return (
    <div className={styles.player}>
      <div className={styles.playControls}>
        <button
          onClick={handlePlayPause}
          disabled={!selectedRecording}
          className={styles.playButton}
        >
          <Icon icon={isPlaying ? "mdi:pause" : "mdi:play"} />
        </button>
      </div>

      <div className={styles.recordingList}>
        <div className={styles.currentSelection}>
          <div className={styles.currentSelectionTitle}>
            <h3>Pista seleccionada: {selectedRecording.title}</h3>
            {selectedRecording && (
              <div className={styles.timeDisplay}>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            )}
          </div>
          <div ref={waveformRef} className={styles.waveform}></div>
        </div>

        <div className={styles.buttons}>
          {recordings.map((recording) => (
            <button
              key={recording.id}
              onClick={() => handleRecordingSelect(recording)}
              className={`${styles.recordingButton} ${
                selectedRecording?.id === recording.id ? styles.selected : ""
              }`}
            >
              {recording.title}
            </button>
          ))}
        </div>
      </div>

      {/* Time Display */}
    </div>
  );
};

export default RecordingPlayer;
