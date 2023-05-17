const pdf = require("html-pdf");
const fs = require("fs");

const pathFile = require.resolve("./header.html");
let html = fs.readFileSync(pathFile, 'utf8')

const number_tables = 100;
let body = '';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateNumbers(){
    const table = [[], [], [], [], []];
    const initialValue = 1;
    const nextValue = 15;


    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const value = getRandomInt(initialValue + (nextValue * i), (initialValue + nextValue) + (nextValue * i));
    
            if (!table[i].includes(value)) {
                table[i].push(value);
            } else {
                j--;
            }
        }
    }

    return table;
}

function transposeMatrix(matrix) {
    var rows = matrix.length;
    var cols = matrix[0].length;
  
    // Creamos una nueva matriz vacía
    var result = [];
    for (var i = 0; i < cols; i++) {
      result[i] = new Array(rows);
    }
  
    // Recorremos la matriz original y transponemos los elementos
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        result[j][i] = matrix[i][j];
      }
    }
  
    return result;
  }
  

function getColumnValues(values) {
    let response = ``;

    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        response += '<td>'+ value + '</td>';
    }
    return response;
}

function getColumnValuesAndRemoveCell(values) {
    let response = ``;

    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        
        if (index === 2) {
            response += '<td> * </td>';
        } else {
            response += '<td>'+ value + '</td>';
        }
    }
    return response;
}


for (let index = 0; index < number_tables; index++) {
    const table = generateNumbers();
    const matrix = transposeMatrix(table);

    const columnB = getColumnValues(matrix[0]);
    const columnI = getColumnValues(matrix[1]);
    const columnN = getColumnValuesAndRemoveCell(matrix[2]);
    const columnG = getColumnValues(matrix[3]);
    const columnO = getColumnValues(matrix[4]);

    body += `
    <div class="table">
        <table>
            <thead>
                <tr>
                    <th>B</th>
                    <th>I</th>
                    <th>N</th>
                    <th>G</th>
                    <th>O</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {{columnB}}
                </tr>
                <tr>
                    {{columnI}}
                </tr>
                <tr>
                    {{columnN}}
                </tr>
                <tr>
                    {{columnG}}
                </tr>
                <tr>
                    {{columnO}}
                </tr>
            </tbody>
        </table>
    </div>
    `;

    body = body.replace("{{columnB}}", columnB);
    body = body.replace("{{columnI}}", columnI);
    body = body.replace("{{columnN}}", columnN);
    body = body.replace("{{columnG}}", columnG);
    body = body.replace("{{columnO}}", columnO);
}

html = html.replace("{{body}}", body);
 
pdf.create(html).toFile("tablas.pdf", (error) => {
    if (error) {
        console.log("Error creando PDF: " + error)
    } else {
        console.log("PDF creado correctamente");
    }
});