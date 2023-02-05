import './ListTrajet.scss'
import Trajet from '../components/TrajetCard/TrajetCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ListTrajet = (props) => {
  const {listTrajet} = props;
  const navigate = useNavigate();
  const goToTrajet = (index, e) => {
    navigate('trajet/' + index);
  }
  
  useEffect(() => {
    // Select the container element and create an array of all the items
    const container = document.querySelector('.listTrajet');
    if (container){
      
      const items = Array.from(container.children);
    
      // Add the necessary classes for the vertical carousel
      container.classList.add('listTrajet-container');
      items.forEach(item => item.classList.add('listTrajet-item'));
    
      // Calculate the height of the items based on the container height
      const itemHeight = container.offsetHeight;
      items.forEach(item => {
        item.style.height = `${itemHeight}px`;
      });
    
      // Handle touch events to swipe up and down
      let startY;
      let currentY;
      let isSwiping = false;
      container.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
        isSwiping = true;
      });
      container.addEventListener('touchmove', e => {
        if (!isSwiping) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        container.scrollTop += diff;
      });
      container.addEventListener('touchend', () => {
        isSwiping = false;
      });
      // Handle mouse events to scroll up and down
      container.addEventListener('wheel', e => {
        container.scrollTop += e.deltaY;
      });
    }
  }, [listTrajet]);

  
  return (
    <div className='listTrajetGlobal'>
      <div className='listTrajet'>
        {listTrajet.length != 0
        ? listTrajet.map( (trajet, index) => (
          <div key={index}>
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
      <div className='background'></div>
    </div>
  );
}

export default ListTrajet;
