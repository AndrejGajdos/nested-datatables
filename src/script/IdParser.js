/**
 *
 * @author Andrej Gajdos <mail@andrejgajdos.com>
 *
 * IdParser is used for parsing string where result for tab_0_pattern_23_tab_3_pattern_28 is array [23,28]
 *
 * @constructor
 * @param {string} elementIdPar String which will be parsed
 * @param {string} patternPar   String pattern which ids we will find
 */
export default class IdParser {
    constructor(elementIdPar, patternPar){
      this.elementId = elementIdPar;
      this.pattern = patternPar;
      this.patternOccurence = this.countPatternOccurence();
      this.parsedIds = [];
    }

    getElementId() {
        return this.elementId;
    }

    getPatternOccurence() {
        return this.patternOccurence;
    }

    getParsedIds() {
        return this.parsedIds;
    }

    setElementIdWithOccurence(eleId) {
        this.elementId = eleId;
        this.patternOccurence = this.countPatternOccurence();
    }

    /**
     * Count occurrence of pattern
     * @return {number} Occurrence of pattern in String
     */
    countPatternOccurence() {
        let re = new RegExp(this.pattern, "g");
        return (this.elementId.match(re) || []).length;
    }

    /**
     * Parse numbers placed after pattern
     */
    parse() {
        let rowIds = [];
        let tempElementId = this.elementId;
        for (let i = this.patternOccurence; i > 0; i--) {

            // find and delete first "tab_" occurrence in id
            let firstIndexOfTabPosition = tempElementId.indexOf("tab_") + "tab_".length;
            tempElementId = tempElementId.substring(firstIndexOfTabPosition, tempElementId.length);

            // find and delete first "row_" occurrence in id
            let rowPosition = tempElementId.indexOf(this.pattern + "_") + (this.pattern + "_").length;
            tempElementId = tempElementId.substring(rowPosition, tempElementId.length);

            // get number after first "row_" occurrence in id
            let rowId = "";
            let tabId = "";
            if (tempElementId.indexOf("tab_") !== -1) {
                tabId = tempElementId.substring(tempElementId.indexOf("tab_") + "tab_".length, tempElementId.indexOf("row_") - 1);
                rowId = tempElementId.substring(0, tempElementId.indexOf("_tab_"));
            } else {
                rowId = tempElementId.substring(0, tempElementId.length);
            }

            rowIds.push(rowId);

        }
        this.parsedIds = rowIds;
    }

}
