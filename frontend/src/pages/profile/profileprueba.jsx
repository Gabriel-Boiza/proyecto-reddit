import { useParams } from "react-router-dom";

const ProfilePrueba = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Perfil de usuario con ID: {id}</h1>
    </div>
  );
};

export default ProfilePrueba;
