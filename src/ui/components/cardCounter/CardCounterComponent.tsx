import { FC, useContext } from 'react';
import { MdAdd, MdList } from 'react-icons/md';
import { Link } from 'react-router-dom';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import './CardCounterComponent.scss';
import CardCounterComponentProps from './CardCounterComponentProps';


const CardCounterComponent: FC<CardCounterComponentProps> = ({ title, counter, add, seeAllUrl }) => {
  const {i18n} = useContext(LanguageContext) as LanguageContextType;
  return <div className="card_counter_component card">
    <div className="card-body">
      <div className="row">
        <div className="col-12">
          <div className="counter_container">
            {counter}
          </div>
        </div>
        <div className="col-12 text-center mb-2">
          <strong className="text-center w-100">{title}</strong>
        </div>
        <div className="col-12 d-flex justify-content-between">
          {seeAllUrl != undefined && <Link to={seeAllUrl} style={{ textDecoration: 'none', color: 'currentcolor' }}
            className="d-flex align-items-center px-1">
            <MdList size={24} />
            <span className='ms-1'>{i18n(KeyWordLocalization.CardCounterComponentSeeAll)}</span>
          </Link>}
          {add != undefined && <div onClick={add} className="d-flex align-items-center hover px-1">
            <MdAdd size={24} />
            <span className='ms-1'>{i18n(KeyWordLocalization.CardCounterComponentAddOne)}</span>
          </div>}
        </div>
      </div>
    </div>
  </div>
};

CardCounterComponent.defaultProps = {
  seeAllUrl: undefined,
  add: undefined,
}

export default CardCounterComponent;
