import { IonApp } from "@ionic/react";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <IonApp>
      <Dashboard />
      <Toaster position="top-right" richColors duration={3000} closeButton />
    </IonApp>
  );
}

export default App;
