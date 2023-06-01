# Nested-datatables

jQuery DataTables plugin for rendering nested DataTables in rows. Inner tables are independent of the data and layout from the outer table.

### [Demo](https://andrejgajdos.github.io/nested-datatables/)

### [JSFiddle](https://jsfiddle.net/andrej_gajdos/zu11wk2o/37/)

## Installation

Download the [latest version](https://github.com/AndrejGajdos/nested-datatables/archive/master.zip) and include [nested.datatables.min.js](https://github.com/AndrejGajdos/nested-datatables/blob/master/dist/nested.datatables.js) file

### NPM

```
$ npm install nested-datatables
```

### Usage

```js
var table = new nestedTables.TableHierarchy("example", data, settings);
table.initializeTableHierarchy();
```

## Methods

### TableHierarchy(wrapperID, data, settings)

Main NestedTables constructor.

#### wrapperID

Type: `String`

ID of a DOM element where will be table hierarchy rendered.

#### data

Type: `Array.<Object>`

Data used for building table hierarchy. Each item consists of property `data` and property `kids`, which represents array of child elements.

Check examples below how to define json data.

#### settings

Type: `Object`

Settings for jQuery DataTables constructor.

### .initializeTableHierarchy()

Build nested table hierarchy.

## Events

#### onShowChildHierarchy

Triggered when a child hierarchy is shown

```js
// '#example' is wrapper ID for table hierarchy
var tableEle = document.querySelector("#example .table");
tableEle.addEventListener("onShowChildHierarchy", function (e) {
  console.log(e);
});
```

#### onHideChildHierarchy

Triggered when a child hierarchy is hidden

```js
// '#example' is wrapper ID for table hierarchy
var tableEle = document.querySelector("#example .table");
tableEle.addEventListener("onHideChildHierarchy", function (e) {
  console.log(e);
});
```

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />

    <script src="./dist/nested.datatables.min.js"></script>
  </head>
  <body>
    <div id="example" class="container"></div>

    <script>
      var dataInJson = [
        {
          data: {
            name: "b1",
            street: "s1",
            city: "c1",
            departments: 10,
            offices: 15,
          },
          kids: [
            {
              data: {
                department: "HR",
                supervisor: "Isidor Bristol",
                floor: 1,
                employees: 15,
              },
              kids: [
                {
                  data: {
                    name: "Klement Nikodemos",
                    phone: "+938462",
                    hire_date: "January 1, 2010",
                    id: 3456,
                  },
                  kids: [],
                },
                {
                  data: {
                    name: "Madhava Helmuth",
                    phone: "+348902",
                    hire_date: "May 23, 2002",
                    id: 1234,
                  },
                  kids: [],
                },
                {
                  data: {
                    name: "Andria Jesse",
                    phone: "456123",
                    hire_date: "October 23, 2011",
                    id: 9821,
                  },
                  kids: [],
                },
              ],
            },
            {
              data: {
                department: "development",
                supervisor: "Jim Linwood",
                floor: 2,
                employees: 18,
              },
              kids: [
                {
                  data: {
                    name: "Origenes Maxwell",
                    phone: "345892",
                    hire_date: "February 1, 2004",
                    id: 6234,
                  },
                  kids: [],
                },
              ],
            },
            {
              data: {
                department: "testing",
                supervisor: "Zekeriya Seok",
                floor: 4,
                employees: 11,
              },
              kids: [],
            },
          ],
        },
        {
          data: {
            name: "b2",
            street: "s10",
            city: "c2",
            departments: 3,
            offices: 10,
          },
          kids: [
            {
              data: {
                department: "development",
                supervisor: "Gallagher Howie",
                floor: 8,
                employees: 24,
              },
              kids: [
                {
                  data: {
                    name: "Wat Dakota",
                  },
                  kids: [],
                },
              ],
            },
            {
              data: {
                department: "testing",
                supervisor: "Shirley Gayle",
                floor: 4,
                employees: 11,
              },
              kids: [],
            },
          ],
        },
        {
          data: {
            name: "b3",
            street: "s3",
            city: "c3",
            departments: 2,
            offices: 1,
          },
          kids: [
            {
              data: {
                department: "development",
              },
              kids: [
                {
                  data: {
                    name: "Wat Dakota",
                  },
                  kids: [],
                },
              ],
            },
            {},
          ],
        },

        {
          data: {
            name: "b4",
            city: "c4",
          },
          kids: [],
        },
      ];

      var settings = {
        iDisplayLength: 20,
        bLengthChange: false,
        bFilter: false,
        bSort: false,
        bInfo: false,
      };

      var table = new nestedTables.TableHierarchy(
        "example",
        dataInJson,
        settings
      );
      table.initializeTableHierarchy();
    </script>
  </body>
</html>
```

## Example 2

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />

    <script src="./dist/nested.datatables.min.js"></script>
  </head>
  <body>
    <div id="example" class="container"></div>

    <script>
      var dataInJson2 = [
        {
          data: {
            date: "2018-08",
          },
          kids: [
            {
              data: {
                " ": '&lt;input type="checkbox" name="exampleCheckbox" value="exampleCheckbox"&gt;',
                img: "&lt;img src=https:\/\/picsum.photos\/100\/100 width=20 \/&gt;",
                like: {
                  value: 47,
                  cellClass: "likeCell",
                  headerClass: "likeHeader",
                },
                perf: { value: 130.55555555555554, cellClass: "perf" },
                date: "2018-08-30",
              },
              kids: [],
            },
            {
              data: {
                " ": '&lt;input type="checkbox" name="exampleCheckbox2" value="exampleCheckbox2"&gt;',
                img: "&lt;img src=https:\/\/picsum.photos\/100\/100 width=20 \/&gt;",
                like: 24,
                perf: 66.66666666666667,
                date: "2018-08-31",
              },
              kids: [],
            },
          ],
        },
      ];

      var settings = {
        iDisplayLength: 20,
        bLengthChange: false,
        bFilter: false,
        bSort: false,
        bInfo: false,
      };

      var table = new nestedTables.TableHierarchy(
        "example",
        dataInJson,
        settings
      );
      table.initializeTableHierarchy();
    </script>
  </body>
</html>
```

## License

MIT © [Andrej Gajdos](http://andrejgajdos.com)

[Notion Api Connector](https://notionapiconnector.com/) · [SalesforceToNotion](https://salesforcetonotion.com/)
