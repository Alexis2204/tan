import { Link } from 'react-router-dom';
import './BackButton.scss'

const BackButton = () => {
  return (
    <Link to="/">
      <div className='backbutton'>
        <div className='padding'>
          <div className='line1'></div>
          <div className='line2'></div>
          <div className='line3'></div>
        </div>
      </div>
    </Link>
  );
}

export default BackButton;