import './Home.scss';
import NewButton from '../Button/NewButton/NewButton';
import Trajet from '../TrajetCard/TrajetCard';
import { getName } from '../../functions';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [listTrajet, setListTrajet] = useState(JSON.parse(localStorage.getItem('listTrajet')) || []);
  const [listStationsTrajet, setListStationsTrajet] = useState([]);

  useEffect(() => {
    const storedListTrajet = localStorage.getItem('listTrajet');
    const stationsTrajet = [];
    if (storedListTrajet) {
      setListTrajet(JSON.parse(storedListTrajet));
      listTrajet.map(trajet => {
        stationsTrajet.push({"start" : getName(trajet.startJson.name), "finish": getName(trajet.finishJson.name)})
      });
      setListStationsTrajet(stationsTrajet);
    }
  }, []);

  // Functions
  const goToTrajet = (index, e) => {
    navigate('trajet/' + index);
  }

  return (
    <div className='home'>
      <div className="titre2">Favoris</div>
      {listStationsTrajet.length != 0
      ? listStationsTrajet.map( (trajet, index) => (
        <div key={index} onClick={(e) => {goToTrajet(index, e)}}>
          <Trajet
            id={index}
            start={trajet.start}
            finish={trajet.finish}>  
          </Trajet>
        </div>
      ))
      : <p className='empty'>Ajouter un trajet</p>}
      <NewButton></NewButton>
    </div>
  );
}

export default Home;
