import './Home.scss';
import NewButton from './NewButton/NewButton';
import Trajet from '../TrajetCard/TrajetCard';
import { useState, useEffect } from 'react';

const Home = () => {
  const [listTrajet, setListTrajet] = useState([]);
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
  }, [listTrajet]);

  // Functions
  const getName = (longName) => {
    const pattern = /^[^(]+/;
    const result = longName.match(pattern);
    return result;
  }

  return (
    <div className='home'>
      <div className="titre2">Favoris</div>
      {listStationsTrajet
      ? listStationsTrajet.map( (trajet, index) => (
        <Trajet key={index} start={trajet.start}  finish={trajet.finish}></Trajet>
      ))
      : <p>Ajouter un trajet</p>}
      <NewButton></NewButton>
    </div>
  );
}

export default Home;
