import { FC, useEffect, useRef } from 'react';
import './TableComponent.scss';
import TableProps from './TableComponentProps';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { useContext } from 'react';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { useForm } from 'react-hook-form';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import DateParse from '../../utils/DateParse';
import NotResultsComponent from '../notResults/NotResultsComponent';

const TableComponent: FC<TableProps> = ({ data, columns, searchByWord, page, itemsPerPage, totalPages, totalItems, handleAdd, handleEdit, handleDelete, handleRowClick, title }) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const formRef = useRef<HTMLInputElement>(null);

  let _timerTap: any;
  const _handleChangeText = () => {
    clearTimeout(_timerTap);
    _timerTap = setTimeout(() => onSubmit(getValues()), 2000);
  }
  const onSubmit = (data: any) => {
    searchByWord(data.search, parseInt(data.page), parseInt(data.itemsPerPage));
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
        {data == undefined ? <div className='my-3'> <LoadingComponent /> </div> : data.length <= 0 ? <div className='col-12 my-3'><NotResultsComponent /></div> : <>
          <div className="col-12 my-4" style={{ overflowX: 'auto' }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  {columns.map((column, index) => <th scope='col' key={index}>{column.name}</th>)}
                  {handleEdit || handleDelete ? <th scope='col'></th> : ''}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => <tr key={index}>
                  {columns.map((column, indexCol) => <td scope='row' key={indexCol} onClick={() => handleRowClick?.(row)} className={handleRowClick != undefined ? 'hover' : ''}>
                    {_parse(row, column.keyName)}
                  </td>)}
                  {handleEdit || handleDelete ? <td scope='row'> <div className="d-flex align-items-center justify-content-end pt-2 h-100">
                    &nbsp;
                    {handleEdit && row.canEdit !== false && <button className='btn-outline-secondary btn me-3' type='button' onClick={() => handleEdit(row)}><MdEdit className='mb-1' /> Editar</button>}
                    {/* {handleDelete && row.canDelete !== false && <button className='btn btn-outline-secondary' type='button' onClick={() => handleDelete(row)}><MdDelete className='mb-1' /> Delete</button>} */}
                  </div></td> : ''}
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-lg-4 d-flex align-items-center">
              <span>Resultados {totalItems} </span>
            </div>
            <div className="col-lg-8 d-flex justify-content-center align-items-center justify-content-md-end">
              <span>Showing</span>
              <select
                className="form-control mx-2" defaultValue={itemsPerPage}
                {...register('itemsPerPage', { onChange: (_) => formRef?.current?.click() })} style={{ width: '3em' }}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span> items, page </span>
              <input type="number" className='form-control mx-2' min={1} max={totalPages} defaultValue={page} {...register('page')} style={{ width: '6em' }} />
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
  handleRowClick: undefined
}

export default TableComponent;
