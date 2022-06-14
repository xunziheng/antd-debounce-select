import React from 'react';
export declare type SelectOption = {
    label: string;
    value: string;
};
export declare type Page = {
    offset: number;
    limit: number;
};
declare type DebounceSelectProps = {
    /**
     * If you need multiple selections, set mode="multiple", otherwise you don`t need to set,
     * and it should be noted that the value of multiple selections is string[], and the single selection is string.
     */
    mode?: 'multiple';
    /**
     * Multiple selection is string[], single selection is string.
     */
    value: string | string[];
    /**
     * The default is 10, you don't need to set it, if you need to save http resources, set it at will.
     */
    pageSize?: number;
    /**
     * A setting necessary so that the component can tell if more can be loaded.
     */
    total: number;
    /**
     * Set the time of the function debounce.
     */
    debounceTimeout?: number;
    /**
     * The callback after selecting options, you need to set it as value.
     */
    onChange: (newValue: string | string[]) => void;
    /**
     * In this callback function, the http request is made,
     * and the options of the next page are obtained according to the Page parameter and searchKey, which will be pushed.
     */
    fetchOptions: (search: string, page: Page) => Promise<SelectOption[]>;
};
export declare const DebounceSelect: React.FC<DebounceSelectProps>;
export {};
