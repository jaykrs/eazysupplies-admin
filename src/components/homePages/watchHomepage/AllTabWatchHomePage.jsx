import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Col, TabContent, TabPane } from "reactstrap";
import request from "@/utils/axiosUtils";
import { product } from "@/utils/axiosUtils/API";
import Loader from "@/components/commonComponent/Loader";
import BrandTab from "./watchHomePageTabs/BrandTab";
import CategoriesTab from "./watchHomePageTabs/CategoriesTab";
import CategoryProductTab from "./watchHomePageTabs/CategoryProductTab";
import FeaturedBlogTab from "./watchHomePageTabs/FeaturedBlogTab ";
import HomeBannerTab from "./watchHomePageTabs/HomeBannerTab";
import { default as OfferBanner1Tab } from "./watchHomePageTabs/OfferBanner1Tab";
import OfferBanner2Tab from "./watchHomePageTabs/OfferBanner2Tab";
import ProductList1Tab from "./watchHomePageTabs/ProductList1Tab";
import ProductList2Tab from "./watchHomePageTabs/ProductList2Tab";
import ServicesTab from "./watchHomePageTabs/ServicesTab";
import SocialMediaTab from "./watchHomePageTabs/SocialMediaTab";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const AllTabsWatchHomePage = forwardRef(({ activeTab, values, setFieldValue, apiData = {} }, ref) => {
  const { categoryData, blogData, brandData, categoryLoader, brandLoader, categoryRefetch } = apiData;
  const [search, setSearch] = useState(false);
  const [customSearch, setCustomSearch] = useState("");
  const [tc, setTc] = useState(null);

  const {
    data: productData,
    isLoading: productLoader,
    refetch,
  } = useCustomQuery(
    [product],
    () =>
      request({
        url: product,
        params: {
          status: 1,
          search: customSearch ? customSearch : "",
          paginate: values["content"]?.["products_ids"]?.length > 15 ? values["content"]?.["products_ids"]?.length : 15,
          ids: customSearch ? null : values["content"]["products_ids"].join() || null,
          with_union_products: values["content"]?.["products_ids"]?.length ? (values["content"]?.["products_ids"]?.length >= 15 ? 0 : 1) : 0,
        },
      }),
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data.map((elem) => {
          return { id: elem.id, name: elem.name, image: elem?.product_thumbnail?.original_url || "/assets/images/placeholder.png", slug: elem?.slug };
        }),
    }
  );

  useImperativeHandle(ref, () => ({
    call() {
      refetch();
    },
  }));

  // Added debouncing
  useEffect(() => {
    if (tc) clearTimeout(tc);
    setTc(setTimeout(() => setCustomSearch(search), 500));
  }, [search]);
  // Getting users data on searching users
  useEffect(() => {
    refetch();
  }, [customSearch]);

  if (productLoader || categoryLoader) return <Loader />;

  return (
    <Col xl="7" lg="8">
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <HomeBannerTab values={values} setFieldValue={setFieldValue} categoryData={categoryData} productData={productData} setSearch={setSearch} />
        </TabPane>
        <TabPane tabId="2">
          <BrandTab values={values} setSearch={setSearch} setFieldValue={setFieldValue} brandData={brandData} brandLoader={brandLoader} />
        </TabPane>
        <TabPane tabId="3">
          <OfferBanner1Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} productData={productData} />
        </TabPane>
        <TabPane tabId="4">
          <CategoriesTab values={values} setFieldValue={setFieldValue} categoryData={categoryData} />
        </TabPane>
        <TabPane tabId="5">
          <CategoryProductTab setSearch={setSearch} categoryData={categoryData} setFieldValue={setFieldValue} values={values} />
        </TabPane>
        <TabPane tabId="6">
          <ProductList1Tab setSearch={setSearch} productData={productData} />
        </TabPane>
        <TabPane tabId="7">
          <OfferBanner2Tab setFieldValue={setFieldValue} values={values} categoryData={categoryData} productData={productData} setSearch={setSearch} />
        </TabPane>
        <TabPane tabId="8">
          <ProductList2Tab setSearch={setSearch} productData={productData} />
        </TabPane>
        <TabPane tabId="9">
          <FeaturedBlogTab setSearch={setSearch} blogData={blogData} />
        </TabPane>
        <TabPane tabId="10">
          <ServicesTab values={values} setFieldValue={setFieldValue} />
        </TabPane>
        <TabPane tabId="11">
          <SocialMediaTab values={values} setFieldValue={setFieldValue} productData={productData} categoryData={categoryData} setSearch={setSearch} />
        </TabPane>
      </TabContent>
    </Col>
  );
});
export default AllTabsWatchHomePage;
