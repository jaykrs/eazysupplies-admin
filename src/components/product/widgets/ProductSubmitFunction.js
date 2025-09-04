import allPossibleCases from "../../../utils/customFunctions/AllPossibleCases";

const ProductSubmitFunction = (mutate, value, updateId) => {
  if (value["type"] == "classified") {
    delete value["quantity"];
    delete value["price"];
    delete value["sale_price"];
    delete value["discount"];
  }
  if (value["is_random_related_products"]) {
    value["related_products"] = [];
  }
  value["is_sale_enable"] = Number(value["is_sale_enable"]);
  value["is_random_related_products"] = Number(value["is_random_related_products"]);
  value["is_free_shipping"] = Number(value["is_free_shipping"]);
  value["is_featured"] = Number(value["is_featured"]);
  value["safe_checkout"] = Number(value["safe_checkout"]);
  value["secure_checkout"] = Number(value["secure_checkout"]);
  value["social_share"] = Number(value["social_share"]);
  value["encourage_order"] = Number(value["encourage_order"]);
  value["encourage_view"] = Number(value["encourage_view"]);
  value["is_trending"] = Number(value["is_trending"]);
  value["is_return"] = Number(value["is_return"]);
  value["status"] = Number(value["status"]);

  value["variations"] = value?.variations?.map((elem, ind) => {
    return {
      ...elem,
      discount: null,
      is_licensable: Number(elem["is_licensable"]),
      is_licensekey_auto: Number(elem["is_licensekey_auto"]),
      status: Number(elem["status"]),
      digital_file_ids: elem?.digital_file_ids ? elem?.digital_file_ids : null,
      separator: elem.separator ? elem.separator : "",
      license_key: elem.license_key ? elem.license_key : "",
      variation_image_id: elem.variation_image_id ? elem.variation_image_id : null,
      attribute_values: allPossibleCases(value["combination"]?.map((item) => item?.values?.map((elem) => elem)))[ind],
    };
  });
  // Put Your Logic Here
};

export default ProductSubmitFunction;
