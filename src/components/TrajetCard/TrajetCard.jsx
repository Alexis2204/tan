import './TrajetCard.scss'

const TrajetCard = (props) => {
  const {id, start, finish} = props;
  return (
    <div className="trajet-card">
      <div className="titre3">Trajet {id + 1}</div>
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
