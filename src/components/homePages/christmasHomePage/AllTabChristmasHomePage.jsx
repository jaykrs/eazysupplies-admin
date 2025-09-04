import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Col, TabContent, TabPane } from "reactstrap";
import request from "@/utils/axiosUtils";
import { product } from "@/utils/axiosUtils/API";
import Loader from "@/components/commonComponent/Loader";
import BrandTab from "./christmasHomePageTabs/BrandTab";
import CategoryProduct1Tab from "./christmasHomePageTabs/CategoryProduct1Tab";
import CategoryProduct2Tab from "./christmasHomePageTabs/CategoryProduct2Tab";
import FeaturedBlogTab from "./christmasHomePageTabs/FeaturedBlogTab ";
import HomeBannerTab from "./christmasHomePageTabs/HomeBannerTab";
import { default as OfferBanner1Tab } from "./christmasHomePageTabs/OfferBanner1Tab";
import OfferBanner2Tab from "./christmasHomePageTabs/OfferBanner2Tab";
import OfferBanner3Tab from "./christmasHomePageTabs/OfferBanner3Tab";
import ProductList1Tab from "./christmasHomePageTabs/ProductList1Tab";
import SocialMediaTab from "./christmasHomePageTabs/SocialMediaTab";
import useCustomQuery from "@/utils/hooks/useCustomQuery";

const AllTabsChristmasHomePage = forwardRef(({ activeTab, values, setFieldValue, apiData = {} }, ref) => {
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
          <OfferBanner1Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} productData={productData} />
        </TabPane>
        <TabPane tabId="3">
          <ProductList1Tab values={values} setFieldValue={setFieldValue} productData={productData} setSearch={setSearch} />
        </TabPane>

        <TabPane tabId="4">
          <OfferBanner2Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} productData={productData} />
        </TabPane>
        <TabPane tabId="5">
          <CategoryProduct1Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} />
        </TabPane>
        <TabPane tabId="6">
          <OfferBanner3Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} productData={productData} />
        </TabPane>
        <TabPane tabId="7">
          <CategoryProduct2Tab values={values} setSearch={setSearch} setFieldValue={setFieldValue} categoryData={categoryData} />
        </TabPane>

        <TabPane tabId="8">
          <FeaturedBlogTab blogData={blogData} setSearch={setSearch} />
        </TabPane>
        <TabPane tabId="9">
          <SocialMediaTab values={values} setFieldValue={setFieldValue} categoryData={categoryData} blogData={blogData} setSearch={setSearch} />
        </TabPane>
        <TabPane tabId="10">
          <BrandTab values={values} setSearch={setSearch} setFieldValue={setFieldValue} brandData={brandData} brandLoader={brandLoader} />
        </TabPane>
      </TabContent>
    </Col>
  );
});
export default AllTabsChristmasHomePage;
