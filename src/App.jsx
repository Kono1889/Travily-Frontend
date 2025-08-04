import "./App.css";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Layout />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
