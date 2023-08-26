import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getName } from '../../functions';
import './New.scss'
import BackButton from '../Button/BackButton/BackButton';

const New = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_PATH;
  // Start
  const [start, setStart] = useState('');
  const [startJson, setStartJson] = useState({});
  const [listStart, setListStart] = useState([]);
  const [isStartSelect, setIsStartSelect] = useState(false);

  // Finish
  const [finish, setFinish] = useState('');
  const [finishJson, setFinishJson] = useState({});
  const [listFinish, setListFinish] = useState([]);
  const [isFinishSelect, setIsFinishSelect] = useState(false);

  
  // Functions

  const handleAdd = (e) => {
    if (isStartSelect && isFinishSelect){
      let trajet = {};
      let listTrajet = localStorage.getItem('listTrajet');
      if (!listTrajet){
        trajet = {startJson, finishJson};
        listTrajet = [trajet];
      } else {
        listTrajet = JSON.parse(listTrajet);
        trajet = {startJson, finishJson};
        listTrajet.push(trajet);
      }
      localStorage.setItem('listTrajet', JSON.stringify(listTrajet));
      navigate("/");
    } else {
      alert('select a start and a finish');
    }
  }
  
  // API
  // Start API 
  const setListStartStations = async (name) => {
    const response = await fetch(`${api}/referentiel/autocomplete?s=cityway&q=${name}`);
    const json = await response.json();
    setListStart(json);
  }

  // Finish
  const setListFinishStations = async (name) => {
    const response = await fetch(`${api}/referentiel/autocomplete?s=cityway&q=${name}`);
    const json = await response.json();
    setListFinish(json);
  }

  // Start functions
  const handleChangeStart = (e) => {
    setStart(e.target.value);
    setIsStartSelect(false);
    setStartJson({});
    setListStartStations(e.target.value);
  }

  const selectStart = (item, e) => {
    setStart(getName(item.name));
    setListStart([]);
    setIsStartSelect(true);
    setStartJson(item);
  }

  // Finish functions
  const handleChangeFinish = (e) => {
    setFinish(e.target.value);
    setIsFinishSelect(false);
    setFinishJson({});
    setListFinishStations(e.target.value);
  }

  const selectFinish = (item, e) => {
    setFinish(getName(item.name));
    setListFinish([]);
    setIsFinishSelect(true);
    setFinishJson(item);
  }


  return (
    <div className='new' >
      <div className='search'>
        <input type="texte" placeholder='Départ' autoComplete='off' id='start' value={start} onChange={(e) => {handleChangeStart(e)}} />
        <ul className='searchList'>
          {listStart.filter(item => item.type == 0).map(item => (
            <li key={item.externalCode} onClick={(e) => {selectStart(item, e)}}>
              {getName(item.name)}
            </li>
          ))}
        </ul>
      </div>
      <div className='search'>
        <input type="texte" placeholder='Arrivée' autoComplete='off' id='finish' value={finish} onChange={(e) => {handleChangeFinish(e)}} />
        <ul className='searchList'>
          {listFinish.filter(item => item.type == 0).map(item => (
            <li key={item.externalCode} onClick={(e) => {selectFinish(item, e)}}>
              {getName(item.name)}
            </li>
          ))}
        </ul>
      </div>
      <BackButton></BackButton>
      <div className='Button ButtonAdd' onClick={(e) => {handleAdd(e)}}>
        Ajouter
      </div>
    </div>
  );
}

export default New;
