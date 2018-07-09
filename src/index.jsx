import ReactDOM from "react-dom";

const ReactDataGrid = require('react-data-grid');
const React = require('react');
const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
import update from 'immutability-helper';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class Example extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._columns = [
            {
                key: 'id',
                name: 'ID',
                width: 80,
                sortable: true,
                filterable: true
            },
            {
                key: 'task',
                name: 'Title',
                editable: true,
                sortable: true,
                filterable: true
            },
            {
                key: 'priority',
                name: 'Priority',
                editable: true,
                sortable: true,
                filterable: true
            },
            {
                key: 'issueType',
                name: 'Issue Type',
                editable: true,
                sortable: true,
                filterable: true
            },
            {
                key: 'complete',
                name: '% Complete',
                editable: true,
                sortable: true,
                filterable: true
            },
            {
                key: 'startDate',
                name: 'Start Date',
                editable: true,
                sortable: true,
                filterable: true
            },
            {
                key: 'completeDate',
                name: 'Expected Complete',
                editable: true,
                sortable: true,
                filterable: true
            }
        ];
        let originalRows = this.createRows(20);
        let rows = originalRows.slice(0);
        this.state = { originalRows, rows, filters: {} };

    }

    getRandomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
    };

    createRows = (numberOfRows) => {
        let rows = [];
        for (let i = 1; i < numberOfRows; i++) {
            rows.push({
                id: i,
                task: 'Task ' + i,
                complete: Math.min(100, Math.round(Math.random() * 110)),
                priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
                issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
                startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
                completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
            });
        }
        return rows;
    };


    getRows = () => {
        return Selectors.getRows(this.state);
    };

    getSize = () => {
        return this.getRows().length;
    };


    rowGetter = (rowIdx) => {
        let rows = this.getRows();
        return rows[rowIdx];
    };

    handleFilterChange = (filter) => {
        let newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters });
    };

    onClearFilters = () => {
        // all filters removed
        this.setState({filters: {} });
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = update(rowToUpdate, {$merge: updated});
            rows[i] = updatedRow;
        }

        this.setState({ rows });
    };

    handleGridSort = (sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === 'ASC') {
                return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
            } else if (sortDirection === 'DESC') {
                return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
            }
        };

        const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

        this.setState({ rows });
    };

    render() {
        return  (
            <ReactDataGrid
                enableCellSelect={true}
                onGridSort={this.handleGridSort}
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={500}
                onGridRowsUpdated={this.handleGridRowsUpdated}
                toolbar={<Toolbar enableFilter={true}/>}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}/>);
    }
}

ReactDOM.render(
    <Example />, document.getElementById('container')
);