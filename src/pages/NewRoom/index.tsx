import { FormEvent, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import Room from "../../components/Room";
import useMyRooms from "../../hooks/useMyRooms";

const NewRoom = () => {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState("");
  const history = useHistory();
  const { dataRooms } = useMyRooms();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    const userRoomRef = database.ref(`users/${user?.id}/${firebaseRoom.key}`);

    await userRoomRef.update({
      title: newRoom,
      authorId: user?.id,
      roomKey: firebaseRoom.key,
      countResponses: 0,
      countQuestions: 0,
    });

    history.push(`/admin/rooms/${firebaseRoom.key}`);
  }

  return (
    <div className="md:flex lg:flex-row sm:flex-col items-center h-screen">
      <aside
        className="flex-3 sm:py-14 bg-blue-50 md:h-full flex flex-col items-center text-p-white justify-around 
        py-8 px-10
      "
      >
        <div>
          <img
            className="sm:max-w-xs 2xl:max-w-full 2xl:mt-24 mb-5"
            src={logo}
            alt="Ilustração simbolizando perguntas e respostas"
          />
          <div className="flex flex-col">
            <p className="text-lg leading-8 mt-4 text-p-black">
              Proporcionando comunicações inteligentes
            </p>
          </div>
        </div>
        <p className="text-sm text-p-gray-dark">
          Quer entrar em uma sala existente?{" "}
          <Link
            to="/"
            className="text-indigo-500 hover:text-indigo-600 transition duration-150"
          >
            clique aqui
          </Link>
        </p>
      </aside>
      <main className="flex-8 flex-col h-screen p-5 dark:bg-gray-900">
        <div
          style={{ height: "max-content" }}
          className="flex flex-row text-center bg-white px-5 py-8 h-auto rounded w-7/12"
        >
          <div className="w-full text-left">
            <h1 className="font-display text-xl my-2 text-p-black font-semibold">
              Criar uma nova sala
            </h1>
            <form className="flex flex-row gap-3" onSubmit={handleCreateRoom}>
              <input
                className="h-12 rounded-lg w-full px-4 bg-white border-2 
              border-p-gray focus:outline-none transition duration-150 focus:ring-2 
              focus:border-transparent focus:ring-blue-400"
                type="text"
                onChange={(event) => setNewRoom(event.target.value)}
                value={newRoom}
                placeholder="Nome da sala"
              />
              <Button
                type="submit"
                className="w-max p-1 bg-blue-600 rounded-md"
              >
                <FiPlus size={40} color="white" />
              </Button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 my-5">
          {dataRooms.map((dataRoom) => (
            <Room
              authorId={dataRoom.authorId}
              countQuestions={dataRoom.countQuestions}
              countResponses={dataRoom.countResponses}
              endedAt={dataRoom.endedAt}
              key={dataRoom.roomKey}
              roomKey={dataRoom.roomKey}
              title={dataRoom.title}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default NewRoom;
