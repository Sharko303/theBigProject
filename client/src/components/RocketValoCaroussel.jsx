import { Carousel } from 'react-bootstrap';
import ValoCaroussel from '../images/valorant_caroussel.webp'
import RocketCaroussel from '../images/rocket_caroussel.webp'
import TableauCaroussel from '../images/tableau_caroussel.webp'
export const RocketValoCaroussel = () => {
    return (
        <Carousel variant="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={ValoCaroussel}
                    alt="Valorant"
                />
                <Carousel.Caption className='text-white'>
                    <h3>Valorant</h3>
                    <p className='fw-bold'>Participez et créer des tournois sur Valorant</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
            <img
                    className="d-block w-100"
                    src={RocketCaroussel}
                    alt="Rocket league"
                />
                <Carousel.Caption className='text-white'>
                    <h3>Rocket League</h3>
                    <p className='fw-bold'>Participez et créer des tournois sur Rocket Leaque</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={TableauCaroussel}
                    alt="Tableau tournois"
                />
                <Carousel.Caption className='text-white'>
                    <h3>Forme Tournois</h3>
                    <p className='fw-bold'>Tournois disposant 16 joueurs !</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}