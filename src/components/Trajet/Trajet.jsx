import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getName, getDate } from '../../functions';
import Itinairaire from '../ItinairaireCard/ItinairaireCard';
import './Trajet.scss'
import BackButton from '../Button/BackButton/BackButton';
import tramblack from '../../media/images/tramblack.png'
import tramgreen from '../../media/images/tramgeen.png'
import busblack from '../../media/images/busblack.png'
import busgreen from '../../media/images/busgreen.png'

const Trajet = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_PATH;
  const { id } = useParams();
  const [listTrajet, setListTrajet] = useState(JSON.parse(localStorage.getItem('listTrajet')) || []);
  const [listItineraire, setListItineraire] = useState([]);
  let [onlyTram, setOnlyTram] = useState(true);
  let [onlyBus, setOnlyBus] = useState(false);
  
  // Start
  const [start, setStart] = useState('');
  const [startJson, setStartJson] = useState({});
  const [listStart, setListStart] = useState([]);
  const [isStartSelect, setIsStartSelect] = useState(true);
  
  // Finish
  const [finish, setFinish] = useState('');
  const [finishJson, setFinishJson] = useState({});
  const [listFinish, setListFinish] = useState([]);
  const [isFinishSelect, setIsFinishSelect] = useState(true);
  
  useEffect(() => {
    if (listTrajet) {
      setStartJson(listTrajet[id].startJson);
      setStart(getName(listTrajet[id].startJson.name));
      setFinishJson(listTrajet[id].finishJson);
      setFinish(getName(listTrajet[id].finishJson.name));
      getItineraire();
    }
  }, []);

  useEffect(() => {
    getItineraire();
  }, [onlyTram, onlyBus])
  
  useEffect(() => {
    const intervalId = setInterval(getItineraire, 30000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Functions
  const handleAdd = (e) => {
    if (isStartSelect && isFinishSelect){
      let trajet = {};
      let newListTrajet = listTrajet;
      trajet = {startJson, finishJson};
      newListTrajet[id] = trajet;
      localStorage.setItem('listTrajet', JSON.stringify(newListTrajet));
      navigate('/');
    } else {
      alert('select a start and a finish');
    }
  }

  const handleDelete = (e) => {
      let newListTrajet = listTrajet;
      newListTrajet.splice(id, 1);
      localStorage.setItem('listTrajet', JSON.stringify(newListTrajet));
      navigate("/");
  }

  const handleOnlyTram = (e) => {
    setOnlyTram(onlyTram ? false : true);
  }

  const isOnlyTram = (itinairaire) => {
    let result = true;
    itinairaire.sections.map(section => {
      if (section.type == "TRANSPORT" && section.lines && section.lines.type.name != "Tramway"){
        result = false;
      }
    })
    return result;
  }
  
  const handleOnlyBus = (e) => {
    setOnlyBus(onlyBus ? false : true);
  }

  const isOnlyBus = (itinairaire) => {
    let result = true;
    itinairaire.sections.map(section => {
      if (section.type == "TRANSPORT" && section.lines && section.lines.type.name == "Tramway"){
        result = false;
      }
    })
    return result;
  }

  const getListSection = (itinairaire) => {
    let listSection = [];
    itinairaire.sections.map(section => {
      if (section.type == "PIED"){
        listSection.push("P");
      } else if (section.type == "TRANSPORT") {
        if ( ["1", "2", "3"].includes(section.lines.shortName)) {
          listSection.push("T" + section.lines.shortName);
        } else {
          listSection.push(section.lines.shortName);
        }

      }
    })
    return listSection.toString()
  }
  
  // API
  const getItineraire = async () => {
    const queryParams = 
      // `from[name]=${encodeURIComponent(from.name)}` +
      `&from[externalCode]=${listTrajet[id].startJson.externalCode}` +
      `&from[type]=${listTrajet[id].startJson.type}` +
      // `&from[typeExtra]=${encodeURIComponent(from.typeExtra)}` +
      // `&from[coord][lat]=${from.coord.lat}` +
      // `&from[coord][lng]=${from.coord.lng}` +
      // `&from[id]=${encodeURIComponent(from.id)}` +
      // `&to[name]=${encodeURIComponent(to.name)}` +
      `&to[externalCode]=${listTrajet[id].finishJson.externalCode}` +
      `&to[type]=${listTrajet[id].finishJson.type}` +
      // `&to[typeExtra]=${encodeURIComponent(to.typeExtra)}` +
      // `&to[coord][lat]=${to.coord.lat}` +
      // `&to[coord][lng]=${to.coord.lng}` +
      // `&to[id]=${encodeURIComponent(to.id)}` +
      `&datetime=` +
      `&datetype=now` +
      `&mode[]=0` +
      `&extra[perturbation]=false` +
      `&extra[acccessibitlity]=false`;

      const url = `${api}/referentiel/getitineraire?${queryParams}`;

      const response = await fetch(url);
      const json = await response.json();
      let newListItinairaire = [];
      json.map(itinairaire => {
        if ((!onlyTram && !onlyBus )|| (onlyTram && isOnlyTram(itinairaire)) || (onlyBus && isOnlyBus(itinairaire))){
          newListItinairaire.push({"start": getDate(itinairaire.departDate), "finish": getDate(itinairaire.arriveeDate), "listSection": getListSection(itinairaire) })
        }
      })
      setListItineraire(newListItinairaire);
  }

  // Start API 
  const setListStartStations = async (name) => {
    const response = await fetch(`${api}/referentiel/autocomplete?s=cityway&q=${name}`);
    const json = await response.json();
    setListStart(json);
  }

  // Finish API
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
      <div className="parameters">
        {
        onlyTram 
        ? <div className='icon green' onClick={(e) => {handleOnlyTram(e)}}>
            <img src={tramgreen} height='45px'></img>
          </div>
        : <div className='icon black' onClick={(e) => {handleOnlyTram(e)}}>
            <img src={tramblack} height='45px'></img>
          </div>
        }
        {
        onlyBus 
        ? <div className='icon green bus' onClick={(e) => {handleOnlyBus(e)}}>
            <img src={busgreen} height='39px'></img>
          </div>
        : <div className='icon black bus' onClick={(e) => {handleOnlyBus(e)}}>
            <img src={busblack} height='39px'></img>
          </div>}
      </div>
      {listItineraire.length != 0
      ? listItineraire.map( (itinairaire, index) => (
        <Itinairaire
            key={index}
            id={index}
            start={itinairaire.start}
            finish={itinairaire.finish}
            listSection = {itinairaire.listSection}>  
          </Itinairaire>
      ))
      : <p className='empty'>Loading ...</p>}
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
