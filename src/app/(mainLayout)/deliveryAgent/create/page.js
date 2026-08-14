'use client'
import FormWrapper from "@/utils/hoc/FormWrapper";
import DeliveryAgentForm from "@/components/deliveryAgent/DeliveryAgentForm";

const CreateDeliveryAgent = () => {
  return (
    <FormWrapper title="Delivery Agent">
      <DeliveryAgentForm  buttonName="Save"/>
    </FormWrapper>
  );
};

export default CreateDeliveryAgent;
