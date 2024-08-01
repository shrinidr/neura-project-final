
import Bottom from "../components/Bottom"

import HeaderHome from "../components/header_home";
import MainHeading from "../components/MainHeading"


function App(){

  let text1 = "Understand how you are evolving with Neura. ";
  let text2 = " Record your thoughts, emotions and fears within minutes ";
  let text3 = "and get access to a personalized data repository";
  let text4 = " of your mental growth. ";
  return (
    <div>
      <HeaderHome/>
      <MainHeading/>
      <Bottom text1= {text1} text2={text2} text3= {text3} text4= {text4}/>
    </div>
  )
}

export default App
