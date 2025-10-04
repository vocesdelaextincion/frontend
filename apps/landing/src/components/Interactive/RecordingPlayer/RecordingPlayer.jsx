import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Icon } from "@iconify/react";
import styles from "./RecordingPlayer.module.css";

const RecordingPlayer = () => {
  // Sample recordings simulating API response based on Recording interface
  const recordings = [
    {
      id: "rec_001",
      title: "Crespín Clásico",
      description: "Canto clásico del crespín. Grabado en diciembre a las 19hs",
      fileUrl: "/audio/crespin-clasico-diciembre-19hs-1.mp3",
      tags: [
        { id: "tag_001", name: "crespín", color: "#6B8E5A" },
        { id: "tag_002", name: "aves", color: "#5A7C8E" },
        { id: "tag_003", name: "diciembre", color: "#8E6B7C" },
        { id: "tag_004", name: "atardecer", color: "#B8956B" },
      ],
    },
    {
      id: "rec_002",
      title: "Carpintero Negro",
      description:
        "Un carpintero negro en el monte. Grabado en julio a las 16hs",
      fileUrl: "/audio/carpintero-negro-julio-16hs.mp3",
      tags: [
        { id: "tag_005", name: "carpintero", color: "#7A8471" },
        { id: "tag_002", name: "aves", color: "#5A7C8E" },
        { id: "tag_006", name: "julio", color: "#A68B5B" },
        { id: "tag_007", name: "tarde", color: "#8B7355" },
      ],
    },
    {
      id: "rec_003",
      title: "Caballos comiendo",
      description:
        "Caballos comiendo. Grabado el 1 de mayo de 2019 a las 22:35",
      fileUrl: "/audio/alicuco-caballos-comiendo.mp3",
      tags: [
        { id: "tag_008", name: "caballos", color: "#6B8E5A" },
        { id: "tag_009", name: "animales", color: "#5A7C8E" },
        { id: "tag_010", name: "noche", color: "#4A5568" },
        { id: "tag_011", name: "mayo", color: "#8E6B7C" },
      ],
    },
    {
      id: "rec_004",
      title: "Chicharras",
      description: "Chicharras. Grabado en marzo a las 17hs",
      fileUrl: "/audio/chicharras-marzo-17hs.mp3",
      tags: [
        { id: "tag_012", name: "chicharras", color: "#9CAF88" },
        { id: "tag_013", name: "insectos", color: "#B8956B" },
        { id: "tag_014", name: "marzo", color: "#A67C52" },
        { id: "tag_007", name: "tarde", color: "#8B7355" },
      ],
    },
    {
      id: "rec_005",
      title: "Carpintero negro, zorzal, paloma",
      description:
        "Un carpintero negro, zorzal y paloma en el monte. Grabado el 8 de agosto de 2019 a las 14:28",
      fileUrl: "/audio/carpintero-negro-zorzal-paloma.mp3",
      tags: [
        { id: "tag_005", name: "carpintero", color: "#7A8471" },
        { id: "tag_015", name: "zorzal", color: "#6B7B8C" },
        { id: "tag_016", name: "paloma", color: "#8C8B8A" },
        { id: "tag_002", name: "aves", color: "#5A7C8E" },
      ],
    },
    {
      id: "rec_006",
      title: "Crespín Canto de Alerta",
      description:
        "Canto de alerta del crespín. Grabado el 27 de diciembre de 2018 a las 21:04",
      fileUrl: "/audio/crespin-canto-alerta-2018-12-27-at-9.04.36-pm1-1.mp3",
      tags: [
        { id: "tag_001", name: "crespín", color: "#6B8E5A" },
        { id: "tag_002", name: "aves", color: "#5A7C8E" },
        { id: "tag_017", name: "alerta", color: "#A67C6B" },
        { id: "tag_003", name: "diciembre", color: "#8E6B7C" },
      ],
    },
    {
      id: "rec_007",
      title: "Lechuza Gato",
      description: "Lechuza gato. Grabado el 20 de enero de 2019 a las 18:16",
      fileUrl: "/audio/lechuza-gato-2019-01-20-at-6.16.48-pm-1.mp3",
      tags: [
        { id: "tag_018", name: "lechuza", color: "#7C6B8E" },
        { id: "tag_002", name: "aves", color: "#5A7C8E" },
        { id: "tag_019", name: "enero", color: "#5A8E8C" },
        { id: "tag_007", name: "tarde", color: "#8B7355" },
      ],
    },
    {
      id: "rec_008",
      title: "Rana Sola",
      description:
        "Rana sola con muy buen audio. Grabado el 13 de enero de 2019 a las 22:45",
      fileUrl:
        "/audio/rana-sola-muy-bien-audio-2019-01-13-at-10.45.59-pm-1.mp3",
      tags: [
        { id: "tag_020", name: "rana", color: "#6B8E5A" },
        { id: "tag_021", name: "anfibios", color: "#7A8471" },
        { id: "tag_019", name: "enero", color: "#5A8E8C" },
        { id: "tag_010", name: "noche", color: "#4A5568" },
      ],
    },
    {
      id: "rec_009",
      title: "Rana Campanita y Agua",
      description:
        "Rana campanita y sonidos de agua. Grabado en diciembre a las 21hs",
      fileUrl: "/audio/ranacampanitayaguadiciembre21hs-1.mp3",
      tags: [
        { id: "tag_020", name: "rana", color: "#6B8E5A" },
        { id: "tag_021", name: "anfibios", color: "#7A8471" },
        { id: "tag_022", name: "agua", color: "#5A7C8E" },
        { id: "tag_003", name: "diciembre", color: "#8E6B7C" },
      ],
    },
    {
      id: "rec_010",
      title: "Ranas y Grillos",
      description: "Ranas y grillos. Grabado en enero a las 23hs",
      fileUrl: "/audio/ranas_grillos_enero23horas-1.mp3",
      tags: [
        { id: "tag_020", name: "rana", color: "#6B8E5A" },
        { id: "tag_023", name: "grillos", color: "#9CAF88" },
        { id: "tag_019", name: "enero", color: "#5A8E8C" },
        { id: "tag_010", name: "noche", color: "#4A5568" },
      ],
    },
    {
      id: "rec_011",
      title: "Vertiente al Mediodía",
      description:
        "Sonidos de vertiente al mediodía con paloma. Grabado en enero a las 12:30",
      fileUrl: "/audio/vertientemediodia12hs30enepaloma-1.mp3",
      tags: [
        { id: "tag_024", name: "vertiente", color: "#5A8E8C" },
        { id: "tag_016", name: "paloma", color: "#8C8B8A" },
        { id: "tag_019", name: "enero", color: "#5A8E8C" },
        { id: "tag_025", name: "mediodía", color: "#B8956B" },
      ],
    },
    {
      id: "rec_012",
      title: "Zorro y Grillo Fuertes",
      description:
        "Zorro y grillo con sonidos fuertes. Grabado el 12 de diciembre de 2018 a las 22:33",
      fileUrl:
        "/audio/zorro-y-grillo-fuertes-ptt-2018-12-12-at-10.33.11-pm-1.mp3",
      tags: [
        { id: "tag_026", name: "zorro", color: "#A67C52" },
        { id: "tag_023", name: "grillos", color: "#9CAF88" },
        { id: "tag_003", name: "diciembre", color: "#8E6B7C" },
        { id: "tag_010", name: "noche", color: "#4A5568" },
      ],
    },
    {
      id: "rec_013",
      title: "Zorros",
      description: "Zorros. Grabado el 21 de diciembre de 2018 a las 21:37",
      fileUrl: "/audio/zorros-1-t-2018-12-21-at-9.37.54-pm.mp3",
      tags: [
        { id: "tag_026", name: "zorro", color: "#A67C52" },
        { id: "tag_027", name: "mamíferos", color: "#8B7355" },
        { id: "tag_003", name: "diciembre", color: "#8E6B7C" },
        { id: "tag_010", name: "noche", color: "#4A5568" },
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
          <Icon
            icon={isPlaying ? "mdi:pause" : "mdi:play"}
            width="2rem"
            height="2rem"
            style={{ display: "block" }}
          />
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
          {selectedRecording && (
            <div className={styles.tagsContainer}>
              {selectedRecording.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={styles.tag}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
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
          <a href="#" className={styles.moreLink}>
            Más...
          </a>
        </div>
      </div>

      {/* Time Display */}
    </div>
  );
};

export default RecordingPlayer;
