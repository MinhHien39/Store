import React, { useState, useEffect, useRef } from 'react';
import { Localized } from '@/core/localized';
import { LogUtils } from '@/core/utils';
import {
    ic_keyboard_arrow_down,
    ic_add,
    ic_close_black
} from '@/assets/images';

export interface PullDownSearchItemData {
    id: string;
    value: string;
    object: any;
}

export interface PullDownSearchProps {
    key: string;
    dataList: PullDownSearchItemData[];
    initValue?: string;
    placeholder?: string;
    styles?: React.CSSProperties;
    onSearch: (value: string) => void;
    onItemClick: (item: PullDownSearchItemData) => void;
    onAddClick?: (item: PullDownSearchItemData) => void;
    onClearClick?: () => void;
}

interface Props {
    props: PullDownSearchProps;
}

const PullDownSearchView: React.FC<Props> = ({ props }) => {
    const {
        dataList,
        onSearch,
        onItemClick,
        onAddClick,
        initValue = "",
        placeholder = Localized.t('common.enter'),
        styles = {}
    } = props;

    const [value, setValue] = useState(initValue);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<any>(null);
    const manualCloseRef = useRef(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                manualCloseRef.current = true;
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounce search input (300ms)
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            // Skip first render on mount
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current = false;
                return;
            }

            const text = value.trim();
            LogUtils.debug(props.key, "Debounce onSearch:", text === "" ? "empty input" : text);
            onSearch(text);
        }, 300);

        return () => {
            clearTimeout(debounceRef.current);
        };
    }, [value]);

    // Show / hide dropdown based on dataList
    useEffect(() => {
        if (isFirstRenderRef.current) {
            return;
        }

        if (manualCloseRef.current) {
            return;
        }

        if (dataList.length > 0 || value.trim() !== "") {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

    }, [dataList]);

    // Input typing handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        manualCloseRef.current = false;
    };

    // When input is focused and has text → force search
    const handleFocus = () => {
        if (value.trim() === "") {
            onSearch("");
        }
        setShowDropdown(true);
    };

    // When clicking an item from dropdown
    const handleSelectItem = (item: PullDownSearchItemData) => {
        // Skip first render on mount
        isFirstRenderRef.current = true;
        setValue(item.value);
        onItemClick(item);
        manualCloseRef.current = true;
        setShowDropdown(false);
    };

    const handleAddNewItem = () => {
        if (!onAddClick) {
            return;
        }

        const text = value.trim();
        if (text === "") {
            return;
        }

        setValue(text);

        onAddClick({
            id: text,
            value: text,
            object: text
        });

        manualCloseRef.current = true;
        setShowDropdown(false);
    };

    const onClearClick = () => {
        isFirstRenderRef.current = true;
        setValue("");
        setShowDropdown(false);
        manualCloseRef.current = true;
        if (props.onClearClick) {
            props.onClearClick();
        }
    }

    return (
        <div
            ref={wrapperRef}
            className="relative w-full"
            style={styles}
        >
            <div
                className="base-input-form d-flex align-items-center w-full pr-1"
            >
                <input
                    required
                    type="text"
                    value={value}
                    onChange={handleInput}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        marginRight: "0.5rem",
                        backgroundColor: "transparent",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                />


                <div
                    className="cursor-pointer w-5"
                    onClick={onClearClick}
                    style={{
                        flexShrink: 0,
                        visibility: value.trim() !== "" ? "visible" : "hidden",
                    }}
                >
                    <img src={ic_close_black} className="w-5 h-5" />
                </div>

                <img
                    src={ic_keyboard_arrow_down}
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => {
                        if (showDropdown) {
                            setShowDropdown(false);
                            manualCloseRef.current = true;
                        } else {
                            if (dataList.length > 0 || value.trim() !== "") {
                                onSearch(value.trim());
                                setShowDropdown(true);
                                manualCloseRef.current = false;
                            }
                        }
                    }}
                />
            </div>

            {
                showDropdown
                &&
                <div
                    className="absolute r-0 l-0 z-100 overflow-auto"
                    style={{ zIndex: 999, top: "100%", maxHeight: "250px", backgroundColor: "white", border: "1px solid #ccc", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                >
                    {
                        dataList.length > 0
                        &&
                        dataList.map((item: PullDownSearchItemData, index: number) => (
                            <div
                                key={`${index}-${item.id}`}
                                className="p-2 cursor-pointer"
                                onClick={() => handleSelectItem(item)}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#eee"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                            >
                                {item.value}
                            </div>
                        ))
                    }

                    {
                        dataList.length === 0 &&
                        value.trim() !== "" &&
                        onAddClick &&
                        <div
                            className="p-2 cursor-pointer font-bold"
                            onClick={handleAddNewItem}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#eee"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                        >
                            <div className="d-flex gap-3">
                                <img src={ic_add} />
                                {value}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default PullDownSearchView;

/* 
OVERVIEW:
---------
This example shows how to implement PullDownSearchView inside a ViewModel
(VM) and Page (View).  
Just copy code below into your VM + Page → it works immediately.

------------------------------------------------------------------
1) VIEW MODEL (VM) — Example Implementation
------------------------------------------------------------------

import { PullDownSearchItemData, PullDownSearchProps }
    from "@/component/input/PullDownSearchView";

const DUMMY_LIST = [
    "Apple", "Banana", "Cherry", 
    "Durian", "Orange", "Mango"
];

const createSearchProps = (): PullDownSearchProps => {

    const onSearch = (value: string) => {
        let results: PullDownSearchItemData[] = [];

        if (value.trim().length > 0) {
            results = DUMMY_LIST
                .filter(data => data.toLowerCase().includes(value.toLowerCase()))
                .map((data, index) => ({
                    id: index.toString(),
                    value: data,
                    object: data
                }));
        }

        const props = config.searchProps;
        props.dataList = results;

        action.setNewConfig({
            ...config,
            searchProps: props
        });
    };

    const onItemClick = (item: PullDownSearchItemData) => {
        const props = config.searchProps;
        props.dataList = [item];

        action.setNewConfig({
            ...config,
            searchProps: props
        });
    };

    const onAddClick = (item: PullDownSearchItemData) => {
        DUMMY_LIST.push(item.value);

        const props = config.searchProps;
        props.dataList = [{
            id: item.value,
            value: item.value,
            object: item.value
        }];

        action.setNewConfig({
            ...config,
            searchProps: props
        });

        globalUI.showSuccessAlert(Localized.ADD_SUCCESS);
    };

    return {
        dataList: [],
        onSearch,
        onItemClick,
        onAddClick,
    };
};

config.searchProps = createSearchProps();


------------------------------------------------------------------
2) VIEW — Example Usage in Page
------------------------------------------------------------------

import PullDownSearchView from "@/component/input/PullDownSearchView";

<div className="absolute r-4 t-20 z-100 w-40">
    <PullDownSearchView props={config.searchProps} />
</div>
 */
