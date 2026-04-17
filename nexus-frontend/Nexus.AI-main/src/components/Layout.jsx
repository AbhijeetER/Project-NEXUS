
import { Outlet } from "react-router-dom";
import Hero from "../Hero";
import FloatingPillNavbar from "./FloatingPillNavbar";
import { Features } from "../pages/Features";
import { Footer } from "../footer";
import { Boxes } from "./background-boxes";
import { cn } from "../lib/utils";
import Tabs from "../pages/tabs";
function Layout() {
    return (
      <>
       <Outlet />
       <Tabs />
           <Features></Features>
           
           <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
  
        <Boxes />
        <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
          <Footer />
        </h1>
      </div>
//       </>
     );
  }
 
export default Layout;