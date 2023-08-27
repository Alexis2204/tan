import './TrajetCard.scss'
import React, { useState } from 'react';

const TrajetCard = (props) => {
  const {id, start, finish} = props;
  const [isZoomed, setIsZoomed] = useState(false);

  const handleCardClick = () => {
    setIsZoomed(!isZoomed); // Toggle the zoom state on click
  };

  return (
    <div className={`trajet-card ${isZoomed ? 'zoomed' : ''}`} // Apply the zoomed class conditionally
      onClick={handleCardClick}>
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
