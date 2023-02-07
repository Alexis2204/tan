import './Home.scss';
import NewButton from '../Button/NewButton/NewButton';
import ListTrajet from '../ListTrajet/ListTrajet';
import { getName } from '../../functions';
import { useState, useEffect } from 'react';

const Home = () => {
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

  return (
    <div className='home'>
      <div className="titre2">Favoris</div>
      {listStationsTrajet.length != 0
      ? <ListTrajet listTrajet={listStationsTrajet} ></ListTrajet>
      : <p className='empty'>Ajouter un trajet</p>}
      <NewButton></NewButton>
    </div>
  );
}

export default Home;
