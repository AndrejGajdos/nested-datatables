import TableBuilder from './TableBuilder.js';
import '../styles/style.css';

var dataTable = require('datatables');
$.DataTable = dataTable;

/**
 *
 * @author Andrej Gajdos <mail@andrejgajdos.com>
 *
 * TableHierarchy class is used for building nested DataTables hierarchy
 *
 * @param {string} tableParentID Id of a DOM element where will be table hierarchy placed
 * @param {Array.<Object>} tableDataInJson Data in Json format which are used for building table hierarchy
 * @param {Object} dataTableSettings settings for DataTables object
 */
export default class TableHierarchy {
  constructor(tableParentID, tableDataInJson, dataTableSettings) {
    // check if wrapper element for table exist
    if (tableParentID !== undefined) {
      this.tableContainerSelector = $('#' + tableParentID);
      if (!this.tableContainerSelector.length) {
        console.error('Element with id "' + tableParentID + '" doesn\'t exist!');
      }
    }
    // check if data is defined
    if (tableDataInJson !== undefined) {
      this.tableBuilder = new TableBuilder(tableParentID, tableDataInJson);
    } else {
      console.error('Data are undefined!');
    }
    // check if DataTable settings object is defined
    if (dataTableSettings !== undefined) {
      this.dataTableSettings = dataTableSettings;
    } else {
      console.error('DataTable settings are undefined!');
    }
    this.tables = []; // created table objects in hierarchy
    this.tableToShow;
  }

  /**
   * Initialize DataTables plugin with click listener on row by jQuery,
   * TableBuilder object is used for building specific table
   */
  initializeTableHierarchy() {
    this.tableBuilder.buildTable();
    let mainNode = this.tableContainerSelector.html(
      this.tableBuilder.getTable()
    );

    //	Initialize DataTables, with no sorting on the 'details' column
    this.tableToShow = mainNode.find('table').first();
    let table = this.tableToShow.dataTable(this.dataTableSettings);
    mainNode.find('table').wrap("<div class='tableWrapper'/>");
    this.setWidthOfCellsWithNarrows(table);

    this.tables.push([
      mainNode
        .find('table')
        .eq(0)
        .attr('id'),
      table
    ]);

    let that = this;
    var tableShowEvt;
    var tableHideEvt;

    this.tableContainerSelector.on('click', 'tbody tr', function() {
      if (
        $(this).attr('class') !== 'details' &&
        $(this).find('.arrowContainer img').length > 0
      ) {
        if (document.createEvent) {
          tableShowEvt = document.createEvent('HTMLEvents');
          tableShowEvt.initEvent('onShowChildHierarchy', true, true);
          tableHideEvt = document.createEvent('HTMLEvents');
          tableHideEvt.initEvent('onHideChildHierarchy', true, true);
        } else {
          tableShowEvt = document.createEventObject();
          tableShowEvt.eventType = 'onShowChildHierarchy';
          tableHideEvt = document.createEventObject();
          tableHideEvt.eventType = 'onHideChildHierarchy';
        }
        tableShowEvt.eventName = 'onShowChildHierarchy';
        tableHideEvt.eventName = 'onHideChildHierarchy';

        let parentTable = {};
        let parentTableClass = $(this)
          .closest('table')
          .attr('id');

        if (
          that.tables
            .toString()
            .split(',')
            .indexOf(parentTableClass) %
            2 ===
          0
        ) {
          for (let i = 0; i < that.tables.length; i++) {
            if (
              that.tables[i][0] ===
              $(this)
                .closest('table')
                .attr('id')
            ) {
              parentTable = that.tables[i][1];
              break;
            }
          }
        }

        if (parentTable.fnIsOpen($(this))) {
          /* This row is already opened - close it */
          if (document.createEvent) {
            this.dispatchEvent(tableHideEvt);
          } else {
            this.fireEvent('on' + tableHideEvt.eventType, event);
          }
          parentTable.fnClose($(this));
          $(this)
            .find('.arrowContainer img')
            .removeClass('rotate-down')
            .addClass('rotate-up');
        } else {
          if (
            $(this)
              .find('.arrowContainer img')
              .eq(0)
          ) {
            if (document.createEvent) {
              this.dispatchEvent(tableShowEvt);
            } else {
              this.fireEvent('on' + tableShowEvt.eventType, event);
            }
            $(this)
              .find('.arrowContainer img')
              .removeClass('rotate-up')
              .addClass('rotate-down');
            that.tableBuilder
              .getIdParser()
              .setElementIdWithOccurrence($(this).attr('id'));
            that.tableBuilder.buildTable();

            let tableAsJQueryNode = $('<div/>')
              .html(that.tableBuilder.getTable())
              .contents();
            let allTables = tableAsJQueryNode.find('table');
            parentTable.fnOpen(this, tableAsJQueryNode, 'details');

            $(allTables).each(function() {
              if (
                $(this)
                  .find('tbody')
                  .html() !== ''
              ) {
                let newTable = $(this).dataTable(that.dataTableSettings);
                let tableId = $(this).attr('id');
                that.setWidthOfCellsWithNarrows($(this));

                // if tables contains table with tableId, replace this table, otherwise push new table
                if (
                  that.tables
                    .toString()
                    .split(',')
                    .indexOf(tableId) %
                    2 ===
                  0
                ) {
                  let indexOfObjectWithId = $.map(that.tables, function(
                    obj,
                    index
                  ) {
                    if (obj[0] === tableId) {
                      return index;
                    }
                  })[0];
                  that.tables[indexOfObjectWithId] = [tableId, newTable];
                } else {
                  that.tables.push([tableId, newTable]);
                }
              }
            });
          }
        }
      }
    });
  }

  /**
   * Set up css class and 1% width for all cells containing arrow image
   *
   * @param {DataTable} table initialized DataTable table
   */
  setWidthOfCellsWithNarrows(table) {
    if (table.find('tbody tr:first-child .arrowContainer img').length > 0) {
      table.find('tbody tr .arrowContainer:first-child img').each(function() {
        $(this)
          .parent()
          .closest('td')
          .css('width', '1%');
        $(this)
          .parent()
          .closest('tr')
          .addClass('rowHover');
      });
    }
  }
}
