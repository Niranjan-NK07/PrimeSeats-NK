import { Button, Input, Select } from "antd";
import type React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../storeManager/hooks";
import { searchEvents } from "../../storeManager/slices/eventSlice";

const SearchBox: React.FC = () => {
  const { searchLoading, categories } = useAppSelector((state) => state.events);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const dispatch = useAppDispatch();

  const onSearch = (value: string) => {
    const searchValue = value?.split(" ")[0] || "";
    const category = value?.split(" ")[1] || "";
    const location = value?.split(" ")[2] || "";
    dispatch(searchEvents({ searchValue, category, location }));
  };

  return (
    // <div className="grid grid-cols-4 gap-20 px-10 py-2 rounded-md shadow-[0_0_10px_5px_rgba(0,0,0,0.3)]">
    <div className="bg-white! grid w-full grid-cols-1 gap-4 px-4 py-4 rounded-md shadow-lg sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
      <Input
        className="w-full"
        placeholder="Search events"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Select
        className="w-full"
        showSearch
        placeholder="Select category"
        options={categories}
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
      />
      <Input
        className="w-full"
        placeholder="Location"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end col-span-full sm:col-span-1">
        <Button
          key="search"
          className="bg-purple-600! text-white! rounded-md! hover:bg-purple-700! cursor-pointer! px-6! py-1!"
          onClick={onSearch.bind(
            null,
            [searchValue, selectedCategory, selectedLocation].join(" "),
          )}
          loading={searchLoading}
        >
          Search
        </Button>
        <Button
          key="clear"
          className="bg-gray-600! text-white! rounded-md! hover:bg-gray-700! cursor-pointer! px-6! py-1!"
          onClick={() => {
            setSearchValue("");
            setSelectedCategory(undefined);
            setSelectedLocation("");
            onSearch(["", "", ""].join(""));
          }}
          loading={searchLoading}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
