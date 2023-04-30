import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Home() {
  return (
    <div className="home__container">
      <div className="home">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
