import './Home.scss';
import NewButton from '../Button/NewButton/NewButton';
import Trajet from '../TrajetCard/TrajetCard';
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
  const getName = (longName) => {
    const pattern = /^[^(]+/;
    const result = longName.match(pattern);
    return result;
  }

  const goToTrajet = (index, e) => {
    navigate('trajet/' + index);
  }

  return (
    <div className='home'>
      <div className="titre2">Favoris</div>
      {listStationsTrajet
      ? listStationsTrajet.map( (trajet, index) => (
        <div key={index} onClick={(e) => {goToTrajet(index, e)}}>
          <Trajet
            start={trajet.start}
            finish={trajet.finish}>  
          </Trajet>
        </div>
      ))
      : <p>Ajouter un trajet</p>}
      <NewButton></NewButton>
    </div>
  );
}

export default Home;
