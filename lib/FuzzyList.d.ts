import * as React from "react";
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
export interface FuzzyListState {
    items: Array<any>;
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
export declare class FuzzyList extends React.Component<FuzzyListProps, FuzzyListState> {
    constructor(props: FuzzyListProps);
    fuseList: any;
    componentWillMount(): void;
    /**
     * Update State/call filtering functions as required based on props changes.
     * Checks for status flag changes, changes to the length of the task list, or changes in the filter text
     * will call setupFuse (to regenerate indexes), or runsearch if just the text changes
     * @param newProps
     */
    componentWillReceiveProps(newProps: FuzzyListProps): void;
    /**
     * Run the filter search then update the filtered state to match the content.
     */
    _runSearch: (filter: string) => Promise<void>;
    /**
     * Uses lodash's filter function to filter. OR function, not AND
     * Returns a copy of the array, does not mutate
     */
    _prefilter: (items: any[], prefilters?: Prefilter[] | undefined) => any;
    /**
     * Sets up the fuse object for searching.
     * Threshold controls how "Fuzzy" the search is. 0 being perfect match, 1 being anything
     * See fusejs.io for details on other props
     */
    _setupFuse: (items: any, filter: string) => void;
    rowRenderer: ({ index, isScrolling, isVisible, key, parent, style }: any) => any;
    render(): JSX.Element | null;
}
