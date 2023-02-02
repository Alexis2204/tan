import './Home.scss'
import NewButton from './NewButton/NewButton';
import Trajet from '../TrajetCard/TrajetCard'

const Home = () => {
  return (
    <div className='home'>
      <div className="titre2">Favoris</div>
      <Trajet></Trajet>
      <NewButton></NewButton>
    </div>
  );
}

export default Home;
