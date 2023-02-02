import './TrajetCard.scss'

const TrajetCard = (props) => {
  const {start, finish} = props;
  return (
    <div className="trajet-card">
      <div className="titre3">Trajet 1</div>
      <div className="content">
        <p>Start : {start}</p>
        <br></br>
        <p>End : {finish}</p>
      </div>
    </div>
  );
}

export default TrajetCard;
