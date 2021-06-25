import { useHistory } from "react-router-dom";

import illustrationImg from "../../assets/images/illustration.svg";
import logoImg from "../../assets/images/logo.svg";
import googleIconImg from "../../assets/images/google-icon.svg";

import Button from "../../components/Button";

import "./styles.css";
import { useAuth } from "../../hooks/useAuth";
import { FormEvent } from "react";
import { useState } from "react";
import { database } from "../../services/firebase";

const Home = () => {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room does not exists.");
      return;
    }

    if (roomRef.val().endedAt) {
      alert("Room already closed");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div className="md:flex lg:flex-row sm:flex-col items-center h-screen">
      <aside
        className="flex-7 sm:py-14 bg-blue-700 md:h-full flex flex-col items-center text-p-white justify-around 
        py-8 px-10
      "
      >
        <div>
          <img
            className="sm:max-w-xs 2xl:max-w-full 2xl:mt-24 mb-5"
            src={illustrationImg}
            alt="Ilustração simbolizando perguntas e respostas"
          />
          <div className="flex flex-col">
            <strong className="font-bold text-4xl font-display leading-10 mt-4">
              Crie salas de perguntas ao vivo
            </strong>
            <p className="text-2xl leading-8 mt-4 text-p-white">
              Seus alunos ficarão impressionados! :)
            </p>
          </div>
        </div>
      </aside>
      <main className="flex-8 flex px-8 items-center justify-center pb-10 pt-5">
        <div className="flex flex-col w-full max-w-xs items-stretch text-center">
          <img src={logoImg} alt="Letmeask" className="self-center" />
          <button
            onClick={handleCreateRoom}
            className="mt-16 h-14 rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-colors delay-75 text-white flex justify-center items-center cursor-pointer border-0"
          >
            <img src={googleIconImg} alt="Icone do google" className="mr-2" />
            Crie sua sala com o Google
          </button>
          <div className="text-sm text-p-gray my-8 flex items-center or-entry">
            ou entre em uma sala
          </div>
          <form className="flex flex-col gap-y-3" onSubmit={handleJoinRoom}>
            <input
              className="h-12 rounded-lg w-full px-4 bg-white border-2 
              border-p-gray focus:outline-none transition duration-150 focus:ring-2 
              focus:border-transparent focus:ring-blue-400"
              type="text"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
