import React from 'react';
import Header from '../components/Header.js'

function Stats() {
  return (
      <>
      <Header title={`Statistiques`} />
      <main>
        <div className="container">

            <h2>Nom du parcours</h2>

            <table className="stats">
                <thead>
                    <tr>
                        <th>Nom du participant</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Mathieu</td>
                        <td>1h36</td>
                    </tr>
                    <tr>
                        <td>Mathieu</td>
                        <td>1h36</td>
                    </tr>
                    <tr>
                        <td>Mathieu</td>
                        <td>1h36</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </main>
      </>
  );
}

export default Stats;
