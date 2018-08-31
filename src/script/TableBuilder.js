import IdParser from './IdParser.js';
import ArrowImg from '../img/arrow_right.png';

/**
 *
 * @author Andrej Gajdos <mail@andrejgajdos.com>
 *
 * TableBuilder creates HTML table structure
 *
 * @param {string} tableContainerID Id of DOM element which is used to find out which data are used in {tableDataInJson} data hierarchy
 * @param {Array.<Object>} tableDataInJson Data in Json format which are used for building table hierarchy
 */
export default class TableBuilder {
  constructor(tableContainerID, tableDataInJson) {
    this.idParser = new IdParser(tableContainerID, 'row');
    this.dataInJson = JSON.parse(JSON.stringify(tableDataInJson));
    this.table = '';
    this.tableIdString = '';
  }

  getTable() {
    return this.table;
  }

  getIdParser() {
    return this.idParser;
  }

  /**
   * Build table from object arguments
   */
  buildTable() {
    let data = this.dataInJson;

    this.tableIdString = '';
    if (this.idParser.getPatternOccurrence() > 0) {
      this.idParser.parse();

      // set required data according to pattern occurrence in element id
      for (let j = 0; j < this.idParser.getParsedIds().length; j++) {
        let parsedId = this.idParser.getParsedIds()[j];

        // if parsedId is integer
        if (/^\+?\d+$/.test(parsedId)) {
          data = JSON.parse(JSON.stringify(data[parsedId].kids));
        }
      }

      this.tableIdString = this.idParser.getElementId() + '_tab_0';
    } else {
      this.tableIdString = 'tab_0';
    }

    let tableInHtml = '<div>';
    tableInHtml += this.buildTableContent(data);
    tableInHtml += '</div>';
    this.table = tableInHtml;
  }

  /**
   * Get all properties from array of objects
   *
   * @param  {*} tableDataInJson data in json
   * @return {Array.<String>}	array of properties
   */
  getAllObjectProperties(tableDataInJson) {
    let properties = [];
    for (let i = 0; i < tableDataInJson.length; i++) {
      let objKeys = Object.keys(tableDataInJson[i]);
      if (objKeys.length > 0) {
        let objKeysData = Object.keys(tableDataInJson[i].data);
        // union operation with properties and objKeysData
        properties = [...new Set([...properties, ...objKeysData])];
      }
    }
    return properties;
  }

  /**
   * Build header part of table
   *
   * @param  {Object} propertyName    Object property as a header of table
   * @param  {Json} tableDataInJson 	Data in json format
   * @param  {Array.<Object>} properties 	All object properties
   * @return {String}                 Table header as string
   */
  buildTableHeader(propertyName, tableDataInJson, properties) {
    let TableMainHeader = '<thead><tr>';

    if (propertyName !== '') {
      TableMainHeader += '<th>' + propertyName + '</th><tr>';
    }

    for (let i = 0; i < tableDataInJson.length; i++) {
      // if object has some kids, set empty column, where cells will have image with arrow
      if (Object.keys(tableDataInJson[i].kids).length > 0) {
        TableMainHeader += '<th></th>';
        break;
      }
    }

    for (let k = 0; k < properties.length; k++) {
      TableMainHeader += '<th>' + properties[k] + '</th>';
    }
    TableMainHeader += '</tr></thead>';

    return TableMainHeader;
  }

  /**
   * Build body part of table
   *
   * @param  {String} tableMainHeader Header part of the table
   * @param  {Json} tableDataInJson Data in json format
   * @param  {Array.<Object>} properties 	All object properties
   * @return {String} Table body as string
   */
  buildTableBody(tableMainHeader, tableDataInJson, properties) {
    // create body of table
    let TableMainBody = '<tbody>';
    for (let k = 0; k < tableDataInJson.length; k++) {
      if (typeof tableDataInJson[k].data !== 'undefined') {
        TableMainBody +=
          '<tr id="' + this.tableIdString + '_row_' + parseInt(k, 10) + '" >';

        if (tableMainHeader.indexOf('<th></th>') !== -1) {
          if (Object.keys(tableDataInJson[k].kids).length > 0) {
            TableMainBody += '<td class="arrowContainer"><img src="' + ArrowImg + '"></td>';
          } else {
            TableMainBody += '<td></td>';
          }
        }

        for (let l = 0; l < properties.length; l++) {
          if (
            Object.keys(tableDataInJson[k].data).indexOf(properties[l]) === -1
          ) {
            TableMainBody += '<td></td>';
          } else {
            TableMainBody +=
              '<td>' + tableDataInJson[k].data[properties[l]] + '</td>';
          }
        }

        TableMainBody += '</tr>';
      }
    }
    TableMainBody += '</tbody>';

    return TableMainBody;
  }

  /**
   * Build table header and body
   *
   * @param  {*} tableDataInJson   data in json
   * @return {string}              table header + body
   */
  buildTableContent(tableDataInJson) {
    let tableHeader = '';
    let properties = {};
    if (Array.isArray(tableDataInJson)) {
      properties = this.getAllObjectProperties(tableDataInJson);
      tableHeader =
        '<table class="table table-striped table-bordered cell-border" id="' +
        this.tableIdString +
        '">' +
        this.buildTableHeader('', tableDataInJson, properties);
      return (
        tableHeader +
        this.buildTableBody(tableHeader, tableDataInJson, properties) +
        '</table>'
      );
    }
  }
}
