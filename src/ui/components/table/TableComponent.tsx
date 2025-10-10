import { FC, useState, useRef, useEffect } from 'react';
import './TableComponent.scss';
import TableProps from './TableComponentProps';
import { MdAdd, MdEdit, MdDelete, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useContext } from 'react';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useForm } from 'react-hook-form';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import DateParse from '../../utils/DateParse';
import NotResultsComponent from '../notResults/NotResultsComponent';
import { OrdeByFilterEntity } from '../../../domain/entities/OrdeByFilterEntity';
import { useNavigate } from 'react-router-dom';

const TableComponent: FC<TableProps> = ({ data, columns, searchByWord, page, itemsPerPage, totalPages, totalItems, handleAdd, handleEdit, handleDelete, handleRowClick, title, defaultOrderBy }) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const formRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [_orderBy, _setOrderBy] = useState<OrdeByFilterEntity | undefined>(defaultOrderBy);
  const [sortedData, setSortedData] = useState<any[] | undefined>(data);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const _handleChangeFilter = (keyName: string) => {
    let _tempOrderBy: OrdeByFilterEntity;
    if (_orderBy == undefined) _tempOrderBy = { keyName, isDesc: false };
    else if (_orderBy.keyName == keyName) _tempOrderBy = { ..._orderBy, isDesc: !_orderBy.isDesc };
    else _tempOrderBy = { keyName, isDesc: false };
    
    _setOrderBy(_tempOrderBy);
    
    // Apply filters and sorting
    if (data) {
      const formData = getValues();
      let filtered = [...data];
      
      // Apply status filter
      if (formData.statusFilter) {
        filtered = filtered.filter(item => 
          item.state?.toLowerCase() === formData.statusFilter.toLowerCase()
        );
      }
      
      // Apply route filter
      if (formData.routeFilter) {
        filtered = filtered.filter(item => 
          item.route?.name === formData.routeFilter
        );
      }
      
      // Apply search filter
      if (formData.search) {
        const searchTerm = formData.search.toLowerCase();
        filtered = filtered.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
          )
        );
      }
      
      // Apply sorting
      const sorted = filtered.sort((a, b) => {
        const aValue = _getData(a, keyName);
        const bValue = _getData(b, keyName);
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return _tempOrderBy.isDesc ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (aStr < bStr) return _tempOrderBy.isDesc ? 1 : -1;
        if (aStr > bStr) return _tempOrderBy.isDesc ? -1 : 1;
        return 0;
      });
      
      setSortedData(sorted);
    }
  }

  let _timerTap: any;
  const _handleChangeText = () => {
    clearTimeout(_timerTap);
    _timerTap = setTimeout(() => {
      // Apply filters without server call
      if (data) {
        const formData = getValues();
        let filtered = [...data];
        
        // Apply status filter
        if (formData.statusFilter) {
          filtered = filtered.filter(item => 
            item.state?.toLowerCase() === formData.statusFilter.toLowerCase()
          );
        }
        
        // Apply route filter
        if (formData.routeFilter) {
          filtered = filtered.filter(item => 
            item.route?.name === formData.routeFilter
          );
        }
        
        // Apply search filter
        if (formData.search) {
          const searchTerm = formData.search.toLowerCase();
          filtered = filtered.filter(item => 
            Object.values(item).some(value => 
              String(value).toLowerCase().includes(searchTerm)
            )
          );
        }
        
        // Apply current sorting if any
        if (_orderBy) {
          filtered = filtered.sort((a, b) => {
            const aValue = _getData(a, _orderBy.keyName);
            const bValue = _getData(b, _orderBy.keyName);
            
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;
            
            if (aValue instanceof Date && bValue instanceof Date) {
              return _orderBy.isDesc ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
            }
            
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();
            
            if (aStr < bStr) return _orderBy.isDesc ? 1 : -1;
            if (aStr > bStr) return _orderBy.isDesc ? -1 : 1;
            return 0;
          });
        }
        
        setSortedData(filtered);
      }
    }, 300);
  }
  const onSubmit = (data: any) => {
    //change url params 
    navigate(`?q1=&search=${data.search}&page=${data.page}&itemsPerPage=${data.itemsPerPage}`);
    searchByWord(data.search, parseInt(data.page), parseInt(data.itemsPerPage), _orderBy);
    clearTimeout(_timerTap);
  }
  const _parse = (row: any, keyName: string) => {
    const data = _getData(row, keyName);
    if (typeof data == 'boolean') return i18n(data ? KeyWordLocalization.Yes : KeyWordLocalization.No);
    if (data instanceof Date) return DateParse.formatDate(data);
    return data;
  }
  const _getData = (row: any, keyName: string) => {
    let data = row;
    const keys = keyName.split('.');
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (data[key] == undefined) return undefined;
      data = data[key];
    }
    return data;
  }

  const _handleInputPageKeyUp = (event: any) => {
    if (totalPages && event.target.value > totalPages) clearTimeout(_timerTap);
    else if (event.key == 'Enter') {
      console.log('Enter');
      setValue('page', event.target.value);
      onSubmit(getValues());
    }
    else _handleChangeText();
  }

  const _handleInputPageChange = (event: any) => {
    if (totalPages && event.target.value > totalPages) clearTimeout(_timerTap);
    else {
      setValue('page', event.target.value);
      _handleChangeText();
    }
  }

  const _searchTripsFirstTime = () => {
    const urlParams = new URLSearchParams(window.location.hash);
    searchByWord(urlParams.get('search') || '', parseInt(urlParams.get('page') || '1'), parseInt(urlParams.get('itemsPerPage') || '20'), _orderBy);
  }

  useEffect(() => {
    _searchTripsFirstTime();
}, []);


  return <div className='TableComponent w-100'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12 col-md-6 d-flex align-items-center">
          <h5 className='my-3 my-lg-0 me-2'>{title}</h5>
          {handleAdd && <div className="btn_add_table hover" onClick={handleAdd}>
            <MdAdd color='white' />
          </div>
          }
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center">
          <input type="text" className="form-control flex-grow-1 me-2" onKeyUp={_handleChangeText} placeholder={i18n(KeyWordLocalization.Search)} {...register('search')} />
          <button className="btn btn-secondary" type='submit'>
            Submit
          </button>
        </div>
        {/* Filter Row */}
        <div className="col-12 mb-3">
          <div className="row g-2">
            <div className="col-auto">
              <select className="form-select form-select-sm" {...register('statusFilter')} onChange={(e) => {
                setValue('statusFilter', e.target.value);
                _handleChangeText();
              }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm" {...register('routeFilter')} onChange={(e) => {
                setValue('routeFilter', e.target.value);
                _handleChangeText();
              }}>
                <option value="">All Routes</option>
                {data && Array.from(new Set(data.map(item => item.route?.name).filter(Boolean))).map(routeName => (
                  <option key={routeName} value={routeName}>{routeName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {sortedData == undefined ? <div className='my-3'> <LoadingComponent /> </div> : sortedData.length <= 0 ? <div className='col-12 my-3'><NotResultsComponent /></div> : <>
          <div className="col-12 my-4" style={{ overflowX: 'auto' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  {/* {columns.map((column, index) => <th scope='col' key={index}> {column.name}</th>)} */}
                  {columns.map((column, index) => <th scope='col' className='hover' onClick={() => _handleChangeFilter(column.keyName)} key={index}> {_orderBy?.keyName == column.keyName ? (_orderBy.isDesc ? <MdArrowDropDown /> : <MdArrowDropUp />) : ''} {column.name}</th>)}
                  {handleEdit || handleDelete ? <th scope='col'></th> : ''}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => <tr key={index}>
                  {columns.map((column, indexCol) => <td scope='row' key={indexCol} onClick={() => handleRowClick?.(row)} className={handleRowClick != undefined ? 'hover' : ''}>
                    {_parse(row, column.keyName)}
                  </td>)}
                  {handleEdit || handleDelete ? <td scope='row'> <div className="d-flex align-items-center justify-content-end pt-2 h-100">
                    &nbsp;
                    {handleEdit && row.canEdit !== false && <button className='btn-outline-secondary btn me-3' type='button' onClick={() => handleEdit(row)}><MdEdit className='mb-1' /> {i18n(KeyWordLocalization.Edit)}</button>}
                    {handleDelete && row.canDelete !== false && <button className='btn btn-outline-secondary' type='button' onClick={() => handleDelete(row)}><MdDelete className='mb-1' /> {i18n(KeyWordLocalization.Delete)}</button>}
                  </div></td> : ''}
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center">
              <span>{i18n(KeyWordLocalization.TableComponentResults, {results: totalItems})} </span>
            </div>
            <div className="col-lg-8 d-flex justify-content-center align-items-center justify-content-md-end">
              <span>{i18n(KeyWordLocalization.TableComponentShowing)}</span>
              <select
                className="form-control mx-2" defaultValue={itemsPerPage}
                {...register('itemsPerPage', { onChange: (_) => formRef?.current?.click() })} style={{ width: '3em' }}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span> {i18n(KeyWordLocalization.TableComponentItemsPage)} </span>
              <input type="number" className='form-control mx-2' min={1} max={totalPages} defaultValue={page} {...register('page')} style={{ width: '6em' }} onKeyUp={_handleInputPageKeyUp} onChange={_handleInputPageChange} />
              <input type="submit" ref={formRef} hidden />
            </div>
          </div>
        </>}
      </div>
    </form >
  </div >
};

TableComponent.defaultProps = {
  itemsPerPage: 20,
  totalPages: 0,
  totalItems: 0,
  handleAdd: undefined,
  handleDelete: undefined,
  handleRowClick: undefined,
  defaultOrderBy: undefined,
}

export default TableComponent;
