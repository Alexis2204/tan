import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Trajet.scss'
import BackButton from '../Button/BackButton/BackButton';

const Trajet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listTrajet, setListTrajet] = useState(JSON.parse(localStorage.getItem('listTrajet')) || []);

  
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
  
  useEffect(() => {
    if (listTrajet) {
      setStartJson(listTrajet[id].startJson);
      setStart(getName(listTrajet[id].startJson.name));
      setFinishJson(listTrajet[id].finishJson);
      setFinish(getName(listTrajet[id].finishJson.name));
    }
  }, []);
  
  // Functions
  const getName = (longName) => {
    const pattern = /^[^(]+/;
    const result = longName.match(pattern);
    return result;
  }

  // TO DO : change to handleModify
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
      alert('select a start and a finish')
    }
  }

  const handleDelete = (e) => {
      let newListTrajet = listTrajet;
      newListTrajet.splice(id, 1);
      localStorage.setItem('listTrajet', JSON.stringify(newListTrajet));
      navigate("/");
  }
  
  // API
  // Start API 
  const setListStartStations = async (name) => {
    const response = await fetch(`http://localhost:3000/referentiel/autocomplete?s=cityway&q=${name}`);
    const json = await response.json();
    setListStart(json);
  }

  // Finish
  const setListFinishStations = async (name) => {
    const response = await fetch(`http://localhost:3000/referentiel/autocomplete?s=cityway&q=${name}`);
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
    <div className='trajet' >
      <div className='search'>
        <input type="texte" placeholder='Départ' id='start' value={start} onChange={(e) => {handleChangeStart(e)}} />
        <ul className='searchList'>
          {listStart.filter(item => item.type == 0).map(item => (
            <li key={item.externalCode} onClick={(e) => {selectStart(item, e)}}>
              {getName(item.name)}
            </li>
          ))}
        </ul>
      </div>
      <div className='search'>
        <input type="texte" placeholder='Arrivée' id='finish' value={finish} onChange={(e) => {handleChangeFinish(e)}} />
        <ul className='searchList'>
          {listFinish.filter(item => item.type == 0).map(item => (
            <li key={item.externalCode} onClick={(e) => {selectFinish(item, e)}}>
              {getName(item.name)}
            </li>
          ))}
        </ul>
      </div>
      <div className='Button ButtonDelete' onClick={(e) => {handleDelete(e)}}>
        Supprimer
      </div>
      <BackButton></BackButton>
      <div className='Button ButtonModify' onClick={(e) => {handleAdd(e)}}>
        Modifier
      </div>
    </div>
  );
}

export default Trajet;
