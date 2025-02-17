import React, { useState, useEffect, useRef } from 'react';
import '/src/styles/Informes.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Informes = () => {
  const [difficulty, setDifficulty] = useState('');
  const [heroType, setHeroType] = useState('');
  const [filteredChampions, setFilteredChampions] = useState([]);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || ''; // Handle missing values
        return obj;
      }, {});
    });
  };

  const handlePrint = async () => {
    try {
      const response = await fetch('/200125_LoL_champion_data.csv'); // CSV debe estar en /public/
      if (!response.ok) throw new Error(`Error al cargar CSV: ${response.status}`);

      const text = await response.text();
      const parsedData = parseCSV(text);

      const filtered = parsedData.filter(champion => 
        (difficulty ? champion.difficulty === difficulty : true) &&
        (heroType ? champion.herotype === heroType : true)
      );

      setFilteredChampions(filtered);
    } catch (error) {
      console.error('Error al cargar el archivo CSV:', error);
      alert('Hubo un problema al cargar los datos. Revisa la consola.');
    }
  };

  useEffect(() => {
    if (filteredChampions.length > 0) {
      // Gráfico de barras: cantidad de personajes según sus roles
      const roles = filteredChampions.reduce((acc, champ) => {
        acc[champ.role] = (acc[champ.role] || 0) + 1;
        return acc;
      }, {});
      const barChartData = {
        labels: Object.keys(roles),
        datasets: [{
          label: 'Cantidad de personajes por rol',
          data: Object.values(roles),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
      new Chart(barChartRef.current, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });

      // Gráfico circular: cantidad de personajes según sus posiciones
      const positions = filteredChampions.reduce((acc, champ) => {
        acc[champ.client_positions] = (acc[champ.client_positions] || 0) + 1;
        return acc;
      }, {});
      const pieChartData = {
        labels: Object.keys(positions),
        datasets: [{
          label: 'Cantidad de personajes por posición',
          data: Object.values(positions),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      };
      new Chart(pieChartRef.current, {
        type: 'pie',
        data: pieChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }
  }, [filteredChampions]);

  const generatePDF = () => {
    if (filteredChampions.length === 0) {
      alert("No hay datos para generar el informe.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");

    // Título del PDF
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.width;
    const titleText = "Informe de Campeones";
    const textWidth = doc.getTextWidth(titleText);
    const x = (pageWidth - textWidth) / 2;
    doc.text(titleText, x, 20);

    // Encabezados de la tabla
    const headers = ["Nombre", "Título", "Dificultad", "Tipo de Héroe"];
    const data = filteredChampions.map(champ => [
      champ.apiname,
      champ.title,
      champ.difficulty,
      champ.herotype
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      theme: "grid", // Usa 'grid' para mejorar la visibilidad
      styles: { fontSize: 10, cellPadding: 3 }, // Ajusta el tamaño de la letra y espacio
      columnStyles: {
        0: { cellWidth: 40 }, // Ajusta el ancho de las columnas (modifica según necesidad)
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
      },
    });

    // Resumen debajo de la tabla
    const totalHeroes = filteredChampions.length;
    const heroTypes = [...new Set(filteredChampions.map(champ => champ.herotype))].join(', ');
    const heroDifficulties = [...new Set(filteredChampions.map(champ => champ.difficulty))].join(', ');

    const pageHeight = doc.internal.pageSize.height;
    const finalY = doc.autoTable.previous.finalY;
    const summaryY = Math.max(finalY + 20, pageHeight - 30); // Asegura que el resumen esté al final de la página

    doc.setFontSize(12);
    doc.text(`En este informe hemos obtenido un total de héroes: ${totalHeroes}`, 20, summaryY);
    doc.text(`Los tipos de héroes son: ${heroTypes}`, 20, summaryY + 10);
    const difficultyMap = {
      '1': 'Fácil',
      '2': 'Media',
      '3': 'Difícil'
    };
    const heroDifficultiesText = heroDifficulties.split(', ').map(diff => difficultyMap[diff] || diff).join(', ');
    doc.text(`Las dificultades de los héroes son: ${heroDifficultiesText}`, 20, summaryY + 20);

    doc.save("informe_campeones.pdf");
  };

  return (
    <div className="informes-container">
      <h2>INFORME CAMPEONES</h2>
      <form>
        <div className="form-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Selecciona una dificultad</option>
            <option value="1">Fácil</option>
            <option value="2">Media</option>
            <option value="3">Difícil</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="heroType">Tipo de Héroe:</label>
          <select id="heroType" value={heroType} onChange={(e) => setHeroType(e.target.value)}>
            <option value="">Selecciona un tipo de héroe</option>
            <option value="Tank">Tanque</option>
            <option value="Mage">Mago</option>
            <option value="Assassin">Asesino</option>
            <option value="Support">Soporte</option>
            <option value="Marksman">Tirador</option>
            <option value="Fighter">Luchador</option>
          </select>
        </div>
        <button className="Boton_Imprimir" type="button" onClick={handlePrint}>Imprimir</button>
        <button className="Boton_PDF" type="button" onClick={generatePDF}>Generar PDF</button>
      </form>
      {filteredChampions.length > 0 && (
        <>
          <div className="results">
            <h3>Resultados:</h3>
            <ul>
              {filteredChampions.map((champion, index) => (
                <li key={index}>{champion.apiname} - {champion.title}</li>
              ))}
            </ul>
          </div>
          <div className="charts">
            <div className="chart-container">
              <canvas ref={barChartRef}></canvas>
            </div>
            <div className="chart-container">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Informes;