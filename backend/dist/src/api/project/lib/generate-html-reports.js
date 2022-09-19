"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlReports = void 0;
function generateHtmlReports(date) {
    return `<!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Document</title>
     <style>
       html,
       body,
       h6,
       p,
       th {
         margin: 0;
         padding: 0;
         border: 0;
         font-size: 100%;
         font: inherit;
         vertical-align: center;
       }
 
       table {
         border-collapse: collapse;
         border-spacing: 0;
         width: 100%;
         font-family: Poppins, sans-serif;
         color: rgba(0, 0, 0, 0.87);
         text-align: left;
       }
 
       tr {
         border-bottom: 1px solid rgba(224, 224, 224, 1);
       }
 
       tbody tr:last-child {
         border-bottom: none;
       }
 
       td {
         font-size: 0.875rem;
         line-height: 1.43;
         padding: 16px;
       }
 
       .table-header {
         font-size: 0.875rem;
         line-height: 1.5rem;
         padding: 16px;
       }
 
       .table-project {
         font-size: 1rem;
         line-height: 1.75;
         font-weight: 600;
       }
 
       .table-description {
         font-size: 1rem;
         line-height: 1.5;
       }
 
       .table-employee {
         font-size: 0.875rem;
         line-height: 1.43;
         margin-top: 16px;
       }
     </style>
   </head>
   <body>
     <table>
       <thead>
         <tr>
           <th class="table-header">Date</th>
           <th class="table-header">Description</th>
           <th class="table-header">Time</th>
         </tr>
       </thead>
 
       <tbody>
         <tr>
           <th class="table-header">9 Sep 2022</th>
           <td>
             <h6 class="table-project">Paletto</h6>
             <p class="table-description">
               Proin molestie, tellus nec tincidunt gravida.
             </p>
             <p class="table-employee">Yurij Moldavchuk (Yuramol)</p>
           </td>
           <td>07:00</td>
         </tr>
         <tr>
           <th class="table-header">15 Sep 2022</th>
           <td>
             <h6 class="table-project">Demigos</h6>
             <p class="table-description">
               Lorem ipsum dolor sit amet consectetur.
             </p>
             <p class="table-employee">Vitalii Pushkarov</p>
           </td>
           <td>05:00</td>
         </tr>
         <tr>
           <th class="table-header">12 Sep 2022</th>
           <td>
             <h6 class="table-project">SoftBee</h6>
             <p class="table-description">
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi,
               velit.
             </p>
             <p class="table-employee">Yurij Moldavchuk (Yuramol)</p>
           </td>
           <td>03:00</td>
         </tr>
       </tbody>
     </table>
   </body>
 </html>`;
}
exports.generateHtmlReports = generateHtmlReports;
