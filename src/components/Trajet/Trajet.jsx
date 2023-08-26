import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getName, getDate, formatTimestamp } from '../../functions';
import Itinairaire from '../ItinairaireCard/ItinairaireCard';
import './Trajet.scss'
import BackButton from '../Button/BackButton/BackButton';
import tramblack from '../../media/images/tramblack.png'
import tramgreen from '../../media/images/tramgeen.png'
import busblack from '../../media/images/busblack.png'
import busgreen from '../../media/images/busgreen.png'
import reloadblack from '../../media/images/reloadblack.png'
import reloadgreen from '../../media/images/reloadgreen.png'

const Trajet = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API_PATH;
  const { id } = useParams();
  const [listTrajet, setListTrajet] = useState(JSON.parse(localStorage.getItem('listTrajet')) || []);
  const [listItineraire, setListItineraire] = useState([]);
  const [onlyTram, setOnlyTram] = useState(true);
  const [onlyBus, setOnlyBus] = useState(false);
  const [reload, setReload] = useState(false);
  const [lastDateStart, setLastDateStart] = useState();
  
  // Start
  const [start, setStart] = useState('');
  const [startJson, setStartJson] = useState();
  const [listStart, setListStart] = useState([]);
  const [isStartSelect, setIsStartSelect] = useState(true);
  
  // Finish
  const [finish, setFinish] = useState('');
  const [finishJson, setFinishJson] = useState();
  const [listFinish, setListFinish] = useState([]);
  const [isFinishSelect, setIsFinishSelect] = useState(true);
  
  useEffect(() => {
    if (listTrajet) {
      setStartJson(listTrajet[id].startJson);
      setStart(getName(listTrajet[id].startJson.name));
      setFinishJson(listTrajet[id].finishJson);
      setFinish(getName(listTrajet[id].finishJson.name));
    }
  }, []);

  useEffect(() => {
    getItineraire();
  }, [onlyTram, onlyBus, startJson, finishJson])

  useEffect(() => {
    getMoreItineraire(lastDateStart);
  }, [lastDateStart])
  
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

  const handleReload = (e) => {
    setReload(reload ? false : true);
    setStart(getName(finishJson.name));
    setFinish(getName(startJson.name));
    setStartJson(finishJson);
    setFinishJson(startJson);
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
  const getMoreItineraire = async (date) => {
    if (startJson && finishJson){
      let startDate = formatTimestamp(date);
      const queryParams = 
        `from[externalCode]=${startJson.externalCode}` +
        `&from[type]=${startJson.type}` +
        `&to[externalCode]=${finishJson.externalCode}` +
        `&to[type]=${finishJson.type}` +
        `&datetime=${startDate}` +
        `&datetype=before` +
        `&mode[]=0` +
        `&extra[perturbation]=false` +
        `&extra[acccessibitlity]=false`;

      const url = `${api}/referentiel/getitineraire?${queryParams}`;
      
      let newListItinairaire = [];
      const response = await fetch(url);
      const json = await response.json();
      json.map(itinairaire => {
        if ((!onlyTram && !onlyBus )|| (onlyTram && isOnlyTram(itinairaire)) || (onlyBus && isOnlyBus(itinairaire))){
          newListItinairaire.push({"start": getDate(itinairaire.departDate), "finish": getDate(itinairaire.arriveeDate), "listSection": getListSection(itinairaire) });
        }
      })
      if (newListItinairaire.length != 0){
        let concatList = listItineraire.concat(newListItinairaire);
        setListItineraire(concatList.filter((x, i) => concatList.indexOf(x) === i)); 
      }
    }
  }

  const getItineraire = async () => {
    if (startJson && finishJson){
      const queryParams = 
        // `from[name]=${encodeURIComponent(from.name)}` +
        `&from[externalCode]=${startJson.externalCode}` +
        `&from[type]=${startJson.type}` +
        // `&from[typeExtra]=${encodeURIComponent(from.typeExtra)}` +
        // `&from[coord][lat]=${from.coord.lat}` +
        // `&from[coord][lng]=${from.coord.lng}` +
        // `&from[id]=${encodeURIComponent(from.id)}` +
        // `&to[name]=${encodeURIComponent(to.name)}` +
        `&to[externalCode]=${finishJson.externalCode}` +
        `&to[type]=${finishJson.type}` +
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
      
      let newListItinairaire = [];
      let listDateStart = [];
      const response = await fetch(url);
      const json = await response.json();
      json.map(itinairaire => {
        if ((!onlyTram && !onlyBus )|| (onlyTram && isOnlyTram(itinairaire)) || (onlyBus && isOnlyBus(itinairaire))){
          newListItinairaire.push({"start": getDate(itinairaire.departDate), "finish": getDate(itinairaire.arriveeDate), "listSection": getListSection(itinairaire) });
          listDateStart.push(itinairaire.departDate);
        }
      })
      if (listDateStart.length != 0){
        setLastDateStart(listDateStart[listDateStart.length - 1]);
      }
      setListItineraire(newListItinairaire); 
    }
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
        <input type="texte" placeholder='Départ' autoComplete='off' id='start' value={start} onChange={(e) => {handleChangeStart(e)}} />
        <ul className='searchList'>
          {listStart.filter(item => item.type == 0).map(item => (
            <li key={item.externalCode} onClick={(e) => {selectStart(item, e)}}>
              {getName(item.name)}
            </li>
          ))}
        </ul>
      </div>
      {reload 
      ?
      <div className='icon green reload animtrue' onClick={(e) => {handleReload(e)}}>
            <img src={reloadgreen} height='45px'></img>
      </div>
      :
      <div className='icon black reload animfalse' onClick={(e) => {handleReload(e)}}>
            <img src={reloadblack} height='45px'></img>
      </div>}
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
