import HeaderHome from "../components/header_home";
import MainHeading from "../components/MainHeading"
import Bottom from "../components/Bottom"
import Footer from "../components/Footer";


function App(){

  let text1 = "Understand how you are evolving with Neura. ";
  let text2 = "Record your thoughts, emotions and fears within minutes";
  let text3 = "Get access to a personalized repository of your mental growth";


  
  return (
    <div>
      <HeaderHome/>
      <MainHeading/>
      <Bottom text1={text1} text2={text2} text3={text3} text4={""}/>
      <Footer/>
    </div>
  )
}

export default App
