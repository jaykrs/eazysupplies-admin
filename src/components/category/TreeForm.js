import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import request from "../../utils/axiosUtils";
import { Category } from "../../utils/axiosUtils/API";
import useDelete from "../../utils/hooks/useDelete";
import SearchCategory from "./widgets/SearchCategory";
import Loader from "../commonComponent/Loader";
import CategoryContext from "../../helper/categoryContext";
import { useRouter } from "next/navigation";
import useCustomQuery from "../../utils/hooks/useCustomQuery";

const TreeForm = forwardRef(({ type, isLoading: loading }, ref) => {
  const [search, setSearch] = useState("")
  const [active, setActive] = useState([]);
  const { setCategoryState } = useContext(CategoryContext)
  const router = useRouter()
  // Get Category Data
  const { data, refetch, isLoading } = useCustomQuery([Category], () => request({ url: Category, params: { search: search, type: type } },router), { enabled: false, refetchOnWindowFocus: false, select: (data) => data.data.data });

  // Category Delete
  const { mutate: deleteMutate, isLoading: deleteLoading } = useDelete(Category, false, (resData) => {
    if (resData?.status == 200 || resData?.status == 201) {
      refetch();
    }
  });
  useImperativeHandle(ref, () => ({
    call() {
      refetch();
    }
  }));
  // Refetching data while create, delete and update
  useEffect(() => {
    refetch();
  }, [search])

  useEffect(() => {
    if (data) {
      setCategoryState((prev) => [...data])
    }
  }, [data, isLoading])

  if (isLoading) return <Loader />
  return (
    <SearchCategory mutate={deleteMutate} deleteLoading={deleteLoading} setSearch={setSearch} data={data} active={active} setActive={setActive} type={type} />
  );
});

export default TreeForm;
