import MainForm from './MainForm';
import Messages from './Messages';

const MainPage = () => {
  return (
    <>
      <h2 className="text-center mb-4">Messenger</h2>
      <Messages/>
      <MainForm/>
    </>
  );
};

export default MainPage;