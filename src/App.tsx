import Router from './routes/Router';
import CustomTheme from './themes/CustomTheme';
import ScrollTop from "./components/ScrollTop.tsx";


const App = () => {
  return (
    <CustomTheme>
        <ScrollTop>
            <Router />
        </ScrollTop>
    </CustomTheme>
  )
}

export default App;
