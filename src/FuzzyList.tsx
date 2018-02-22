import * as React from "react";

import { List, AutoSizer } from "react-virtualized";

export interface FuzzyListProps {
    items: any;
    filter?: string;
    prefilter?: Array<Prefilter>;
    rowRenderer?: Function;
    renderAddNewButton?: Function;
    fuseOptions: any;
}
export interface Prefilter {
    filterKey: string;
    filterValue: any;
    comparisonFunction?: Function;
}

import * as Fuse from "fuse.js";

const filter = require("lodash.filter");

const DEFAULT_FUSE = {
    shouldSort: true,

    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
};

export interface FuzzyListState {
    items: Array<any>; // data filtered through fuse
    itemsFiltered: Array<any>;
    filter: string;
    prefilter: any;
}

/**
 * ReduxLess Virtualised assessment task list
 * Supports text based searching through the filter prop
 * Supports status based filtering through status props
 * Render methods can be overridden
 * Passing renderAddNewButton (function that renders) will render an add new button at top
 *
 * @export
 * @class FuzzyList
 * @extends {React.Component<FuzzyListProps, FuzzyListState>}
 */
export class FuzzyList extends React.Component<FuzzyListProps, FuzzyListState> {
    constructor(props: FuzzyListProps) {
        super(props);

        this.state = {
            items: props.items,
            itemsFiltered: this._prefilter(props.items, props.prefilter),
            filter: "",
            prefilter: props.prefilter
        };
    }
    fuseList: any = null;

    componentWillMount() {
        // Setup the inital fuse object and trigger a state update based on the filter.
        this._setupFuse(this.state.items, this.props.filter ? this.props.filter : "");
    }

    /**
     * Update State/call filtering functions as required based on props changes.
     * Checks for status flag changes, changes to the length of the task list, or changes in the filter text
     * will call setupFuse (to regenerate indexes), or runsearch if just the text changes
     * @param newProps
     */
    componentWillReceiveProps(newProps: FuzzyListProps) {
        let items = newProps.items;
        let update = false;
        let updateFuseList = false;
        let updatePrefilter = false;

        if (newProps.prefilter) {
            if (newProps.prefilter.length != this.state.prefilter.length) {
                updatePrefilter = true;
            } else {
                for (let index = 0; index < newProps.prefilter.length; index++) {
                    const element = newProps.prefilter[index];
                    const org = this.state.prefilter[index];
                    if (
                        element.filterKey !== org.filterKey ||
                        element.filterValue !== org.filterValue
                    ) {
                        updatePrefilter = true;
                        break;
                    }
                }
            }
        }

        if (updatePrefilter) {
            items = this._prefilter(items, newProps.prefilter);
            this.setState({ prefilter: newProps.prefilter });
        }
        if (newProps.filter != this.state.filter) {
            this.setState({ filter: newProps.filter ? newProps.filter : "" });
            update = true;
        }
        if (items.length != this.state.items.length) {
            this.setState({ items: items });
            updateFuseList = true;
        }

        if (updateFuseList) {
            this._setupFuse(items, newProps.filter ? newProps.filter : "");
        } else if (update) {
            this._runSearch(newProps.filter ? newProps.filter : "");
        }
    }

    /**
     * Run the filter search then update the filtered state to match the content.
     */
    _runSearch = async (filter: string) => {
        let searchResults = await this.fuseList.search(filter);

        if (this.props.renderAddNewButton != null) {
            searchResults.unshift({ id: "addNew", name: "addNew" });
        }
        this.setState({ itemsFiltered: searchResults });
    };

    /**
     * Uses lodash's filter function to filter. OR function, not AND
     * Returns a copy of the array, does not mutate
     */
    _prefilter = (items: Array<any>, prefilters?: Array<Prefilter>) => {
        if (prefilters) {
            return filter(items, (item: any) => {
                let found = false;

                prefilters.forEach((prefilter: Prefilter) => {
                    if (prefilter.comparisonFunction) {
                        let compared = prefilter.comparisonFunction(
                            item[prefilter.filterKey],
                            prefilter.filterValue
                        );
                        if (compared) {
                            found = true;
                        }
                    } else {
                        if (item[prefilter.filterKey] === prefilter.filterValue) {
                            found = true;
                        }
                    }
                });
            });
        }
        return items;
    };

    /**
     * Sets up the fuse object for searching.
     * Threshold controls how "Fuzzy" the search is. 0 being perfect match, 1 being anything
     * See fusejs.io for details on other props
     */
    _setupFuse = (items: any, filter: string) => {
        if (items != null && items.length > 0) {
            let options = DEFAULT_FUSE;
            if (this.props.fuseOptions != null) {
                options = this.props.fuseOptions;
            }
            let fuse = new Fuse(items, options);

            this.fuseList = fuse;
            let filtered = fuse.search(filter);
            if (this.props.renderAddNewButton != null) {
                filtered.unshift({ id: "addNew", name: "addNew" });
            }
            this.setState({ items: filtered });
        } else {
            if (this.props.renderAddNewButton != null) {
                this.setState({ itemsFiltered: [{ id: "addNew", name: "addNew" }] });
            } else {
                this.setState({ itemsFiltered: [] });
            }
        }
    };

    rowRenderer = ({ index, isScrolling, isVisible, key, parent, style }: any) => {
        let item = this.state.itemsFiltered[index];

        if (index == 0 && this.props.renderAddNewButton != null) {
            return this.props.renderAddNewButton();
        }
        if (this.props.rowRenderer != null) {
            return this.props.rowRenderer(index, isScrolling, isVisible, key, parent, style, item);
        }
        return null;
    };
    render() {
        if (this.props.items) {
            return (
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            rowHeight={78}
                            rowCount={
                                this.state.itemsFiltered != null
                                    ? this.state.itemsFiltered.length
                                    : this.state.items.length
                            }
                            rowRenderer={this.rowRenderer}
                        />
                    )}
                </AutoSizer>
            );
        }
        return null;
    }
}
