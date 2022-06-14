import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
const { Option } = Select;

export type SelectOption = {
  label: string;
  value: string;
};
export type Page = {
  offset: number;
  limit: number;
};

type DebounceSelectProps = {
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

export const DebounceSelect: React.FC<DebounceSelectProps> = ({
  mode,
  value,
  total,
  pageSize = 10,
  onChange,
  fetchOptions,
  debounceTimeout = 800,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [hasContentLoading, setHasContentLoading] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadOptions = useCallback(
    async (value: string) => {
      setOptions([]);
      setFetching(true);
      const page: Page = {
        offset: 0,
        limit: pageSize,
      };
      await fetchOptions(value, page).then((newOptions) => {
        setCurrentPage(1);
        setOptions(newOptions);
        setSearchValue(value);
        setFetching(false);
      });
    },
    [fetchOptions, pageSize],
  );

  const debounceFetcher = useMemo(() => {
    return debounce(loadOptions, debounceTimeout);
  }, [loadOptions, debounceTimeout]);

  useEffect(() => {
    loadOptions('');
  }, [loadOptions]);

  return (
    <Select
      mode={mode}
      value={value}
      onChange={(newValue: string | string[]) => onChange(newValue)}
      filterOption={false}
      showSearch
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      onPopupScroll={async (e: any) => {
        const { target } = e;
        if (
          (target as any).scrollTop + (target as any).offsetHeight ===
          (target as any).scrollHeight
        ) {
          // if not load all;
          if (options.length < total) {
            setHasContentLoading(true);
            const page: Page = {
              // (currentPage - 1 + 1) * pageSize;
              offset: currentPage * pageSize,
              limit: pageSize,
            };
            await fetchOptions(searchValue, page).then((newOptions) => {
              setCurrentPage(currentPage + 1);
              options.push(...newOptions);
              setOptions(options);
              setHasContentLoading(false);
            });
          }
        }
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          {hasContentLoading ? <Spin size="small" style={{ padding: '0 12px' }} /> : null}
        </>
      )}
      {...props}
    >
      {options.map((item) => (
        <Option key={`option-${item.value}`} value={item.value}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
