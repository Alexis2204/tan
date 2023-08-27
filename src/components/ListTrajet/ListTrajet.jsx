import './ListTrajet.scss'
import Trajet from '../TrajetCard/TrajetCard';
import { useNavigate } from 'react-router-dom';

const ListTrajet = (props) => {
  const {listTrajet} = props;
  const navigate = useNavigate();
  const goToTrajet = (index, e) => {
    setTimeout(() => {
      navigate('trajet/' + index); // Use `id` instead of `index`
    }, 200);  
  }

  return (
  <div className='listTrajet'>
    {listTrajet.length != 0
    ? listTrajet.map( (trajet, index) => (
      <div key={index} 
        onClick={(e) => {goToTrajet(index, e)}}
        className="trajet-item"
        >
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
