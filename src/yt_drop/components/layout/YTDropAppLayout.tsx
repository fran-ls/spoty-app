import "../../assets/css/index.css";
import Header from "./Header";

const YTDropAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="yt-drop">
      <Header />

      {children}
    </div>
  )
}

export default YTDropAppLayout;