import './ListTrajet.scss'
import Trajet from '../components/TrajetCard/TrajetCard';
import { useNavigate } from 'react-router-dom';

const ListTrajet = (props) => {
  const {listTrajet} = props;
  const navigate = useNavigate();
  const goToTrajet = (index, e) => {
    navigate('trajet/' + index);
  }
  
  return (
  <div className='listTrajet'>
    {listTrajet.length != 0
    ? listTrajet.map( (trajet, index) => (
      <div key={index} onClick={(e) => {goToTrajet(index, e)}}>
        <Trajet
        id={index}
        start={trajet.start}
        finish={trajet.finish}>  
        </Trajet>
      </div>
    ))
    : <p className='empty'>Ajouter un trajet</p> 
  }
  </div>
  );
}

export default ListTrajet;
