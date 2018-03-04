import TableBuilder from './TableBuilder.js';
import '../styles/style.css';

var dataTable = require('datatables');
$.DataTable = dataTable;

/**
 *
 * @author Andrej Gajdos <mail@andrejgajdos.com>
 *
 * NestedTables class is used for building nested DataTables hierarchy
 *
 * @param {string} tableParentID Id of a DOM element where will be table hierarchy placed
 * @param {Array.<Object>} tableDataInJson Data in Json format which are used for building table hierarchy
 * @param {Object} dataTableSettings settings for DataTables object
 */
export default class NestedTables {
	constructor(tableParentID, tableDataInJson, dataTableSettings){
		// check if wrapper element for table exist
		if (tableParentID !== undefined) {
			this.tableContainerSelector = $("#"+ tableParentID);
			if (!this.tableContainerSelector.length){
				console.log("Element with id \"" + tableParentID + "\" doesn't exist!");
			}
		}
		// check if data is defined
		if (tableDataInJson !== undefined) {
			this.tableBuilder = new TableBuilder(tableParentID, tableDataInJson);
		} else{
			console.log("Data are undefined!")
		}
		// check if DataTable settings object is defined
		if (dataTableSettings !== undefined) {
			this.dataTableSettings = dataTableSettings;
		} else{
			console.log("DataTable settings are undefined!")
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
		let mainNode = this.tableContainerSelector.html(this.tableBuilder.getTable());

		//	Initialize DataTables, with no sorting on the 'details' column
		this.tableToShow = mainNode.find("table").first();
		let table = this.tableToShow.dataTable(this.dataTableSettings);
		mainNode.find("table").wrap("<div class='tableWrapper'/>")
		this.setWidthOfCellsWithNarrows(table);

		this.tables.push([mainNode.find("table").eq(0).attr("id"), table]);

		let that = this;

		this.tableContainerSelector.on('click', 'tbody tr', function() {

			if ($(this).attr('class') !== "details" && $(this).find('td img').length > 0) {

				let parentTable = {};
				let parentTableClass = $(this).closest("table").attr("id");

				if (that.tables.toString().split(',').indexOf(parentTableClass) % 2 === 0) {
					for (let i = 0; i < that.tables.length; i++) {
						if (that.tables[i][0] === $(this).closest("table").attr("id")) {
							parentTable = that.tables[i][1];
							break;
						}
					}
				}

				if (parentTable.fnIsOpen($(this))) {
					/* This row is already opened - close it */
					parentTable.fnClose($(this));
					$(this).find("img").removeClass('rotate-down').addClass('rotate-up');
				} else {
					if ($(this).find("img").eq(0)) {
  					$(this).find("img").removeClass('rotate-up').addClass('rotate-down');
						that.tableBuilder.getIdParser().setElementIdWithOccurence($(this).attr("id"));
						that.tableBuilder.buildTable();

						let tableAsJQueryNode = $('<div/>').html(that.tableBuilder.getTable()).contents();
						let allTables = tableAsJQueryNode.find("table");
						parentTable.fnOpen(this, tableAsJQueryNode, 'details');

						$(allTables).each(function() {

							if ($(this).find('tbody').html() !== "") {

								let newTable = $(this).dataTable(that.dataTableSettings);
								let tableId = $(this).attr("id");
								that.setWidthOfCellsWithNarrows($(this));

								// if tables contains table with tableId, replace this table, otherwise push new table
								if (that.tables.toString().split(',').indexOf(tableId) % 2 === 0) {
									let indexOfObjectWithId = $.map(that.tables, function(obj, index) {
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
	};

	/**
	 * Set up css class and 1% width for all cells containing arrow image
	 *
	 * @param {DataTable} table inicialized DataTable table
	 */
	 setWidthOfCellsWithNarrows(table) {
		if (table.find('tbody tr:first-child td img').length > 0) {
			table.find('tbody tr td:first-child img').each(function() {
				$(this).parent().closest('td').css("width", "1%");
				$(this).parent().closest('tr').addClass('rowHover');
			});
		}
	}
}
