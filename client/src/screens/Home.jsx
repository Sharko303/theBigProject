import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/home.jpg'


export const Home = () => {
    // on change le titre de notre page
        document.title = "E-Sport | Accueil";
    return (
        <div>
            <div className="img-fluid"
                style={{
                    paddingTop: '50px',
                    backgroundImage: `url(${Img})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: '100vh',
                    backgroundAttachment: 'fixed',
                }}>

            </div>
            <Menu color="navbar-dark"/>
            <a href="/connexion"> Test </a>
            <Footer color="bg-light"/>
        </div>
    )
}