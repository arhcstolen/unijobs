import React from 'react';
import fetch from 'isomorphic-fetch';
import serializeForm from 'form-serialize';
import { Link } from 'react-router';
import Tags from './Tags';

export default class EditarNegocio extends React.Component {
  actualizarNegocio (e) {
    e.preventDefault();
    const { nombre, descripcion } = serializeForm(e.target, { hash: true });
    const { tags } = this.refs.tags.state;
    const { _id } = this.props.user;

    const query = `
      mutation {
        actualizarEmpresa(id:${Number(_id)}, nombre:"${nombre}",descripcion:"${descripcion}",intereses:"${tags}") {
          _id,
          nombre,
          descripcion,
          intereses
        }
      }
    `;

    fetch(`/graphql?query=${query.trim()}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((r) => r.json())
    .then((r) => {
      if (r.errors) throw new Error(r.errors);
      console.log('YAY, fue un éxito', r);
    })
    .catch((err) => {
      console.error(err);
    });
  }
  render () {
    const { nombre, descripcion, intereses, trabajos } = this.props.payload.data.empresa;

    return (
      <div className="login-form">
        <h2>Edita tu perfil, { nombre }</h2>
        <form onSubmit={ this.actualizarNegocio.bind(this) }>
          <label>Nombre</label>
          <input
            required
            name="nombre"
            type="text"
            defaultValue={ nombre }
          />
          <label>Descripción</label>
          <textarea
            required
            name="descripcion"
            defaultValue={ descripcion }
          />
          <label>Cualidades e intereses buscados en los aspirantes</label>
          <Tags
            ref="tags"
            intereses={ intereses }
          />
          <ul>
            { trabajos.map((trabajo, key) => (
              <li key={ `${Date.now()}_key` }>
                <Link to={ `/editarTrabajo/${trabajo._id}` }>
                  { trabajo.titulo }
                </Link>
              </li>
            )) }
          </ul>
          <button type="submit">
            Enviar
          </button>
        </form>
      </div>
    );
  }
}