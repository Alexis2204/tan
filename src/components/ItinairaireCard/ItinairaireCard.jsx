import './ItinairaireCard.scss'

const ItinairaireCard = (props) => {
  const {id, start, finish, listSection} = props;

  return (
    <div className="itinairaire-card">
      <div className="titre3"><div>Trajet {id + 1}</div> <b>{listSection}</b></div>
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

export default ItinairaireCard;
