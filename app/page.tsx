
import { Footer } from "./Components/Footer";
import MapComponent from "./Components/Map";
import RenderMap from "./Components/RenderMap";
export default function Home() {
  return (
   <div className="h-screen">
   <RenderMap/>
   <Footer/>
   </div>
  );
}
