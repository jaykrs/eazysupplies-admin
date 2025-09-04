"use client";
import Loader from "@/components/commonComponent/Loader";
import { user } from "@/utils/axiosUtils/API";
import FormWrapper from "@/utils/hoc/FormWrapper";
import useCreate from "@/utils/hooks/useCreate";
import dynamic from "next/dynamic";

const AddNewUser = () => {
  const UserForm = dynamic(() => import("@/components/user/UserForm").then((mod) => mod.default), {
    loading: () => <Loader />,
    ssr: false,
  });
  const { mutate, isLoading } = useCreate(user, false, `/user`);
  return (
    <FormWrapper title="AddUser">
      <UserForm mutate={mutate} loading={isLoading} buttonName="Save User" />
    </FormWrapper>
  );
};

export default AddNewUser;
