import { useState } from "react";
import "./TeamSection.css";

// Team data - easily expandable for more team members
const teamMembers = [
  {
    id: 1,
    name: "M. Angélica Goldar Parodi",
    subtitle: "Tica Hen",
    description:
      "Socióloga, jubilada docente de escuela primaria y gestora cultural. Lleva adelante tareas de logística y el diseño y realización de dispositivos, instalaciones y presentaciones de Voces. Tiene a su cargo la parte pedagógica del proyecto.",
    image: "/src/assets/images/us_1.svg",
  },
  {
    id: 2,
    name: "Cristian Escribano",
    subtitle: "Asociación Civil Los Manantiales",
    description:
      "Analista de sistemas, estudiante de sociología y ambientalista. Creador del proyecto. Graba los fragmentos y ensambla las biofisinfonías. Trabaja en el diseño de instalaciones y presentaciones de Voces.",
    image: "/src/assets/images/us_2.svg",
  },
  {
    id: 3,
    name: "Yannick Constantín",
    subtitle: "Realizador Audiovisual",
    description:
      "Licenciado en comunicación audiovisual. Trabaja en la realización de fotografías, videos y registro audiovisual de Voces de la Extinción.",
    image: "/src/assets/images/us_3.svg",
  },
  {
    id: 4,
    name: "Celeste Sánchez Goldar",
    subtitle: "Tica Hen",
    description:
      "Gestora Cultural. Estudiante de Artes. Trabaja en el diseño y realización de dispositivos, instalaciones y presentaciones de Voces. Tiene a su cargo el diseño gráfico y de imagen del proyecto.",
    image: "/src/assets/images/us_4.svg",
  },
];

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  return (
    <div className="team-section">
      {/* Main team member card */}
      <div className="main-card">
        <div className="card-content">
          <div className="text-content">
            <h2 className="member-name">{selectedMember.name}</h2>
            <p className="member-subtitle">{selectedMember.subtitle}</p>
            <p className="member-description">{selectedMember.description}</p>
          </div>
          <div className="image-content">
            <img
              src={selectedMember.image}
              alt={selectedMember.name}
              className="member-image"
            />
          </div>
        </div>
      </div>

      {/* Team member selection circles */}
      <div className="team-selector">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member">
            <button
              className={`team-circle ${member.id === selectedMember.id ? 'selected' : ''}`}
              onClick={() => handleMemberSelect(member)}
              aria-label={`Select ${member.name}`}
            >
              <img src={member.image} alt={member.name} />
            </button>
            <p className="member-label">{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
