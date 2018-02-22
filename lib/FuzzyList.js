"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_virtualized_1 = require("react-virtualized");
var Fuse = require("fuse.js");
var filter = require("lodash.filter");
var DEFAULT_FUSE = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
};
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
var FuzzyList = /** @class */ (function (_super) {
    __extends(FuzzyList, _super);
    function FuzzyList(props) {
        var _this = _super.call(this, props) || this;
        _this.fuseList = null;
        /**
         * Run the filter search then update the filtered state to match the content.
         */
        _this._runSearch = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var searchResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fuseList.search(filter)];
                    case 1:
                        searchResults = _a.sent();
                        if (this.props.renderAddNewButton != null) {
                            searchResults.unshift({ id: "addNew", name: "addNew" });
                        }
                        this.setState({ itemsFiltered: searchResults });
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Uses lodash's filter function to filter. OR function, not AND
         * Returns a copy of the array, does not mutate
         */
        _this._prefilter = function (items, prefilters) {
            if (prefilters) {
                return filter(items, function (item) {
                    var found = false;
                    prefilters.forEach(function (prefilter) {
                        if (prefilter.comparisonFunction) {
                            var compared = prefilter.comparisonFunction(item[prefilter.filterKey], prefilter.filterValue);
                            if (compared) {
                                found = true;
                            }
                        }
                        else {
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
        _this._setupFuse = function (items, filter) {
            if (items != null && items.length > 0) {
                var options = DEFAULT_FUSE;
                if (_this.props.fuseOptions != null) {
                    options = _this.props.fuseOptions;
                }
                var fuse = new Fuse(items, options);
                _this.fuseList = fuse;
                var filtered = fuse.search(filter);
                if (_this.props.renderAddNewButton != null) {
                    filtered.unshift({ id: "addNew", name: "addNew" });
                }
                _this.setState({ items: filtered });
            }
            else {
                if (_this.props.renderAddNewButton != null) {
                    _this.setState({ itemsFiltered: [{ id: "addNew", name: "addNew" }] });
                }
                else {
                    _this.setState({ itemsFiltered: [] });
                }
            }
        };
        _this.rowRenderer = function (_a) {
            var index = _a.index, isScrolling = _a.isScrolling, isVisible = _a.isVisible, key = _a.key, parent = _a.parent, style = _a.style;
            var item = _this.state.itemsFiltered[index];
            if (index == 0 && _this.props.renderAddNewButton != null) {
                return _this.props.renderAddNewButton();
            }
            if (_this.props.rowRenderer != null) {
                return _this.props.rowRenderer(index, isScrolling, isVisible, key, parent, style, item);
            }
            return null;
        };
        _this.state = {
            items: props.items,
            itemsFiltered: _this._prefilter(props.items, props.prefilter),
            filter: "",
            prefilter: props.prefilter
        };
        return _this;
    }
    FuzzyList.prototype.componentWillMount = function () {
        // Setup the inital fuse object and trigger a state update based on the filter.
        this._setupFuse(this.state.items, this.props.filter ? this.props.filter : "");
    };
    /**
     * Update State/call filtering functions as required based on props changes.
     * Checks for status flag changes, changes to the length of the task list, or changes in the filter text
     * will call setupFuse (to regenerate indexes), or runsearch if just the text changes
     * @param newProps
     */
    FuzzyList.prototype.componentWillReceiveProps = function (newProps) {
        var items = newProps.items;
        var update = false;
        var updateFuseList = false;
        var updatePrefilter = false;
        if (newProps.prefilter) {
            if (newProps.prefilter.length != this.state.prefilter.length) {
                updatePrefilter = true;
            }
            else {
                for (var index = 0; index < newProps.prefilter.length; index++) {
                    var element = newProps.prefilter[index];
                    var org = this.state.prefilter[index];
                    if (element.filterKey !== org.filterKey ||
                        element.filterValue !== org.filterValue) {
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
        }
        else if (update) {
            this._runSearch(newProps.filter ? newProps.filter : "");
        }
    };
    FuzzyList.prototype.render = function () {
        var _this = this;
        if (this.props.items) {
            return (React.createElement(react_virtualized_1.AutoSizer, null, function (_a) {
                var height = _a.height, width = _a.width;
                return (React.createElement(react_virtualized_1.List, { height: height, width: width, rowHeight: 78, rowCount: _this.state.itemsFiltered != null
                        ? _this.state.itemsFiltered.length
                        : _this.state.items.length, rowRenderer: _this.rowRenderer }));
            }));
        }
        return null;
    };
    return FuzzyList;
}(React.Component));
exports.FuzzyList = FuzzyList;
