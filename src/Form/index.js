import React, { useState } from 'react';
import api from '../services/api.js'
import './style.css';
import { useFormik } from 'formik';
import * as Yup from "yup";

function Form() {

  const [uf, setUf] = useState('go');
  const [city, setCity] = useState('Goiania');
  const [cep, setCep] = useState([]);


  const validationSchema = Yup.object({//validação dos campos do formulário com a lib yup
    address: Yup
      .string()
      .required('Campo endereço é obrigatório!'),
  });

  async function sendRequest(value) {
    const data = {
      uf,
      city,
      address: value.address
    }

    console.log(data);


    await api.post('/cep', data)
      .then(response => {
        setCep(response.data);
      })
      .catch(err => {
        window.alert("Falha ao buscar endereço!")
        console.log(err)
      })

  }

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({ //validação com a lib formik
    initialValues: {
      address: "",
    },

    validationSchema, //validação dos campos obrigatórios
    onSubmit(values) {
      sendRequest(values)
    },

  });

  return (
    <div className="container">
      <div className="box">
        <form onSubmit={handleSubmit}>

          <label className='label'>
            UF:
          </label>
          <select className='input' disabled>
            <option value={uf}>GO</option>
          </select>
          {/* <input type="text" defaultValue={''} name='uf' onChange={handleChange} /> */}
          {touched.uf && errors.uf ? <p className="">{errors.uf}</p> : null}
          <br />
          <br />

          <label className='label'>
            Cidade:
          </label>
          <select className='input' disabled>
            <option value={city}>Goiânia</option>
          </select>
          {/* <input type="text" defaultValue={''} name='city' onChange={handleChange} /> */}
          {touched.city && errors.city ? <p className="">{errors.city}</p> : null}
          <br />
          <br />

          <label className='label'>
            Endereço:
          </label>
          <input className='input' type="text" defaultValue={''} name='address' onChange={handleChange} />
          {touched.address && errors.address ? <p className="errorAlert">{errors.address}</p> : null}
          <br />
          <br />

          {cep.length !== 0 ?
            <>
              <label className='label'>
                CEP:
              </label>
              <select className='input'>
                <option value="0">Selecione o endereço</option>
                {cep.map(cep => (
                  <option key={cep.cep} value={cep.cep}>{`${cep.cep} - ${cep.logradouro} - ${cep.bairro}`}</option>
                ))}
              </select>
            </>
            :
            null
          }

          <div className="center">
            <button className="form-submit-button" type="submit">Pesquisar</button>
          </div>



        </form>
      </div>
    </div>
  );
}

export default Form;
