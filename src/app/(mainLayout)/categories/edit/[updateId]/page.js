"use client";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import dynamic from "next/dynamic";
import { Category, CategoryExportAPI, CategoryImportAPI } from "@/utils/axiosUtils/API";
import CategoryForm from "@/components/category/CategoryForm";
import TreeForm from "@/components/category/TreeForm";
import usePermissionCheck from "@/utils/hooks/usePermissionCheck";
import useCreate from "@/utils/hooks/useCreate";
import TitleWithDropDown from "@/components/common/TitleWithDropDown";
import { useParams } from "next/navigation";

const CategoryUpdate1 = () => {
  const params = useParams();
  const TableTitle = dynamic(() => import("@/components/table/TableTitle"), {
    ssr: false,
  });
  const [edit] = usePermissionCheck(["edit"]);
  const { mutate, isLoading } = useCreate(`${Category}/${params?.updateId}`, false, "/category", false);
  return (
    <>
      <Container fluid={true}>
        <Row>
          <Col xl="4">
            <Card>
              <CardBody>
                <TitleWithDropDown pathName="/category" moduleName="Category" importExport={{ importUrl: CategoryImportAPI, exportUrl: CategoryExportAPI }} />
                <TreeForm type={"product"} isLoading={isLoading} />
              </CardBody>
            </Card>
          </Col>
          <Col xl="8">
            <Card>
              {edit ? (
                <CardBody>
                  <TableTitle moduleName="Edit Category" onlyTitle={true} />
                  {params?.updateId && <CategoryForm mutate={mutate} updateId={params?.updateId} loading={isLoading} type={"product"} buttonName="Update" />}
                </CardBody>
              ) : (
                <h1>No Permission</h1>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CategoryUpdate1;
