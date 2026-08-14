import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormBtn from "../../elements/buttons/FormBtn";
import { YupObject, nameSchema } from "../../utils/validation/ValidationSchemas";
import Loader from "../commonComponent/Loader";
import SimpleInputField from "../inputFields/SimpleInputField";
import { formatString } from "../../lib/format-number";
import axios from "axios";
import SearchableSelectInput from "../inputFields/SearchableSelectInput";
const OfferForm = ({ updateId, buttonName }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    user: [],
    categories: [],
    tags: []
  });
  useEffect(() => {
    fetchOtherDetails();
    if (updateId) {
      fetchDetails();
    }
  }, [updateId]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get('/api/offers?id=' + updateId);
      if (res.status == 200) {
        setData(res.data);
      }
      setIsLoading(false);
    } catch (err) {
      alert('something went wrong');
    }
  }
  if (updateId && isLoading) return <Loader />;

  const fetchOtherDetails = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get('/api/orders/user_tag_category_offer?user_tag_category=true');
      if (res.status == 200) {
        setState((prev) => {
          return { ...prev, ['user']: res.data?.user, ['tags']: res.data?.tags, ['categories']: res.data?.categories }
        })
      }
      setIsLoading(false);
    } catch (err) {
      alert('something went wrong');
    }
  }

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (buttonName == "Update") {
        const res = await axios.put('/api/offers/' + updateId, {
          "name": values.name,
          "discount": Number(values.discount),
          "userId": values.userId.toString(),
          "tag": values.tag.toString(),
          "categoryId": values.categoryId.toString(),
          "remarks": values.remarks
        }, { withCredentials: true });

        if (res.status == 200) {
          alert('Offer: ' + values.name + " updated successfully!");
          router.push("/offer");
        }

      } else {
        const res = await axios.post('/api/offers', {
          "name": values.name,
          "discount": Number(values.discount),
          "userId": values.userId.toString(),
          "tag": values.tag.toString(),
          "categoryId": values.categoryId.toString(),
          "remarks": values.remarks
        }, { withCredentials: true });
        if (res.status == 201) {
          alert('Offer: ' + values.name + " added successfully!");
          router.push("/offer");
        }
      }
      setIsLoading(false);
    } catch (err) {
      alert(err.response.data.error);
    }
  }
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: Object.keys(data).length > 1 ? data?.name : "",
          tag: Object.keys(data).length > 0 ? (data?.tag ? data?.tag.split(',').map(Number) : []) : [],
          categoryId: Object.keys(data).length > 0 ? (data?.categoryId ? data?.categoryId.split(',').map(Number) : []) : [],
          userId: Object.keys(data).length > 0 ? (data?.userId ? data?.userId.split(',').map(Number) : []) : [],
          discount: Object.keys(data).length > 0 ? data?.discount : 0,
          remarks: Object.keys(data).length > 0 ? data?.remarks : ""
        }}
        validationSchema={YupObject({
          name: nameSchema,
        })}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Form id="blog" className="theme-form theme-form-2 mega-form">
              <SimpleInputField nameList={[{ name: "name", type: 'text', placeholder: t("EnterName"), require: "true" }]} />
              <SimpleInputField nameList={[{ name: "discount", type: 'number', placeholder: t("EnterDiscount(%)"), require: "true" }]} />

              <SearchableSelectInput
                nameList={[
                  {
                    name: "categoryId",
                    title: "CategoryId",
                    require: "true",
                    inputprops: {
                      name: "categoryId",
                      id: "categoryId",
                      options: state.categories.length > 0 ? state.categories : [],
                      close: false,
                      isMulti: true
                    },
                  },
                ]}
              />
              <SearchableSelectInput
                nameList={[
                  {
                    name: "tag",
                    title: "Tag",
                    require: "true",
                    inputprops: {
                      name: "tag",
                      id: "tag",
                      options: state.tags.length > 0 ? state.tags : [],
                      close: false,
                      isMulti: true
                    },
                  },
                ]}
              />
              <SearchableSelectInput
                nameList={[
                  {
                    name: "userId",
                    title: "User",
                    require: "true",
                    inputprops: {
                      name: "userId",
                      id: "userId",
                      options: state.user.length > 0 ? state.user : [],
                      close: false,
                      isMulti: true
                    },
                  },
                ]}
              />
              <SimpleInputField nameList={[{ name: "remarks", type: 'textarea', placeholder: t("remarks"), require: "true" }]} />
              <FormBtn buttonName={buttonName} />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default OfferForm;
