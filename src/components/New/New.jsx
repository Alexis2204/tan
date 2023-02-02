import { useState } from 'react';
import './New.scss'
import BackButton from './BackButton/BackButton';

const New = () => {
  // Start
  const [start, setStart] = useState('');
  const [listStart, setListStart] = useState([]);
  const [isStartSelect, setIsStartSelect] = useState(false);

  // Finish
  const [finish, setFinish] = useState('');
  const [listFinish, setListFinish] = useState([]);
  const [isFinishSelect, setIsFinishSelect] = useState(false);

  
  // Functions
  const getName = (longName) => {
    const pattern = /^[^(]+/;
    const result = longName.match(pattern);
    return result;
  }

  const handleAdd = (e) => {
    if (isStartSelect && isFinishSelect){
      alert(start, finish)
    } else {
      alert('select a start and a finish')
    }
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
    setListStartStations(e.target.value);
  }

  const selectStart = (item, e) => {
    setStart(getName(item.name));
    setListStart([]);
    setIsStartSelect(true);
  }

  // Finish functions
  const handleChangeFinish = (e) => {
    setFinish(e.target.value);
    setIsFinishSelect(false);
    setListFinishStations(e.target.value);
  }

  const selectFinish = (item, e) => {
    setFinish(getName(item.name));
    setListFinish([]);
    setIsFinishSelect(true);
  }


  return (
    <div className='new' >
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
      <BackButton></BackButton>
      <div className='Button ButtonAdd' onClick={(e) => {handleAdd(e)}}>
        Ajouter
      </div>
    </div>
  );
}

export default New;
