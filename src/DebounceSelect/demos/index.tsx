import { message } from 'antd';
import { DebounceSelect, Page, SelectOption } from 'antd-debounce-select';
import React, { useCallback, useState } from 'react';

const Demo = () => {
  const [value, setValue] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  // init data
  const data: string[] = Array.from({ length: 1000 }, (v, k) => k + '');

  const fetchOptions = useCallback(
    async (searchKey: string, page: Page): Promise<SelectOption[]> => {
      const res = data
        .filter((item) => item.toLowerCase().includes(searchKey.toLowerCase()))
        .slice(page.offset, page.offset + page.limit)
        .map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      setTotal(data.length);
      if (page.offset > 0) message.info(`Return ${page.limit} new options`);
      return res;
    },
    [],
  );

  return (
    <DebounceSelect
      style={{ width: '33%' }}
      placeholder="❤ Try searching for keywords ❤"
      mode="multiple"
      value={value}
      total={total}
      fetchOptions={fetchOptions}
      onChange={(newValue: string | string[]) => {
        setValue(newValue as string[]);
      }}
    />
  );
};

export default Demo;
