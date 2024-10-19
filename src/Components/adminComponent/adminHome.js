import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Styles/cssAdmin/adminView.css'; 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 

const AdminPanel = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collectionData, setCollectionData] = useState([]);

  // Cargar las colecciones al montar el componente
  useEffect(() => {
    axios.get(`${API_URL}/auth/collections`)
      .then((response) => {
        setCollections(response.data);
        if (response.data.length > 0) {
          setSelectedCollection(response.data[0]); 
        }
      })
      .catch((error) => {
        console.error('Error al obtener las colecciones:', error);
      });
  }, []);

  // Cargar los datos de la colección seleccionada
  useEffect(() => {
    if (selectedCollection) {
      axios.get(`${API_URL}/auth/collections/${selectedCollection}`)
        .then((response) => {
          setCollectionData(response.data);
        })
        .catch((error) => {
          console.error(`Error al obtener los datos de la colección ${selectedCollection}:`, error);
        });
    }
  }, [selectedCollection]);

  // Función para manejar el clic en "Ver historial"
  const handleHistoryClick = (user) => {
    console.log('Viendo historial de:', user);
 
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Administrador</h2>
        </div>
        <ul>
          {collections.map((collection, index) => (
            <li
              key={index}
              className={selectedCollection === collection ? 'active' : ''}
              onClick={() => setSelectedCollection(collection)}
            >
              {collection}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{selectedCollection}</h1>
        </div>
        <div className="content-body">
          <h2>Datos de la colección {selectedCollection}</h2>
          {collectionData.length > 0 ? (
            <table className="collection-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {collectionData.map((user, index) => (
                  <tr key={index}>
                    <td>{user.nombre}</td>
                    <td>{user.apellidos}</td>
                    <td>{user.correo}</td>
                    <td>
                      <span className={`status ${user.status === 'active' ? 'active' : 'inactive'}`}>
                        {user.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleHistoryClick(user)} className="button">
                        Ver Acerca de
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos disponibles para {selectedCollection}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
