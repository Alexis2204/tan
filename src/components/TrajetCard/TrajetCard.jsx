import './TrajetCard.scss'
import { useNavigate } from 'react-router-dom';

const TrajetCard = (props) => {
  const {id, start, finish} = props;
  const navigate = useNavigate();
  const goToTrajet = (index, e) => {
    navigate('trajet/' + index);
  }
  return (
    <div className="trajet-card">
      <div className="titre3" onClick={(e) => {goToTrajet(id, e)}}>Trajet {id + 1}</div>
      <div className="content">
        <div className='inline'>
          <b>Start : </b><p>{start}</p>
        </div>
        <br></br>
        <div className='inline'>
          <b>End : </b><p>{finish}</p>
        </div>
      </div>
    </div>
  );
}

export default TrajetCard;
