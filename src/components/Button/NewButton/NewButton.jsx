import { Link } from 'react-router-dom';
import './NewButton.scss'

const NewButton = () => {
  return (
    <Link to="/new">
      <div className='newbutton'>
        <div className='padding'>
          <div className='line1'></div>
          <div className='line2'></div>
        </div>
      </div>
    </Link>
  );
}

export default NewButton;
